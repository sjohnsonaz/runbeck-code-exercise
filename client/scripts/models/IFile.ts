import { IDocument } from "../base/IDocument";
import { FileFormat } from "./FileFormat";

export interface IFile extends IDocument {
    name: string;
    format: FileFormat;
    fields: number;
    correct: boolean;
    incorrect: boolean;
}