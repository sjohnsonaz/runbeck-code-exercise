import FileManager, { FileFormat } from './managers/FileManager';
import CommandReader from './util/CommandReader';

(async () => {
    let fileManager = new FileManager();
    let commandReader = new CommandReader();
    try {
        let location = await commandReader.getLocation();
        let format = await commandReader.getFormat();
        let fields = await commandReader.getFields();
        await fileManager.processFile(location, format, fields);
    }
    catch (e) {
        console.error(e);
    }
})();