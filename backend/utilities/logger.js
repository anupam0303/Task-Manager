const config = require('../config/configs');

module.exports.log = (method, msg)=> { 
    if(config.enableConsoleLog)
    {
        console.log(method + ': ' + msg);
    }
};