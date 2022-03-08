import { expect } from "chai";
import { FAST } from './platform';

describe("The FAST global", () => {
    context("kernel API", () => {
        it("can get a lazily defined service by id", () => {
            const id = 'test-id';
            const service = {};
            const found = FAST.getById(id, () => service);

            expect(found).to.equal(service);
        });

        it("returns the first service defined for an id", () => {
            const id = 'test-id-2';
            const service1 = {};
            const service2 = {};
            const found1 = FAST.getById(id, () => service1);
            const found2 = FAST.getById(id, () => service2);

            expect(found1).to.equal(service1);
            expect(found2).to.equal(service1);
        });

        it("returns null for optional services", () => {
            const id = 'test-id-3';
            const found = FAST.getById(id);

            expect(found).to.be.null;
        });
    });
});
