# Native hydration marker assembly benchmarks

Measurements cover complete rendering and controls at the recorded revisions. They are not a universal performance guarantee.

- Baseline: `4ad07a7e4dfc0447f566959b38ebd09ecfb112b3`; measured revision: `a551799691006b77f78dbd6be716621d1ab36999`.
- Baseline includes change #7842; related existing native optimization is #7841.
- All **217 selectors** are retained, plus **864 timing-phase**, **675 native-allocation**, and **480 process-memory** metric rows.
- Percentage convention: `100 * (candidate / baseline - 1)`. **Negative=faster; positive=slower**, relative to baseline elapsed time. Absolute times are milliseconds; zero-baseline percentages are unsupported.
- Node primary values are medians of five process-local 100-render averages. Rust primary values are medians of five process-local iteration medians. Browser values are the original ten-sample medians. No unlike phases are combined; no aggregate or universal speedup is claimed.

## Selected complete rendering and unhydrated controls

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| repeated-custom-elements/count-200 | disabled; fresh-json | warmMs | 0.328150 | 0.328800 | +0.20% |
| repeated-custom-elements/count-200 | default; fresh-json | warmMs | 0.996300 | 0.792350 | -20.47% |
| repeated-custom-elements/count-200 | v2; fresh-json | warmMs | 1.107850 | 0.840600 | -24.12% |
| plain-element-bindings/count-200 | disabled; fresh-json | warmMs | 0.328850 | 0.331600 | +0.84% |
| plain-element-bindings/count-200 | default; fresh-json | warmMs | 0.605200 | 0.476500 | -21.27% |
| plain-element-bindings/count-200 | v2; fresh-json | warmMs | 0.664650 | 0.492150 | -25.95% |
| adjacent-bindings-and-nested-components | disabled; fresh-json | warmMs | 0.009100 | 0.009000 | -1.10% |
| adjacent-bindings-and-nested-components | default; fresh-json | warmMs | 0.898750 | 0.479250 | -46.68% |
| adjacent-bindings-and-nested-components | v2; fresh-json | warmMs | 1.207000 | 0.616450 | -48.93% |

All **45 hydration-disabled controls**, both supported hydration marker modes, all three native request APIs, empty paths, nested repeats and components remain in the full tables. Their allocation counts/bytes, peak-live counters and retained bytes are reported, not inferred from hydrated results.

## Memory and acceptance trade-offs

In the primary allocation diagnostic, no selector increases allocation calls,
cumulative allocated bytes or peak-live requested bytes. Retained request bytes
after owned-output destruction are zero in all measured selectors.

Across the three diagnostic replicates, four selectors have candidate peak maxima
above baseline maxima: one unhydrated typed binding case differs by 40 bytes, and
three zero-count typed overlay cases differ by 12 bytes. Their sample ranges
overlap. These small differences are also present in controls; no deterministic
explanation or universal peak-memory reduction is claimed.

The prepared v2 large-state/no-overlay case retains the baseline 46,239-byte peak,
while allocation calls fall from 1,212 to 812 and cumulative requested bytes fall
from 154,523 to 128,123. Whole-marker output reservation avoids the output-capacity
growth regression found in the initial experiment.

Allocation totals count final owned String construction and reallocation requests. Instrumented diagnostic timings are excluded. Peak live requested bytes are not physical memory or allocator metadata; NAPI Buffer allocation totals are unsupported. The public replicate file preserves three independent counter observations per revision when present.

## Other measured native render regressions

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| repeated-custom-elements/count-200 | disabled; fresh-json | warmMs | 0.328150 | 0.328800 | +0.20% |
| plain-element-bindings/count-200 | disabled; fresh-json | warmMs | 0.328850 | 0.331600 | +0.84% |
| large-root-state-without-overlay/count-0 | disabled; fresh-json | warmMs | 1.664550 | 1.676650 | +0.73% |
| large-root-state-without-overlay/count-0 | default; fresh-json | warmMs | 1.647850 | 1.659450 | +0.70% |
| large-root-state-without-overlay/count-0 | v2; fresh-json | warmMs | 1.658650 | 1.671600 | +0.78% |
| large-root-state-without-overlay/count-0 | v2; typed | warmMs | 1.755700 | 1.758800 | +0.18% |
| large-root-state-without-overlay/count-200 | disabled; fresh-json | warmMs | 1.680250 | 1.685850 | +0.33% |
| repeated-condition-lookups | default; typed; payload=0 | warmMs | 0.030700 | 0.030800 | +0.33% |
| repeated-condition-lookups | default; typed; payload=1024 | warmMs | 0.030800 | 0.031200 | +1.30% |

