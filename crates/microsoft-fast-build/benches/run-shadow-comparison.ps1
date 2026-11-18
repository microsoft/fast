<#
.SYNOPSIS
Alternating HEAD/candidate complete-output measurements from isolated snapshots.
.DESCRIPTION
Builds both examples first, then alternates baseline/candidate order on each round
for every workload. Each invocation covers both state boundaries and separate
timing/allocation passes. Builds, compilation, validation, hashes and output I/O
are outside render-call timers. No shared source is replaced or modified.
Read run-shadow-benchmark.ps1 help for metric definitions and limitations.
The inactive allocator shim remains in timed binaries; copied bytes/RSS/stack
memory are NOT measured. CPU includes verification/drop and has OS quantization.
This is a warm-cache local microbenchmark, not a production workload assertion.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$BaselineRoot,
    [Parameter(Mandatory = $true)][string]$CandidateRoot,
    [Parameter(Mandatory = $true)][string]$OutputDirectory,
    [ValidateRange(1, 1000000)][int]$Iterations = 300,
    [ValidateRange(1, 100)][int]$Rounds = 5
)
$ErrorActionPreference = "Stop"
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
$runner = Join-Path $PSScriptRoot "run-shadow-benchmark.ps1"
$harness = Join-Path $PSScriptRoot "..\examples\native-shadow-benchmark.rs"
$roots = @{ baseline = $BaselineRoot; candidate = $CandidateRoot }
foreach ($name in @("baseline", "candidate")) {
    $crate = Join-Path $roots[$name] "crates\microsoft-fast-build"
    Copy-Item $harness (Join-Path $crate "examples\native-shadow-benchmark.rs") -Force
    & cargo build --release --locked --manifest-path (Join-Path $crate "Cargo.toml") `
        --target-dir (Join-Path $roots[$name] "shadow-benchmark-target") `
        --example native-shadow-benchmark
    if ($LASTEXITCODE -ne 0) { throw "$name benchmark build failed" }
}
$cases = @("deep-nested", "wide-siblings", "mixed-light-shadow", "mostly-static", "binding-heavy", "empty-shadows", "small-page")
$all = [Collections.Generic.List[object]]::new()
for ($round = 1; $round -le $Rounds; $round++) {
    foreach ($case in $cases) {
        $reference = Join-Path $OutputDirectory "round-1\$case\baseline"
        $order = if ($round % 2 -eq 1) { @("baseline", "candidate") } else { @("candidate", "baseline") }
        foreach ($name in $order) {
            $destination = Join-Path $OutputDirectory "round-$round\$case\$name"
            $arguments = @{
                SourceRoot = $roots[$name]
                OutputDirectory = $destination
                Iterations = $Iterations
                Repeats = 1
                Cases = @($case)
                SkipBuild = $true
                Label = "$name-alternating-round-$round"
            }
            if ($name -eq "candidate" -or $round -gt 1) {
                $arguments.CompareDirectory = $reference
            }
            & $runner @arguments
            $rows = Get-Content (Join-Path $destination "summary.json") -Raw | ConvertFrom-Json
            foreach ($row in $rows) {
                $row | Add-Member -NotePropertyName implementation -NotePropertyValue $name
                $row | Add-Member -NotePropertyName round -NotePropertyValue $round
                $all.Add($row)
            }
        }
    }
}
$all | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $OutputDirectory "all-samples.json")
$summary = foreach ($case in $cases) {
    foreach ($boundary in @("fresh-json", "prepared")) {
        $metrics = @{}
        foreach ($name in @("baseline", "candidate")) {
            $rows = @($all | Where-Object { $_.case -eq $case -and $_.boundary -eq $boundary -and $_.implementation -eq $name })
            $medians = @($rows.medianRenderNs | Sort-Object)
            $metrics[$name] = [ordered]@{
                medianRenderNs = $medians[[int][Math]::Floor($medians.Length / 2)]
                minProcessMedianNs = $medians[0]
                maxProcessMedianNs = $medians[-1]
                meanRenderNs = ($rows.meanRenderNs | Measure-Object -Average).Average
                meanLoopCpuNsPerRequest = ($rows.meanLoopCpuNsPerRequest | Measure-Object -Average).Average
                allocationCalls = $rows[0].meanAllocationCalls
                reallocationCalls = $rows[0].meanReallocationCalls
                allocatedRequestedBytes = $rows[0].meanAllocatedRequestedBytes
                peakLiveRequestedBytes = ($rows.peakLiveRequestedBytes | Measure-Object -Maximum).Maximum
                retainedAfterOutputDropBytes = ($rows.retainedAfterOutputDropBytes | Measure-Object -Maximum).Maximum
                artifactRetainedBytes = $rows[0].artifactRetainedBytes
                preparedStateRetainedBytes = $rows[0].preparedStateRetainedBytes
                outputBytes = $rows[0].outputBytes
                outputSha256 = $rows[0].outputSha256
            }
        }
        $baseline = $metrics.baseline
        $candidate = $metrics.candidate
        [pscustomobject]@{
            case = $case
            boundary = $boundary
            baseline = $baseline
            candidate = $candidate
            wallLatencyReductionPercent = 100 * (1 - $candidate.medianRenderNs / $baseline.medianRenderNs)
            meanWallLatencyReductionPercent = 100 * (1 - $candidate.meanRenderNs / $baseline.meanRenderNs)
            medianRenderPercentChange = 100 * ($candidate.medianRenderNs / $baseline.medianRenderNs - 1)
            meanRenderPercentChange = 100 * ($candidate.meanRenderNs / $baseline.meanRenderNs - 1)
            loopCpuPercentChange = if ($baseline.meanLoopCpuNsPerRequest -gt 0) { 100 * ($candidate.meanLoopCpuNsPerRequest / $baseline.meanLoopCpuNsPerRequest - 1) } else { $null }
            allocatedBytesPercentChange = 100 * ($candidate.allocatedRequestedBytes / $baseline.allocatedRequestedBytes - 1)
            peakLiveBytesPercentChange = 100 * ($candidate.peakLiveRequestedBytes / $baseline.peakLiveRequestedBytes - 1)
            outputSha256Equal = $candidate.outputSha256 -eq $baseline.outputSha256
        }
    }
}
$summary | ConvertTo-Json -Depth 12 | Set-Content (Join-Path $OutputDirectory "comparison.json")
$summary | Select-Object case,boundary,wallLatencyReductionPercent,meanWallLatencyReductionPercent,loopCpuPercentChange,allocatedBytesPercentChange,peakLiveBytesPercentChange,outputSha256Equal |
    Export-Csv -NoTypeInformation (Join-Path $OutputDirectory "comparison.csv")
$summary | Format-Table case,boundary,wallLatencyReductionPercent,allocatedBytesPercentChange,peakLiveBytesPercentChange,outputSha256Equal
