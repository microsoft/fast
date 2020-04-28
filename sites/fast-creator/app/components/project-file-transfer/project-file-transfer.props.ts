import { ProjectFile } from "app/creator.props";

export interface ProjectFileTransferProps {
    /**
     * The current project file in use
     */
    projectFile: ProjectFile;

    onUpdateProjectFile: (projectFile: ProjectFile) => void;
}
