<#
.SYNOPSIS
Build and measure an isolated source snapshot; never swaps shared renderer files.
.DESCRIPTION
SourceRoot contains crates\microsoft-fast-build (for example extracted git archive).
The current benchmark example is copied into that snapshot before building.
Run baseline and candidate with identical Iterations/Repeats on an otherwise idle
machine. CompareDirectory checks exact owned-output bytes, SHA256, state and
artifact identities against the earlier run. Setup is outside render timers.
Iterations is a base count: small-page uses 1000x, mixed-light-shadow 20x,
binding-heavy 1x, other cases 4x so process CPU samples are less quantized.
Timing uses an inactive allocator shim (one relaxed flag read per allocator call).
CPU is Windows process user+kernel time for the whole loop INCLUDING validation,
result destruction and timers, not pure rendering CPU; small loops may read zero.
Allocation measurements are a SEPARATE instrumented pass and are not timings.
Requested sizes count realloc's full new capacity; realloc may happen in place.
Peak live bytes are logical Rust allocator requests, not RSS, allocator usable
sizes, fragmentation, stack, OS heap metadata or transient realloc overlap.
Retained bytes are measured after dropping each output; artifact and prepared
state retained/peak bytes are reported separately (they remain live across calls).
Copied bytes are unmeasured: allocator bytes do NOT measure memcpy, in-place moves,
split_off, append, escaping, final flattening, or stack writes. No copy-saving
claim can be inferred from allocation counts alone. Output hashing and equality
are outside call timers; final owned-output assembly is inside.
The benchmark intentionally adds no renderer instrumentation or dependencies.
Standalone sequential baseline/candidate runs are not randomized paired trials.
Use run-shadow-comparison.ps1 to alternate implementations per workload; rerun
under matched power/thermal conditions before interpreting small differences.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$SourceRoot,
    [Parameter(Mandatory = $true)][string]$OutputDirectory,
    [string]$CompareDirectory,
    [ValidateRange(1, 1000000)][int]$Iterations = 300,
    [ValidateRange(1, 100)][int]$Repeats = 5,
    [ValidateSet("deep-nested", "wide-siblings", "mixed-light-shadow", "mostly-static", "binding-heavy", "empty-shadows", "small-page")]
    [string[]]$Cases = @("deep-nested", "wide-siblings", "mixed-light-shadow", "mostly-static", "binding-heavy", "empty-shadows", "small-page"),
    [switch]$SkipBuild,
    [string]$Label = "unlabelled"
)
$ErrorActionPreference = "Stop"
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
$SourceRoot = [IO.Path]::GetFullPath($SourceRoot)
$OutputDirectory = [IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
$crate = Join-Path $SourceRoot "crates\microsoft-fast-build"
$harness = Join-Path $PSScriptRoot "..\examples\native-shadow-benchmark.rs"
$destination = Join-Path $crate "examples\native-shadow-benchmark.rs"
if ([IO.Path]::GetFullPath($harness) -ne [IO.Path]::GetFullPath($destination)) {
    Copy-Item $harness $destination -Force
}
$manifest = Join-Path $crate "Cargo.toml"
$target = Join-Path $SourceRoot "shadow-benchmark-target"
if (-not $SkipBuild) {
    & cargo build --release --locked --manifest-path $manifest --target-dir $target --example native-shadow-benchmark
    if ($LASTEXITCODE -ne 0) { throw "Benchmark build failed" }
}
$binary = Join-Path $target "release\examples\native-shadow-benchmark.exe"
if (-not (Test-Path $binary)) {
    $binary = Join-Path $target "release\examples\native-shadow-benchmark"
}
$metadata = [ordered]@{
    label = $Label
    capturedUtc = [DateTime]::UtcNow.ToString("o")
    sourceRoot = $SourceRoot
    iterations = $Iterations
    repeats = $Repeats
    rustc = ((& rustc -Vv) -join "`n")
    cargo = ((& cargo -V) -join "`n")
    os = [Environment]::OSVersion.ToString()
    logicalProcessors = [Environment]::ProcessorCount
    processorIdentifier = $env:PROCESSOR_IDENTIFIER
    rustflags = $env:RUSTFLAGS
    cargoEncodedRustflags = $env:CARGO_ENCODED_RUSTFLAGS
    harnessSha256 = (Get-FileHash $destination -Algorithm SHA256).Hash
    rendererSha256 = (Get-FileHash (Join-Path $crate "src\native.rs") -Algorithm SHA256).Hash
    executableSha256 = (Get-FileHash $binary -Algorithm SHA256).Hash
    executable = $binary
    copiedBytes = $null
    limitations = "See run-shadow-benchmark.ps1 help. CPU includes verification/drop; logical requested allocation sizes are not RSS or copied bytes. Scheduling is controlled by the caller; run-shadow-comparison.ps1 alternates implementations per workload."
}
if ($CompareDirectory) {
    $referenceMetadata = Get-Content (Join-Path $CompareDirectory "metadata.json") -Raw | ConvertFrom-Json
    foreach ($field in @("iterations", "repeats", "rustc", "cargo", "harnessSha256")) {
        if ($metadata[$field] -ne $referenceMetadata.$field) {
            throw "Mismatched reference metadata: $field"
        }
    }
}
$metadata | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $OutputDirectory "metadata.json")
$rows = [Collections.Generic.List[object]]::new()
foreach ($case in $cases) {
    $canonical = $null
    foreach ($boundary in @("fresh-json", "prepared")) {
        foreach ($pass in @("timing", "memory")) {
            for ($repeat = 1; $repeat -le $Repeats; $repeat++) {
                $stem = "$case.$boundary.$pass.$repeat"
                $output = Join-Path $OutputDirectory "$stem.html"
                $multiplier = switch ($case) {
                    "small-page" { 1000 }
                    "mixed-light-shadow" { 20 }
                    "binding-heavy" { 1 }
                    default { 4 }
                }
                $count = if ($pass -eq "memory") { 3 } else { $Iterations * $multiplier }
                $raw = & $binary $case $boundary $pass $count $output
                if ($LASTEXITCODE -ne 0) { throw "Benchmark failed: $stem" }
                $report = $raw | ConvertFrom-Json
                $sha256 = (Get-FileHash $output -Algorithm SHA256).Hash
                if ($null -eq $canonical) {
                    $canonical = $output
                } elseif (-not [Linq.Enumerable]::SequenceEqual(
                    [byte[]][IO.File]::ReadAllBytes($canonical),
                    [byte[]][IO.File]::ReadAllBytes($output)
                )) {
                    throw "Boundary/pass output differs: $stem"
                }
                if ($CompareDirectory) {
                    $referenceOutput = Join-Path $CompareDirectory "$stem.html"
                    $reference = Get-Content (Join-Path $CompareDirectory "$stem.json") -Raw | ConvertFrom-Json
                    if (-not [Linq.Enumerable]::SequenceEqual(
                        [byte[]][IO.File]::ReadAllBytes($referenceOutput),
                        [byte[]][IO.File]::ReadAllBytes($output)
                    )) {
                        throw "Baseline/candidate output differs: $stem"
                    }
                    foreach ($field in @("artifactFnv1a64", "stateFnv1a64", "outputFnv1a64", "outputBytes")) {
                        if ($report.$field -ne $reference.$field) {
                            throw "Baseline/candidate identity differs ($field): $stem"
                        }
                    }
                }
                $report | Add-Member -NotePropertyName outputSha256 -NotePropertyValue $sha256
                $report | ConvertTo-Json -Depth 12 | Set-Content (Join-Path $OutputDirectory "$stem.json")
                $rows.Add($report)
            }
        }
    }
    Write-Host "Verified $case (both boundaries, both passes, $Repeats repeats)"
}
$summary = foreach ($case in $cases) {
    foreach ($boundary in @("fresh-json", "prepared")) {
        $timing = @($rows | Where-Object { $_.case -eq $case -and $_.boundary -eq $boundary -and $_.pass -eq "timing" })
        $memory = @($rows | Where-Object { $_.case -eq $case -and $_.boundary -eq $boundary -and $_.pass -eq "memory" })
        $medians = @($timing.medianRenderNs | Sort-Object)
        $requests = @($memory.memorySamples | ForEach-Object { $_.request })
        [pscustomobject]@{
            case = $case
            boundary = $boundary
            medianRenderNs = $medians[[int][Math]::Floor($medians.Length / 2)]
            meanRenderNs = ($timing.meanRenderNs | Measure-Object -Average).Average
            minProcessMedianNs = $medians[0]
            maxProcessMedianNs = $medians[-1]
            meanLoopCpuNsPerRequest = ($timing.loopCpuNsIncludesVerificationAndDrop | Measure-Object -Average).Average / $timing[0].iterations
            meanAllocationCalls = ($requests.allocationCalls | Measure-Object -Average).Average
            meanReallocationCalls = ($requests.reallocationCalls | Measure-Object -Average).Average
            meanAllocatedRequestedBytes = ($requests.allocatedRequestedBytes | Measure-Object -Average).Average
            peakLiveRequestedBytes = ($requests.peakLiveRequestedBytes | Measure-Object -Maximum).Maximum
            retainedAfterOutputDropBytes = ($requests.retainedRequestedBytes | Measure-Object -Maximum).Maximum
            artifactRetainedBytes = $memory[0].artifactLoadMemory.retainedRequestedBytes
            preparedStateRetainedBytes = $memory[0].preparedStateMemory.retainedRequestedBytes
            outputBytes = $timing[0].outputBytes
            outputSha256 = $timing[0].outputSha256
        }
    }
}
$summary | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $OutputDirectory "summary.json")
$summary | Export-Csv -NoTypeInformation (Join-Path $OutputDirectory "summary.csv")
$summary | Format-Table case, boundary, medianRenderNs, meanAllocationCalls, peakLiveRequestedBytes, retainedAfterOutputDropBytes
if ($CompareDirectory) {
    $baseline = Get-Content (Join-Path $CompareDirectory "summary.json") -Raw | ConvertFrom-Json
    $comparison = foreach ($row in $summary) {
        $reference = $baseline | Where-Object { $_.case -eq $row.case -and $_.boundary -eq $row.boundary }
        [pscustomobject]@{
            case = $row.case
            boundary = $row.boundary
            wallLatencyReductionPercent = 100 * (1 - $row.medianRenderNs / $reference.medianRenderNs)
            medianRenderPercentChange = 100 * ($row.medianRenderNs / $reference.medianRenderNs - 1)
            meanRenderPercentChange = 100 * ($row.meanRenderNs / $reference.meanRenderNs - 1)
            loopCpuPercentChange = if ($reference.meanLoopCpuNsPerRequest -gt 0) { 100 * ($row.meanLoopCpuNsPerRequest / $reference.meanLoopCpuNsPerRequest - 1) } else { $null }
            allocationCallsChange = $row.meanAllocationCalls - $reference.meanAllocationCalls
            allocatedBytesPercentChange = 100 * ($row.meanAllocatedRequestedBytes / $reference.meanAllocatedRequestedBytes - 1)
            peakLiveBytesPercentChange = 100 * ($row.peakLiveRequestedBytes / $reference.peakLiveRequestedBytes - 1)
            outputSha256Equal = $row.outputSha256 -eq $reference.outputSha256
        }
    }
    $comparison | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $OutputDirectory "comparison.json")
    $comparison | Export-Csv -NoTypeInformation (Join-Path $OutputDirectory "comparison.csv")
    $comparison | Format-Table case, boundary, medianRenderPercentChange, allocatedBytesPercentChange, peakLiveBytesPercentChange
}
