import { ArrayObserver } from "@microsoft/fast-element/arrays.js";
import { Observable } from "@microsoft/fast-element/observable.js";
import { Updates } from "@microsoft/fast-element/updates.js";
import { signalDone } from "../harness.js";
import { initializeMutationBenchmark } from "./element.js";
import { mutationItemCount } from "./state.js";

const workload = document.body.dataset.workload;
const arrayOnly = workload === "array-sort" || workload === "array-splices";
const itemCount = workload === "array-sort" ? 10_000 : mutationItemCount;
const { items, container } = arrayOnly
    ? {
          items: Array.from({ length: itemCount }, (_, index) =>
              workload === "array-sort" ? index % 8 : index,
          ),
          container: document.getElementById("container")!,
      }
    : await initializeMutationBenchmark();

ArrayObserver.enable();
const observer = Observable.getNotifier<ArrayObserver>(items);
let deliveries = 0;
observer.subscribe({
    handleChange() {
        deliveries++;
    },
});

performance.mark("bench-start");
for (let iteration = 0; iteration < 8; iteration++) {
    switch (workload) {
        case "array-sort":
        case "sort": {
            const direction = iteration % 2 === 0 ? -1 : 1;
            items.sort((first, second) => direction * (first - second));
            break;
        }
        case "array-splices": {
            const replacement = Array.from(
                { length: itemCount },
                (_, index) => (index + (iteration + 1) * 47) % itemCount,
            );
            items.splice(0, items.length, ...replacement);
            break;
        }
        case "reverse": {
            items.reverse();
            break;
        }
        case "prepend": {
            items.unshift(
                ...Array.from(
                    { length: 128 },
                    (_, index) => -(iteration * 128 + index + 1),
                ),
            );
            break;
        }
        case "mixed": {
            items.sort((first, second) => second - first);
            items.push(itemCount + iteration);
            items.reverse();
            break;
        }
        default: {
            throw new Error(`Unknown repeat mutation workload: ${workload}`);
        }
    }

    if (arrayOnly) {
        observer.flush();
        continue;
    }

    await Updates.next();
    if (container.querySelector("span")?.textContent !== String(items[0])) {
        throw new Error(
            `Incorrect first item after ${workload} delivery ${iteration + 1}`,
        );
    }
}
await Updates.next();
performance.mark("bench-end");

if (deliveries !== 8) {
    throw new Error(`Expected 8 array deliveries, received ${deliveries}`);
}

if (!arrayOnly) {
    const nodes = container.querySelectorAll("span");
    if (
        nodes.length !== items.length ||
        items.some((item, index) => nodes[index].textContent !== String(item))
    ) {
        throw new Error(`Incorrect rendered order for ${workload}`);
    }
}

signalDone();
