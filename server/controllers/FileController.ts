import { Controller, method, IFileField } from 'sierra';
import * as fs from 'fs';
import * as path from 'path';

import config from '../config.js';

import FileManger, { FileFormat } from '../managers/FileManager';

export default class FileController extends Controller {
    fileManager = new FileManger();

    @method()
    async post(file: IFileField, format: FileFormat, fieldCount: string) {
        if (file) {
            let newPath = path.join(config.uploadPath, file.filename);
            let value = await new Promise<string>((resolve, reject) => {
                fs.writeFile(newPath, file.data, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(newPath);
                    }
                });
            });
            return await this.fileManager.processFile(value, format, parseInt(fieldCount));
        } else {
            throw new Error('No file data');
        }
    }

    @method('post')
    async process() {

    }
}