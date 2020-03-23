import { FileFormat } from "./FileFormat";

export interface IFile {
    name: string;
    format: FileFormat;
    fields: number;
    correct: boolean;
    incorrect: boolean;
}