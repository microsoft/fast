var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { expect } from "chai";
import { DOM } from "./dom";
describe("The DOM facade", () => {
    it("can batch updates", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            let work1 = 0;
            let work2 = 0;
            const task1 = () => work1++;
            const task2 = () => work2++;
            DOM.queueUpdate(task1);
            expect(work1).to.equal(0);
            DOM.queueUpdate(task2);
            expect(work1).to.equal(0);
            expect(work2).to.equal(0);
            yield DOM.nextUpdate();
            expect(work1).to.equal(1);
            expect(work2).to.equal(1);
        }));
});
