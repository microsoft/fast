import { expect } from "chai";
import { DOM, html } from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";
import { fixture } from "../../__test__/fixture";
import { fastToolingFileActionObjectUrl } from "../file-action-objecturl";
import { File as FastFile } from "./file";
import { fastToolingFile } from "./";

// This is a base 64 encoding of a 2x1 pixel jpeg image.
const imageContent: string =
    "/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD85f2t/wDk6z4nf9jZqv8A6WS0UUV7B8rLdn//2Q==";

// This fake file event allows us to bypass using the real <input type="file"> element by faking the FileList that would have been returned
// by the system file picker.
const fakeFileEvent = {
    composedPath: () => {
        // convert the base64 image encoding into a UTF8 character string
        let n = imageContent.length;
        const u8 = new Uint8Array(n);
        const bstr = atob(imageContent);
        while (n--) {
            u8[n] = bstr.charCodeAt(n);
        }
        const fakeFile = new File([u8], "fakefile.jpg", { type: "image/jpeg" });
        return [
            {
                files: {
                    0: fakeFile,
                    length: 1,
                    item: (index: number) => fakeFile,
                },
            },
        ];
    },
};

async function setup() {
    const { element, connect, disconnect } = await fixture<FastFile>(
        html`
            <fast-tooling-file accept=".png">
                Button Text
                <fast-tooling-file-action-objecturl
                    role="fileaction"
                    slot="action"
                ></fast-tooling-file-action-objecturl>
            </fast-tooling-file>
        `,
        {
            designSystem: DesignSystem.getOrCreate()
                .withPrefix("fast-tooling")
                .register(fastToolingFile(), fastToolingFileActionObjectUrl()),
        }
    );

    return { element, connect, disconnect };
}

describe("File", () => {
    it("should initialize and render", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.action).to.not.be.null;
        expect(element.querySelector("[role=fileaction]")).to.not.be.null;
        expect(element.accept).to.equal(".png");

        let testProgress: number = 0;
        element.progressCallback = (progress: number) => {
            testProgress = progress;
            return null;
        };
        element.handleChange((fakeFileEvent as unknown) as Event);
        await DOM.nextUpdate();
        expect(testProgress).to.equal(1);

        await disconnect();
    });
    it("should trigger change event", async () => {
        const { element, connect, disconnect } = await setup();

        let wasChanged: boolean = false;

        await connect();

        element.addEventListener("change", (e: Event) => {
            wasChanged = true;
        });

        expect(element.fileReferences.length).to.equal(0);

        element.handleChange((fakeFileEvent as unknown) as Event);

        await DOM.nextUpdate();

        expect(element.fileReferences.length).to.equal(1);
        expect(wasChanged).to.equal(true);

        await disconnect();
    });
    it("should call progressCallback", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        let testProgress: number = 0;
        element.progressCallback = (progress: number) => {
            testProgress = progress;
            return null;
        };
        element.handleChange((fakeFileEvent as unknown) as Event);

        await DOM.nextUpdate();

        expect(testProgress).to.equal(1);

        await disconnect();
    });
});
