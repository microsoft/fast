import { SheetsManager } from "jss";

const manager: any = new SheetsManager();

class Theme {
    private Background: string = "blue";
    private Width: string = "100%";

    private updateStylesheets(): void {
        manager.sheets.forEach((sheet: any) => {
            sheet.update(this);
        });
    }

    get background(): string {
        return this.Background;
    }

    set background(value: string) {
        this.Background = value;
        this.updateStylesheets();
    }

    get width(): string {
        return this.Width;
    }

    set width(value: string) {
        this.Width = value;
        this.updateStylesheets();
    }
}

const theme: any = new Theme();

export default manager;

export { theme };
