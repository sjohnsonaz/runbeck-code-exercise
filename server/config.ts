import path from 'path';

let root = path.join(__dirname, '..');

let config = {
    uploadPath: path.join(root, 'public', 'upload')
};

export default config;