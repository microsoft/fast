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
describe("FASTDialog", function () {
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page && !this.browser) {
                this.skip();
            }
            this.documentHandle = yield this.page.evaluateHandle(() => document);
            this.setupHandle = yield this.page.evaluateHandle(document => {
                const element = document.createElement("fast-dialog");
                element.id = "testelement";
                const button1 = document.createElement("button");
                button1.id = "button1";
                element.appendChild(button1);
                const button2 = document.createElement("button");
                button2.id = "button2";
                element.appendChild(button2);
                document.body.appendChild(element);
            }, this.documentHandle);
        });
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.setupHandle) {
                yield this.setupHandle.dispose();
            }
        });
    });
    // FASTDialog should render on the page
    it("should render on the page", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.$("fast-dialog");
            expect(element).to.exist;
        });
    });
    // FASTDialog should trap focus
    it("should trap focus", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.$("fast-dialog");
            yield element === null || element === void 0 ? void 0 : element.focus();
            expect(
                yield this.page.evaluate(() => {
                    var _a;
                    return (_a = document.activeElement) === null || _a === void 0
                        ? void 0
                        : _a.id;
                })
            ).to.equal("button1");
            yield element === null || element === void 0 ? void 0 : element.press("Tab");
            expect(
                yield this.page.evaluate(() => {
                    var _a;
                    return (_a = document.activeElement) === null || _a === void 0
                        ? void 0
                        : _a.id;
                })
            ).to.equal("button2");
            yield element === null || element === void 0 ? void 0 : element.press("Tab");
            expect(
                yield this.page.evaluate(() => {
                    var _a;
                    return (_a = document.activeElement) === null || _a === void 0
                        ? void 0
                        : _a.id;
                })
            ).to.equal("button1");
            yield element === null || element === void 0
                ? void 0
                : element.press("Shift+Tab");
            expect(
                yield this.page.evaluate(() => {
                    var _a;
                    return (_a = document.activeElement) === null || _a === void 0
                        ? void 0
                        : _a.id;
                })
            ).to.equal("button2");
            yield element === null || element === void 0
                ? void 0
                : element.press("Shift+Tab");
            expect(
                yield this.page.evaluate(() => {
                    var _a;
                    return (_a = document.activeElement) === null || _a === void 0
                        ? void 0
                        : _a.id;
                })
            ).to.equal("button1");
        });
    });
});
