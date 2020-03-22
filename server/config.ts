import path from 'path';

let root = path.join(__dirname, '..');

let config = {
    port: 3000,
    uploadPath: path.join(root, 'public', 'upload')
};

export default config;