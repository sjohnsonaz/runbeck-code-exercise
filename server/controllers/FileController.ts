import { Controller, method, IFileField } from 'sierra';

import FileManger, { FileFormat } from '../managers/FileManager';
import FileStore from '../stores/FileStore';

export default class FileController extends Controller {
    fileManager = new FileManger();
    store: FileStore;

    constructor(store: FileStore) {
        super();
        this.store = store;
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

    @method('get', '/')
    async list(query: any) {
        let subscriptions = await this.store.list(query);
        let results = {
            DataList: subscriptions,
            TotalCount: subscriptions.length
        };
        return results;
    }

    @method('get', '/:id')
    async get(id: string) {
        let subscription = await this.store.get(id);
        return subscription;
    }

    @method('post', '/')
    async post($body: any) {
        let subscriptionId = await this.store.create($body);
        return subscriptionId;
    }

    @method('put', '/:id')
    async put($body: any, id: string) {
        let number = await this.store.update(id, $body);
        return number;
    }

    @method('delete', '/:id')
    async delete(id: string) {
        let number = await this.store.delete(id);
        return number;
    }
}