## CPU regressions are separate from wall time

| Workload | Selector | Phase | Baseline CPU ms | Candidate CPU ms | CPU change |
| --- | --- | --- | --- | --- | --- |
| literal-component-properties | default | cpuMs | 0.150000 | 0.160000 | +6.67% |
| three-level-nested-repeats | v2 | cpuMs | 2.180000 | 2.190000 | +0.46% |

Windows process CPU observations are coarse and variable. Some short-loop values are zero; sample ranges overlap and are not formal significance tests. A wall-time gain does not erase a positive measured CPU change. First render, addon/program/compiler load, artifact/input setup, string delivery, warmup and GC changes remain separate in the phase tables. Compilation/compiler loading have one parent-process observation, not five independent worker replicates.

## Unchanged-browser controls

The browser suite covers all 16 client-rendering/hydration scenarios and all 18 hydration CPU workload/browser combinations. Browser-build output byte equality is checked separately. When client assets and prerendered pages are byte-identical, browser shifts are scheduling/tracing/timer controls—not evidence that native marker assembly changed client execution. All browser regressions remain in the 217-row appendix and all nine browser metrics remain in the phase CSV/JSON.

## Complete suite inventory and blockers

| Suite | Coverage/settings |
| --- | --- |
| Native Node rendering | 12 workloads × default/v2; five processes, 200 instances, 100 renders, 20 warmups; owned Buffer and string delivery |
| Existing Rust state-boundary example | Four cases × three APIs × two payload sizes; five processes, count 200, 100 iterations, original warmup |
| Additional full-native rendering | 15 fixtures × disabled/default/v2 × three APIs; five processes, 100 iterations, 20 warmups |
| Shared corpus and runner qualification | 51 checks; all four optional profile phases exercised |
| Browser rendering scenarios | Eight feature families × client-render/hydration; Chromium; ten samples plus warmup |
| Browser hydration CPU | Six workloads × Chromium/Firefox/WebKit; ten samples plus warmup, one worker, zero retries |
| Optional profile entry point | Diagnostic alias of the same native runner; not a separate duplicate workload suite |
| Converter/Cargo additional benchmarks | No standalone timed converter benchmark or additional Cargo benchmark executable defined |
| External Azure pipeline | Unrun: external template and hosted infrastructure unavailable locally |
| Other diagnostics | Bundle-size scripts and semantic readiness fixtures are not runtime timing suites; native OS sampler options do not support Windows |

Same Windows host: AMD EPYC 7763 exposed as eight cores/16 logical CPUs, 68.7 GB memory, High performance power plan, Node 26.13.0, Rust/Cargo 1.98.1 MSVC, Playwright 1.56.1. Shared host; revisions measured sequentially, not randomized/interleaved. Project builds/tests were coordinated out of timing windows. No statistical-significance claim is made.

## Source and unchanged harness identities

```text
baseline repository tree: 6b91822df9aa67e1c7b6dcae2755a8b7e97e52fc
baseline native source tree: 6f773ac1996d24cd25a8e834120e617e21e62058
measured repository tree: 9cc0ec6ec950b216a593fb1f4b64164f82d39a36
measured native source tree: 3837cc6e8410d40236badcb865e6520a044072d7
harness source SHA256: F04B1B17843A96F696FFF4F5856027B6157D6D6746C88654AC1333D5AC6F2D24
fixture inputs SHA256: BBB51936883EAED2CB93A5136E37E4FD5D2D401E66BF4F363DEEE1F523E11055
harness Cargo.lock SHA256: 6DD4C6636C77FC9ED1C36C4C3130E5F5BBE7114068CA44C13229E9AC76A03C3F
```

The full source-tree/manifest/lock identities are in `source-harness-identities.json`. Identical harness source/settings do not mean identical linked executable bytes: renderer code differs by measured revision. Reports do not cover later worktree edits.

## Complete recorded evidence

- [All 217 primary comparisons](./comparison-primary.csv).
- [All 864 timing-phase comparisons](./comparison-phases.csv), including CPU,
  loading, first/warm rendering and browser metrics.
