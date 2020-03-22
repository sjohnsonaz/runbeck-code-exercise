import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export enum FileFormat {
    CommaSeparated = 'CommaSeparated',
    TabSeparated = 'TabSeparated'
}

export default class FileManager {
    async processFile(name: string, format: FileFormat, fieldCount: number) {
        let parsedPath = path.parse(name);
        let correctPath = path.join(parsedPath.dir, parsedPath.name + '_correct' + parsedPath.ext);
        let incorrectPath = path.join(parsedPath.dir, parsedPath.name + '_incorrect' + parsedPath.ext);
        let fileStream = fs.createReadStream(name);
        let reader = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let correctWriter: fs.WriteStream = undefined as any;
        let incorrectWriter: fs.WriteStream = undefined as any;
        let delimiter: string;
        switch (format) {
            case FileFormat.TabSeparated:
                delimiter = '\t';
                break;
            case FileFormat.CommaSeparated:
            default:
                delimiter = ',';
                break;
        }
        let header: string[] = undefined as any;
        for await (const line of reader) {
            if (!header) {
                header = line.split(delimiter);
            } else {
                let parts = line.split(delimiter);
                if (parts.length === fieldCount) {
                    if (!correctWriter) {
                        correctWriter = fs.createWriteStream(correctPath);
                    }
                    correctWriter.write(line + '\n');
                } else {
                    if (!incorrectWriter) {
                        incorrectWriter = fs.createWriteStream(incorrectPath);
                    }
                    incorrectWriter.write(line + '\n');
                }
            }
        }
        return {
            header: header,
            path: name,
            correct: correctPath,
            incorrectPath: incorrectPath
        };
    }
}