import { SheetsManager } from "jss";

const manager: any = new SheetsManager();

class Theme {
    private _background: string = "blue";
    private _width: string = "100%";

    private updateStylesheets(): void {
        manager.sheets.forEach((sheet: any) => {
            sheet.update(this);
        });
    }

    get background(): string {
        return this._background;
    }

    set background(value: string) {
        this._background = value;
        this.updateStylesheets();
    }

    get width(): string {
        return this._width;
    }

    set width(value: string) {
        this._width = value;
        this.updateStylesheets();
    }
}

const theme: any = new Theme();

export default manager;

export { theme };