- [All 675 native allocation comparisons](./comparison-native-allocations.csv).
- [All 480 process-memory comparisons](./comparison-process-memory.csv).
- [Allocation diagnostic replicates](./allocation-diagnostic-replicates.csv).
- [Source and unchanged harness identities](./source-harness-identities.json).

The additional native probe is a measurement-only public-API harness, not a new
supported library benchmark command. Its exact source and raw samples are retained
in the experiment artifacts; the source/input/lock hashes above identify that
harness. Existing repository benchmark entry points and all measured settings are
listed in the suite inventory.

## Complete benchmark tables

Baseline `4ad07a7e4dfc0447f566959b38ebd09ecfb112b3`; measured revision `a551799691006b77f78dbd6be716621d1ab36999`. Negative elapsed change means faster; positive means slower. All 217 selectors are included; CPU/load/compile and memory metrics are in the complete companion CSV files linked above.

### native-node-rendering

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| static-components | default | warmMs | 0.081778 | 0.078689 | -3.78% |
| large-static-templates | default | warmMs | 1.240938 | 1.150837 | -7.26% |
| unique-component-hosts | default | warmMs | 0.341245 | 0.255746 | -25.06% |
| short-circuit-conditions | default | warmMs | 0.155874 | 0.116974 | -24.96% |
| literal-component-properties | default | warmMs | 0.147435 | 0.123701 | -16.10% |
| plain-element-bindings | default | warmMs | 0.704819 | 0.530342 | -24.75% |
| escaped-text-and-attribute-bindings | default | warmMs | 2.624953 | 2.611331 | -0.52% |
| deep-state-lookups | default | warmMs | 0.082733 | 0.081943 | -0.95% |
| three-level-nested-repeats | default | warmMs | 2.228995 | 2.147868 | -3.64% |
| repeated-custom-elements | default | warmMs | 1.035776 | 0.805884 | -22.20% |
| nested-component-tree | default | warmMs | 0.512555 | 0.368242 | -28.16% |
| large-root-state-overlay | default | warmMs | 3.010865 | 2.808231 | -6.73% |
| static-components | v2 | warmMs | 0.081209 | 0.077894 | -4.08% |
| large-static-templates | v2 | warmMs | 1.225299 | 1.148493 | -6.27% |
| unique-component-hosts | v2 | warmMs | 0.415755 | 0.273801 | -34.14% |
| short-circuit-conditions | v2 | warmMs | 0.210094 | 0.148614 | -29.26% |
| literal-component-properties | v2 | warmMs | 0.180962 | 0.138930 | -23.23% |
| plain-element-bindings | v2 | warmMs | 0.757188 | 0.557981 | -26.31% |
| escaped-text-and-attribute-bindings | v2 | warmMs | 2.628824 | 2.605360 | -0.89% |
| deep-state-lookups | v2 | warmMs | 0.083236 | 0.081467 | -2.13% |
| three-level-nested-repeats | v2 | warmMs | 2.205562 | 2.089383 | -5.27% |
| repeated-custom-elements | v2 | warmMs | 1.253937 | 0.889080 | -29.10% |
| nested-component-tree | v2 | warmMs | 0.574554 | 0.432183 | -24.78% |
| large-root-state-overlay | v2 | warmMs | 3.022680 | 2.814589 | -6.88% |

