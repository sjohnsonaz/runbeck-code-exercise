const fs = require('fs');
const path = require('path');

function fileExists(path) {
    return new Promise(resolve => {
        fs.exists(path, (exists) => {
            resolve(exists);
        });
    });
}

(async () => {
    let uploadPath = path.join(__dirname, '..', 'public', 'upload');
    try {
        let exists = await fileExists(uploadPath);
        if (!exists) {
            await fs.promises.mkdir(uploadPath, {});
            console.log('Upload folder created');
        } else {
            console.log('Upload folder already exists');
        }
    }
    catch (e) {
        console.error(e);
    }
})();