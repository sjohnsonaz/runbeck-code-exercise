import * as DataStore from 'nedb';

import { IDocument } from './IDocument';

export default class Store<T> {
    db: DataStore;

    constructor(db: DataStore) {
        this.db = db;
    }

    get(id: string) {
        return new Promise<T & IDocument>((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, doc: T & IDocument) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    list(query: Object) {
        return new Promise<(T & IDocument)[]>((resolve, reject) => {
            this.db.find(query, (err: any, docs: (T & IDocument)[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    create(item: T) {
        return new Promise<string>((resolve, reject) => {
            this.db.insert(item as any, (err, newDoc: T & IDocument) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve(newDoc._id);
            });
        });
    };

    update(id: string, item: T) {
        return new Promise<number>((resolve, reject) => {
            this.db.update({ _id: id }, item, {}, (err: any, numberofUpdated: number) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(numberofUpdated);
                }
            });
        });
    }

    delete(id: string) {
        return new Promise<number>((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        })
    }
}