### native-rust-full-render

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| url-binding-sibling-components/count-0 | disabled; fresh-json | warmMs | 0.000700 | 0.000700 | +0.00% |
| url-binding-sibling-components/count-0 | disabled; typed | warmMs | 0.000400 | 0.000400 | +0.00% |
| url-binding-sibling-components/count-0 | disabled; prepared | warmMs | 0.000000 | 0.000100 | n/a |
| url-binding-sibling-components/count-0 | default; fresh-json | warmMs | 0.000700 | 0.000700 | +0.00% |
| url-binding-sibling-components/count-0 | default; typed | warmMs | 0.000400 | 0.000400 | +0.00% |
| url-binding-sibling-components/count-0 | default; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| url-binding-sibling-components/count-0 | v2; fresh-json | warmMs | 0.000700 | 0.000700 | +0.00% |
| url-binding-sibling-components/count-0 | v2; typed | warmMs | 0.000400 | 0.000400 | +0.00% |
| url-binding-sibling-components/count-0 | v2; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| url-binding-sibling-components/count-200 | disabled; fresh-json | warmMs | 0.010600 | 0.010500 | -0.94% |
| url-binding-sibling-components/count-200 | disabled; typed | warmMs | 0.010500 | 0.010300 | -1.90% |
| url-binding-sibling-components/count-200 | disabled; prepared | warmMs | 0.009900 | 0.009700 | -2.02% |
| url-binding-sibling-components/count-200 | default; fresh-json | warmMs | 0.310250 | 0.189850 | -38.81% |
| url-binding-sibling-components/count-200 | default; typed | warmMs | 0.310600 | 0.190450 | -38.68% |
| url-binding-sibling-components/count-200 | default; prepared | warmMs | 0.311100 | 0.192250 | -38.20% |
| url-binding-sibling-components/count-200 | v2; fresh-json | warmMs | 0.335800 | 0.205850 | -38.70% |
| url-binding-sibling-components/count-200 | v2; typed | warmMs | 0.336600 | 0.204750 | -39.17% |
| url-binding-sibling-components/count-200 | v2; prepared | warmMs | 0.333900 | 0.202950 | -39.22% |
| repeated-custom-elements/count-0 | disabled; fresh-json | warmMs | 0.000900 | 0.000900 | +0.00% |
| repeated-custom-elements/count-0 | disabled; typed | warmMs | 0.000700 | 0.000700 | +0.00% |
| repeated-custom-elements/count-0 | disabled; prepared | warmMs | 0.000200 | 0.000200 | +0.00% |
| repeated-custom-elements/count-0 | default; fresh-json | warmMs | 0.001600 | 0.001500 | -6.25% |
| repeated-custom-elements/count-0 | default; typed | warmMs | 0.001300 | 0.001300 | +0.00% |
| repeated-custom-elements/count-0 | default; prepared | warmMs | 0.000800 | 0.000800 | +0.00% |
| repeated-custom-elements/count-0 | v2; fresh-json | warmMs | 0.001500 | 0.001400 | -6.67% |
| repeated-custom-elements/count-0 | v2; typed | warmMs | 0.001200 | 0.001000 | -16.67% |
| repeated-custom-elements/count-0 | v2; prepared | warmMs | 0.000800 | 0.000600 | -25.00% |
| repeated-custom-elements/count-200 | disabled; fresh-json | warmMs | 0.328150 | 0.328800 | +0.20% |
| repeated-custom-elements/count-200 | disabled; typed | warmMs | 0.348750 | 0.341700 | -2.02% |
| repeated-custom-elements/count-200 | disabled; prepared | warmMs | 0.000200 | 0.000200 | +0.00% |
| repeated-custom-elements/count-200 | default; fresh-json | warmMs | 0.996300 | 0.792350 | -20.47% |
| repeated-custom-elements/count-200 | default; typed | warmMs | 0.996850 | 0.742900 | -25.48% |
| repeated-custom-elements/count-200 | default; prepared | warmMs | 0.643550 | 0.444600 | -30.91% |
| repeated-custom-elements/count-200 | v2; fresh-json | warmMs | 1.107850 | 0.840600 | -24.12% |
| repeated-custom-elements/count-200 | v2; typed | warmMs | 1.210850 | 0.833650 | -31.15% |
| repeated-custom-elements/count-200 | v2; prepared | warmMs | 0.758750 | 0.554900 | -26.87% |
| plain-element-bindings/count-0 | disabled; fresh-json | warmMs | 0.000800 | 0.000800 | +0.00% |
| plain-element-bindings/count-0 | disabled; typed | warmMs | 0.000600 | 0.000600 | +0.00% |
| plain-element-bindings/count-0 | disabled; prepared | warmMs | 0.000200 | 0.000200 | +0.00% |
| plain-element-bindings/count-0 | default; fresh-json | warmMs | 0.001400 | 0.001300 | -7.14% |
| plain-element-bindings/count-0 | default; typed | warmMs | 0.001100 | 0.001100 | +0.00% |
| plain-element-bindings/count-0 | default; prepared | warmMs | 0.000800 | 0.000700 | -12.50% |
| plain-element-bindings/count-0 | v2; fresh-json | warmMs | 0.001400 | 0.001200 | -14.29% |
| plain-element-bindings/count-0 | v2; typed | warmMs | 0.001200 | 0.001000 | -16.67% |
| plain-element-bindings/count-0 | v2; prepared | warmMs | 0.000700 | 0.000600 | -14.29% |
| plain-element-bindings/count-200 | disabled; fresh-json | warmMs | 0.328850 | 0.331600 | +0.84% |
| plain-element-bindings/count-200 | disabled; typed | warmMs | 0.350250 | 0.344400 | -1.67% |
| plain-element-bindings/count-200 | disabled; prepared | warmMs | 0.000200 | 0.000200 | +0.00% |
| plain-element-bindings/count-200 | default; fresh-json | warmMs | 0.605200 | 0.476500 | -21.27% |
| plain-element-bindings/count-200 | default; typed | warmMs | 0.618550 | 0.483700 | -21.80% |
| plain-element-bindings/count-200 | default; prepared | warmMs | 0.258500 | 0.128900 | -50.14% |
| plain-element-bindings/count-200 | v2; fresh-json | warmMs | 0.664650 | 0.492150 | -25.95% |
| plain-element-bindings/count-200 | v2; typed | warmMs | 0.679100 | 0.502450 | -26.01% |
| plain-element-bindings/count-200 | v2; prepared | warmMs | 0.308350 | 0.153600 | -50.19% |
| many-component-definitions/count-0 | disabled; fresh-json | warmMs | 0.000500 | 0.000500 | +0.00% |
| many-component-definitions/count-0 | disabled; typed | warmMs | 0.000300 | 0.000300 | +0.00% |
| many-component-definitions/count-0 | disabled; prepared | warmMs | 0.000000 | 0.000100 | n/a |
| many-component-definitions/count-0 | default; fresh-json | warmMs | 0.000500 | 0.000500 | +0.00% |
| many-component-definitions/count-0 | default; typed | warmMs | 0.000300 | 0.000300 | +0.00% |
| many-component-definitions/count-0 | default; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| many-component-definitions/count-0 | v2; fresh-json | warmMs | 0.000500 | 0.000500 | +0.00% |
| many-component-definitions/count-0 | v2; typed | warmMs | 0.000300 | 0.000300 | +0.00% |
| many-component-definitions/count-0 | v2; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| many-component-definitions/count-200 | disabled; fresh-json | warmMs | 0.008900 | 0.008900 | +0.00% |
| many-component-definitions/count-200 | disabled; typed | warmMs | 0.008600 | 0.008600 | +0.00% |
| many-component-definitions/count-200 | disabled; prepared | warmMs | 0.008400 | 0.008300 | -1.19% |
| many-component-definitions/count-200 | default; fresh-json | warmMs | 0.185950 | 0.126050 | -32.21% |
| many-component-definitions/count-200 | default; typed | warmMs | 0.186900 | 0.125500 | -32.85% |
| many-component-definitions/count-200 | default; prepared | warmMs | 0.186150 | 0.125100 | -32.80% |
| many-component-definitions/count-200 | v2; fresh-json | warmMs | 0.211250 | 0.134000 | -36.57% |
| many-component-definitions/count-200 | v2; typed | warmMs | 0.211550 | 0.133300 | -36.99% |
| many-component-definitions/count-200 | v2; prepared | warmMs | 0.210550 | 0.133150 | -36.76% |
| large-root-state-with-overlay/count-0 | disabled; fresh-json | warmMs | 2.339550 | 2.336400 | -0.13% |
| large-root-state-with-overlay/count-0 | disabled; typed | warmMs | 2.447350 | 2.377250 | -2.86% |
| large-root-state-with-overlay/count-0 | disabled; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| large-root-state-with-overlay/count-0 | default; fresh-json | warmMs | 2.302850 | 2.159700 | -6.22% |
| large-root-state-with-overlay/count-0 | default; typed | warmMs | 2.403900 | 2.241050 | -6.77% |
| large-root-state-with-overlay/count-0 | default; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| large-root-state-with-overlay/count-0 | v2; fresh-json | warmMs | 2.338900 | 2.097100 | -10.34% |
| large-root-state-with-overlay/count-0 | v2; typed | warmMs | 1.923950 | 1.841900 | -4.26% |
| large-root-state-with-overlay/count-0 | v2; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| large-root-state-with-overlay/count-200 | disabled; fresh-json | warmMs | 1.763300 | 1.726400 | -2.09% |
| large-root-state-with-overlay/count-200 | disabled; typed | warmMs | 1.793800 | 1.753400 | -2.25% |
| large-root-state-with-overlay/count-200 | disabled; prepared | warmMs | 0.008400 | 0.008300 | -1.19% |
| large-root-state-with-overlay/count-200 | default; fresh-json | warmMs | 1.847550 | 1.833650 | -0.75% |
| large-root-state-with-overlay/count-200 | default; typed | warmMs | 1.963100 | 1.887250 | -3.86% |
| large-root-state-with-overlay/count-200 | default; prepared | warmMs | 0.114750 | 0.100200 | -12.68% |
| large-root-state-with-overlay/count-200 | v2; fresh-json | warmMs | 1.910500 | 1.795200 | -6.04% |
| large-root-state-with-overlay/count-200 | v2; typed | warmMs | 1.922000 | 1.877450 | -2.32% |
| large-root-state-with-overlay/count-200 | v2; prepared | warmMs | 0.140900 | 0.108800 | -22.78% |
| large-root-state-without-overlay/count-0 | disabled; fresh-json | warmMs | 1.664550 | 1.676650 | +0.73% |
| large-root-state-without-overlay/count-0 | disabled; typed | warmMs | 1.747350 | 1.739850 | -0.43% |
| large-root-state-without-overlay/count-0 | disabled; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| large-root-state-without-overlay/count-0 | default; fresh-json | warmMs | 1.647850 | 1.659450 | +0.70% |
| large-root-state-without-overlay/count-0 | default; typed | warmMs | 1.748000 | 1.736950 | -0.63% |
| large-root-state-without-overlay/count-0 | default; prepared | warmMs | 0.000100 | 0.000000 | -100.00% |
| large-root-state-without-overlay/count-0 | v2; fresh-json | warmMs | 1.658650 | 1.671600 | +0.78% |
| large-root-state-without-overlay/count-0 | v2; typed | warmMs | 1.755700 | 1.758800 | +0.18% |
| large-root-state-without-overlay/count-0 | v2; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| large-root-state-without-overlay/count-200 | disabled; fresh-json | warmMs | 1.680250 | 1.685850 | +0.33% |
| large-root-state-without-overlay/count-200 | disabled; typed | warmMs | 1.773250 | 1.748350 | -1.40% |
| large-root-state-without-overlay/count-200 | disabled; prepared | warmMs | 0.007400 | 0.007400 | +0.00% |
| large-root-state-without-overlay/count-200 | default; fresh-json | warmMs | 1.795650 | 1.750800 | -2.50% |
| large-root-state-without-overlay/count-200 | default; typed | warmMs | 1.906200 | 1.839150 | -3.52% |
| large-root-state-without-overlay/count-200 | default; prepared | warmMs | 0.099300 | 0.086000 | -13.39% |
| large-root-state-without-overlay/count-200 | v2; fresh-json | warmMs | 1.804650 | 1.773450 | -1.73% |
| large-root-state-without-overlay/count-200 | v2; typed | warmMs | 1.922250 | 1.855300 | -3.48% |
| large-root-state-without-overlay/count-200 | v2; prepared | warmMs | 0.122700 | 0.097200 | -20.78% |
| empty-entry | disabled; fresh-json | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | disabled; typed | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | disabled; prepared | warmMs | 0.000100 | 0.000000 | -100.00% |
| empty-entry | default; fresh-json | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | default; typed | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | default; prepared | warmMs | 0.000100 | 0.000000 | -100.00% |
| empty-entry | v2; fresh-json | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | v2; typed | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-entry | v2; prepared | warmMs | 0.000100 | 0.000100 | +0.00% |
| empty-conditional-and-repeat | disabled; fresh-json | warmMs | 0.000700 | 0.000700 | +0.00% |
| empty-conditional-and-repeat | disabled; typed | warmMs | 0.000700 | 0.000700 | +0.00% |
| empty-conditional-and-repeat | disabled; prepared | warmMs | 0.000200 | 0.000200 | +0.00% |
| empty-conditional-and-repeat | default; fresh-json | warmMs | 0.001500 | 0.001300 | -13.33% |
| empty-conditional-and-repeat | default; typed | warmMs | 0.001400 | 0.001200 | -14.29% |
| empty-conditional-and-repeat | default; prepared | warmMs | 0.000900 | 0.000700 | -22.22% |
| empty-conditional-and-repeat | v2; fresh-json | warmMs | 0.001600 | 0.001400 | -12.50% |
| empty-conditional-and-repeat | v2; typed | warmMs | 0.001600 | 0.001300 | -18.75% |
| empty-conditional-and-repeat | v2; prepared | warmMs | 0.001100 | 0.000800 | -27.27% |
| adjacent-bindings-and-nested-components | disabled; fresh-json | warmMs | 0.009100 | 0.009000 | -1.10% |
| adjacent-bindings-and-nested-components | disabled; typed | warmMs | 0.009100 | 0.009000 | -1.10% |
| adjacent-bindings-and-nested-components | disabled; prepared | warmMs | 0.007300 | 0.007300 | +0.00% |
| adjacent-bindings-and-nested-components | default; fresh-json | warmMs | 0.898750 | 0.479250 | -46.68% |
| adjacent-bindings-and-nested-components | default; typed | warmMs | 0.901100 | 0.477100 | -47.05% |
| adjacent-bindings-and-nested-components | default; prepared | warmMs | 0.898050 | 0.474950 | -47.11% |
| adjacent-bindings-and-nested-components | v2; fresh-json | warmMs | 1.207000 | 0.616450 | -48.93% |
| adjacent-bindings-and-nested-components | v2; typed | warmMs | 1.205300 | 0.619350 | -48.61% |
| adjacent-bindings-and-nested-components | v2; prepared | warmMs | 1.198350 | 0.619800 | -48.28% |

