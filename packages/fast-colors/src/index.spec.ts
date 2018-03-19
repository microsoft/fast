import { variants } from './index';

const Blue = variants("#0078D7");

test("blue", () => {
    console.log(Blue);
    expect(1 + 1).toBe(2);
})
