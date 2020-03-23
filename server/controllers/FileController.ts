import { Controller, method, IFileField } from 'sierra';

import FileManger from '../managers/FileManager';
import { FileFormat } from '../models/FileFormat';

export default class FileController extends Controller {
    fileManager: FileManger;

    constructor(fileManager: FileManger) {
        super();
        this.fileManager = fileManager;
    }

    @method('post', '/upload')
    async upload(file: IFileField, format: FileFormat, fields: string) {
        if (file) {
            let value = await this.fileManager.uploadFile(file);
            return await this.fileManager.processFile(value, format, parseInt(fields));
        } else {
            throw new Error('No file data');
        }
    }

    @method('get')
    async index(query: any) {
        return this.fileManager.list(query);
    }

    @method('get', '/:id')
    async get(id: string) {
        return this.fileManager.get(id);
    }

    @method('post')
    async post($body: any) {
        return this.fileManager.create($body);
    }

    @method('put', '/:id')
    async put($body: any, id: string) {
        return this.fileManager.update(id, $body);
    }

    @method('delete', '/:id')
    async delete(id: string) {
        return this.fileManager.delete(id);
    }
}