var mainApplication = require('./dist/MainApplication');
var config = require('./dist/config').default;
(async () => {
    let port = process.env.PORT || config.port || '3000';
    try {
        await mainApplication.init();
        await mainApplication.listen(port);
        console.log('Listening on port:', port)
    }
    catch {
        console.log('Could not start listening on port:', port);
    }
})();