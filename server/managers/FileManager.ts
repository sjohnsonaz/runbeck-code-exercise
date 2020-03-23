import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { IFileField } from 'sierra';

import config from '../config.js';

import FileStore from '../stores/FileStore';
import { IFile } from '../models/IFile.js';
import { FileFormat } from '../models/FileFormat.js';

/**
 * Manages all Files and File records
 */
export default class FileManager {
    store: FileStore;

    constructor(store: FileStore) {
        this.store = store;
    }

    /**
     * Returns all File records for a query
     * @param query 
     */
    async list(query: any) {
        let subscriptions = await this.store.list(query);
        let results = {
            data: subscriptions,
            count: subscriptions.length
        };
        return results;
    }

    /**
     * Returns a File record for an id
     * @param id 
     */
    async get(id: string) {
        return this.store.get(id);
    }

    /**
     * Creates a File record
     * @param file 
     */
    async create(file: Partial<IFile>) {
        return this.store.create(file);
    }

    /**
     * Updates a File record for an id
     * @param id 
     * @param file 
     */
    async update(id: string, file: Partial<IFile> | any) {
        return this.store.update(id, file);
    }

    /**
     * Deletes all Files and File records for an id
     * @param id 
     */
    async delete(id: string) {
        let file = await this.get(id);
        if (file) {
            let filePath = path.join(config.uploadPath, file._id + '.txt');
            try {
                await this.unlink(filePath);
            }
            catch {

            }
            if (file.correct) {
                let correctFilePath = path.join(config.uploadPath, file._id + '_correct.txt');
                try {
                    await this.unlink(correctFilePath);
                }
                catch {

                }
            }
            if (file.incorrect) {
                let incorrectFilePath = path.join(config.uploadPath, file._id + '_incorrect.txt');
                try {
                    await this.unlink(incorrectFilePath);
                }
                catch {

                }
            }
        }
        return this.store.delete(id);
    }

    /**
     * Stores a File
     * @param file 
     */
    async uploadFile(file: IFileField) {
        let id = await this.create({
            name: file.filename
        });
        let filePath = path.join(config.uploadPath, id + '.txt');
        await this.writeFile(filePath, file.data);
        return id;
    }

    /**
     * Processes a File and stores it to a File record
     * @param id 
     * @param format 
     * @param fields 
     */
    async processFile(id: string, format: FileFormat, fields: number) {
        // Create all paths from the id
        let filePath = path.join(config.uploadPath, id + '.txt');
        let parsedPath = path.parse(filePath);
        let correctPath = path.join(parsedPath.dir, parsedPath.name + '_correct' + parsedPath.ext);
        let incorrectPath = path.join(parsedPath.dir, parsedPath.name + '_incorrect' + parsedPath.ext);

        // Open the file for reading
        let fileStream = fs.createReadStream(filePath);
        // Create the ReadLine interface
        let reader = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // Get the delimiter
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

        // Read through the file line by line
        let correctStream: fs.WriteStream = undefined as any;
        let incorrectStream: fs.WriteStream = undefined as any;
        let header: string[] = undefined as any;
        for await (const line of reader) {
            if (!header) {
                // Store the first line as a header
                header = line.split(delimiter);
            } else {
                // Split the line by the delimiter
                let parts = line.split(delimiter);
                if (parts.length === fields) {
                    if (!correctStream) {
                        // If we don't have a correct stream, create one
                        correctStream = fs.createWriteStream(correctPath);
                    }
                    // Write to the correct stream
                    correctStream.write(line + '\n');
                } else {
                    if (!incorrectStream) {
                        // If we don't have an incorrect stream, create one
                        incorrectStream = fs.createWriteStream(incorrectPath);
                    }
                    // Write to the incorrect stream
                    incorrectStream.write(line + '\n');
                }
            }
        }
        // Update the File record
        this.update(id, {
            $set: {
                format: format,
                fields: fields,
                correct: !!correctStream,
                incorrect: !!incorrectStream
            }
        });
        return {
            header: header,
            path: filePath,
            correct: correctPath,
            incorrectPath: incorrectPath
        };
    }

    /**
     * Writes a File to disk
     * @param filePath 
     * @param data 
     */
    async writeFile(filePath: fs.PathLike | number, data: any) {
        await new Promise<boolean>((resolve, reject) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Deletes a file from disk
     * @param filePath 
     */
    async unlink(filePath: fs.PathLike) {
        await new Promise<boolean>((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }
}