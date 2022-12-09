export interface RenameGeneratorSchema {
    project: string;
    rename: string;
    target: 'parent folder' | 'project';
}