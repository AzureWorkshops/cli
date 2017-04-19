const chalk = require('chalk');
const os = require('os');
const request = require('superagent');

let client = {
    OS: os.type(),
    OS_Version: os.release(),
    OS_Full: os.type() + ' ' + os.release()
};

function _convertToJson(err) {
    if (typeof err == 'string') { return err; }
    else {
        var alt = {};

        Object.getOwnPropertyNames(err).forEach(function (key) {
            alt[key] = this[key];
        }, err);

        return alt;
    }
}

module.exports = class Logging {
    constructor() {
        this.log('info', client);
    }

    log(type, data) {
        return new Promise((resolve, reject) => {
            request
                .post('https://azworkshops.azurewebsites.net/api/loggly')
                .send({
                    loggly: {
                        type: type,
                        data: data
                    }
                })
                .then(() => { resolve(); })
                .catch((err) => {
                    reject();
                    process.stdout.write(chalk.red('Problem sending telemetry.'));
                });
        });
    }

    captureError(err) {
        return this.log('error', _convertToJson(err)).then(() => {
            process.stdout.write(chalk.red('ERROR: ' + err));
        });
    }
}