### native-rust-state-boundaries

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| repeated-condition-lookups | default; fresh-json; payload=0 | warmMs | 0.030900 | 0.030900 | +0.00% |
| repeated-condition-lookups | default; fresh-json; payload=1024 | warmMs | 0.031500 | 0.031200 | -0.95% |
| repeated-condition-lookups | default; typed; payload=0 | warmMs | 0.030700 | 0.030800 | +0.33% |
| repeated-condition-lookups | default; typed; payload=1024 | warmMs | 0.030800 | 0.031200 | +1.30% |
| repeated-condition-lookups | default; prepared; payload=0 | warmMs | 0.030000 | 0.029800 | -0.67% |
| repeated-condition-lookups | default; prepared; payload=1024 | warmMs | 0.030300 | 0.029700 | -1.98% |
| nested-repeat-bindings | default; fresh-json; payload=0 | warmMs | 0.894400 | 0.884100 | -1.15% |
| nested-repeat-bindings | default; fresh-json; payload=1024 | warmMs | 1.469500 | 1.466100 | -0.23% |
| nested-repeat-bindings | default; typed; payload=0 | warmMs | 0.927700 | 0.889200 | -4.15% |
| nested-repeat-bindings | default; typed; payload=1024 | warmMs | 1.379500 | 1.341700 | -2.74% |
| nested-repeat-bindings | default; prepared; payload=0 | warmMs | 0.195300 | 0.185400 | -5.07% |
| nested-repeat-bindings | default; prepared; payload=1024 | warmMs | 0.203600 | 0.186300 | -8.50% |
| nested-repeat-alias-shadowing | default; fresh-json; payload=0 | warmMs | 0.852100 | 0.810500 | -4.88% |
| nested-repeat-alias-shadowing | default; fresh-json; payload=1024 | warmMs | 1.475800 | 1.409200 | -4.51% |
| nested-repeat-alias-shadowing | default; typed; payload=0 | warmMs | 0.851800 | 0.835500 | -1.91% |
| nested-repeat-alias-shadowing | default; typed; payload=1024 | warmMs | 1.351700 | 1.284000 | -5.01% |
| nested-repeat-alias-shadowing | default; prepared; payload=0 | warmMs | 0.151500 | 0.147900 | -2.38% |
| nested-repeat-alias-shadowing | default; prepared; payload=1024 | warmMs | 0.150700 | 0.148600 | -1.39% |
| nested-component-property-overlay | default; fresh-json; payload=0 | warmMs | 1.443600 | 1.301700 | -9.83% |
| nested-component-property-overlay | default; fresh-json; payload=1024 | warmMs | 2.029600 | 1.886300 | -7.06% |
| nested-component-property-overlay | default; typed; payload=0 | warmMs | 1.469500 | 1.283200 | -12.68% |
| nested-component-property-overlay | default; typed; payload=1024 | warmMs | 1.910500 | 1.763700 | -7.68% |
| nested-component-property-overlay | default; prepared; payload=0 | warmMs | 0.686500 | 0.618800 | -9.86% |
| nested-component-property-overlay | default; prepared; payload=1024 | warmMs | 0.686400 | 0.557500 | -18.78% |

