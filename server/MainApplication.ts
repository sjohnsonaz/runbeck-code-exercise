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

module.exports = new MainApplication();