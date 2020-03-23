import readline from 'readline';
import fs from 'fs';
import { FileFormat } from '../managers/FileManager';

export enum Questions {
    Location = "Where is the file located?\n",
    Format = "What is the file format?\
\n\t1. CSV (comma-separated values)\
\n\t2. TSV (tab-separated values)\n",
    Fields = "How many fields should each record contain?\n"
}

export default class CommandReader {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    question(query: string) {
        return new Promise<string>(resolve => {
            this.rl.question(query, (answer) => {
                resolve(answer);
            });
        });
    }

    prompt() {
        this.rl.prompt();
        this.rl.on('line', (line) => {
            if (line === 'close') {
                this.rl.close();
            }
        }).on('close', () => {

        });
    }

    exists(location: string) {
        return new Promise<boolean>(resolve => {
            fs.exists(location, (exists) => {
                resolve(exists);
            });
        });
    }

    async getLocation() {
        while (true) {
            let location = await this.question(Questions.Location);
            if (await this.exists(location)) {
                return location;
            } else {
                console.error('File does not exist');
            }
        }
    }

    async getFormat() {
        while (true) {
            let format = parseInt(await this.question(Questions.Format));
            switch (format) {
                case 1:
                    return FileFormat.CommaSeparated;
                case 2:
                    return FileFormat.TabSeparated;
                default:
                    console.error('Invalid selection');
                    break;
            }
        }
    }

    async getFields() {
        while (true) {
            let fields = Number(await this.question(Questions.Fields));
            if (fields !== NaN) {
                return fields;
            } else {
                console.error('Invalid input');
            }
        }
    }
}