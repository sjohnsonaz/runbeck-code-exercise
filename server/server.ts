import Sierra, { BodyMiddleware } from 'sierra';

import FileController from './controllers/FileController';

class MainApplication {
    sierra = new Sierra();
    async init() {
        this.sierra.use(BodyMiddleware.handle);
        this.sierra.addController(new FileController);
        this.sierra.init();
    }
    async listen(port: number) {
        return this.sierra.listen(port);
    }
    async close() {
        return this.sierra.close();
    }
}

let mainApplication = new MainApplication();
import config from './config';
(async () => {
    let port = process.env.PORT || config.port || '3000';
    if (typeof port === 'string') {
        port = parseInt(port);
    }
    try {
        await mainApplication.init();
        await mainApplication.listen(port);
        console.log('Listening on port:', port);
    }
    catch {
        console.log('Could not start listening on port:', port);
    }
})();