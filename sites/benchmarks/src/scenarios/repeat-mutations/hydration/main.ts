import { signalDone } from "../../harness.js";
import { initializeMutationBenchmark } from "../element.js";

await initializeMutationBenchmark(true);
signalDone();