### browser-rendering-scenarios

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| combined-features/client-rendering |  | traceTotalMs | 2.888000 | 2.874000 | -0.48% |
| combined-features/hydration |  | traceTotalMs | 465.142000 | 445.971000 | -4.12% |
| attribute-reflection/client-rendering |  | traceTotalMs | 18.525000 | 19.474000 | +5.12% |
| attribute-reflection/hydration |  | traceTotalMs | 226.378000 | 216.439000 | -4.39% |
| basic-components/client-rendering |  | traceTotalMs | 29.675000 | 31.170000 | +5.04% |
| basic-components/hydration |  | traceTotalMs | 203.212000 | 197.417000 | -2.85% |
| event-bindings/client-rendering |  | traceTotalMs | 21.328000 | 21.561000 | +1.09% |
| event-bindings/hydration |  | traceTotalMs | 230.675000 | 214.288000 | -7.10% |
| property-bindings/client-rendering |  | traceTotalMs | 84.298000 | 83.290000 | -1.20% |
| property-bindings/hydration |  | traceTotalMs | 308.499000 | 293.549000 | -4.85% |
| element-references-and-slots/client-rendering |  | traceTotalMs | 19.197000 | 18.791000 | -2.11% |
| element-references-and-slots/hydration |  | traceTotalMs | 219.615000 | 213.904000 | -2.60% |
| repeat-directives/client-rendering |  | traceTotalMs | 31.178000 | 31.138000 | -0.13% |
| repeat-directives/hydration |  | traceTotalMs | 30.936000 | 29.159000 | -5.74% |
| conditional-directives/client-rendering |  | traceTotalMs | 19.766000 | 20.290000 | +2.65% |
| conditional-directives/hydration |  | traceTotalMs | 220.455000 | 211.872000 | -3.89% |

