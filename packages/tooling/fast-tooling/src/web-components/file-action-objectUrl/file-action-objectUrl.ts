import { FileAction } from "../file-action/file-action";

export class FileActionObjectUrl extends FileAction {
    public performFileAction(
        files: FileList,
        completedCallback: (fileReferences:string[])=>void,
        progressCallback?: (progress:number)=>void
    ): void
    {
        this._files = files;
        this._fileReferences = [];
        Array.from(files).forEach((value:File)=>{
            this._fileReferences.push(URL.createObjectURL(value));
            if(progressCallback)
            {
                progressCallback(this._fileReferences.length / this._files.length);
            }
        });

        completedCallback(this._fileReferences);
    }
}
