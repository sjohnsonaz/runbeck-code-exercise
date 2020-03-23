import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { IFileField } from 'sierra';

import config from '../config.js';

import FileStore from '../stores/FileStore';
import { IFile } from '../models/IFile.js';
import { FileFormat } from '../models/FileFormat.js';

export default class FileManager {
    store: FileStore;

    constructor(store: FileStore) {
        this.store = store;
    }

    async list(query: any) {
        let subscriptions = await this.store.list(query);
        let results = {
            data: subscriptions,
            count: subscriptions.length
        };
        return results;
    }

    async get(id: string) {
        return this.store.get(id);
    }

    async create(file: Partial<IFile>) {
        return this.store.create(file);
    }

    async update(id: string, file: Partial<IFile> | any) {
        return this.store.update(id, file);
    }

    async delete(id: string) {
        return this.store.delete(id);
    }

    async uploadFile(file: IFileField) {
        let id = await this.create({
            name: file.filename
        });
        let filePath = path.join(config.uploadPath, id + '.txt');
        await new Promise<string>((resolve, reject) => {
            fs.writeFile(filePath, file.data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(filePath);
                }
            });
        });
        return id;
    }

    async processFile(id: string, format: FileFormat, fields: number) {
        let filePath = path.join(config.uploadPath, id + '.txt');
        let parsedPath = path.parse(filePath);
        let correctPath = path.join(parsedPath.dir, parsedPath.name + '_correct' + parsedPath.ext);
        let incorrectPath = path.join(parsedPath.dir, parsedPath.name + '_incorrect' + parsedPath.ext);
        let fileStream = fs.createReadStream(filePath);
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
                if (parts.length === fields) {
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
        this.update(id, {
            $set: {
                format: format,
                fields: fields,
                correct: !!correctWriter,
                incorrect: !!incorrectWriter
            }
        });
        return {
            header: header,
            path: filePath,
            correct: correctPath,
            incorrectPath: incorrectPath
        };
    }
}