### browser-hydration-cpu

| Workload | Selector | Metric | Baseline ms | Candidate ms | Elapsed change |
| --- | --- | --- | --- | --- | --- |
| custom-element-hydration | chromium | warmMs | 55.650000 | 49.800000 | -10.51% |
| dom-binding-target-traversal | chromium | warmMs | 5.000000 | 5.000000 | +0.00% |
| native-marker-discovery | chromium | warmMs | 6.850000 | 6.950000 | +1.46% |
| nested-repeat-marker-pairing | chromium | warmMs | 10.100000 | 10.300000 | +1.98% |
| adjacent-repeat-marker-pairing | chromium | warmMs | 7.900000 | 7.700000 | -2.53% |
| combined-nested-hydration | chromium | warmMs | 357.500000 | 349.600000 | -2.21% |
| custom-element-hydration | firefox | warmMs | 101.000000 | 97.000000 | -3.96% |
| dom-binding-target-traversal | firefox | warmMs | 5.000000 | 5.000000 | +0.00% |
| native-marker-discovery | firefox | warmMs | 9.500000 | 9.000000 | -5.26% |
| nested-repeat-marker-pairing | firefox | warmMs | 46.000000 | 44.000000 | -4.35% |
| adjacent-repeat-marker-pairing | firefox | warmMs | 48.500000 | 48.500000 | +0.00% |
| combined-nested-hydration | firefox | warmMs | 1058.000000 | 1036.000000 | -2.08% |
| custom-element-hydration | webkit | warmMs | 55.500000 | 60.000000 | +8.11% |
| dom-binding-target-traversal | webkit | warmMs | 7.000000 | 6.000000 | -14.29% |
| native-marker-discovery | webkit | warmMs | 11.000000 | 11.500000 | +4.55% |
| nested-repeat-marker-pairing | webkit | warmMs | 12.000000 | 12.000000 | +0.00% |
| adjacent-repeat-marker-pairing | webkit | warmMs | 9.500000 | 10.000000 | +5.26% |
| combined-nested-hydration | webkit | warmMs | 468.500000 | 454.000000 | -3.09% |
