#!/usr/bin/env node --harmony
'use strict';

const chalk = require('chalk');
const co = require('co');
const program = require('commander');
const Services = require('./libs/services');
const Config = require('./libs/utils/config');
const Logging = require('./libs/utils/logging');
const pjson = require('./package.json');

let logging = new Logging();

program
    .version(pjson.version)
    .option('-s, --subscription <id>', 'your subscription id')
    .option('-c, --config <configuration id>', 'id of the base configuration')
    .option('-d, --domain <directory id>', 'id of your Active Directory tenant')
    .parse(process.argv);

co(function* () {
    let config = new Config();
    
    if (!!program.domain) {
        var re = /^['"]?[a-fA-F0-9]{8}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{12}['"]?$/g;
        if (!re.test(program.domain))
        {
            process.stdout.write(chalk.red('\nERROR: Directory Id must be a proper GUID...'));
            process.exit(1);
        }
    }

    program.config = yield config.getConfiguration();

    let { credentials, subscriptions } = yield config.login(program.domain);
    
    program.credentials = credentials;
    program.subscription = yield config.getSubscription(subscriptions);
    program.location = yield config.getLocation(program.credentials, program.subscription);

}).then(() => {
    return new Promise((resolve, reject) => {

        switch (program.config) {
            case '1':
                Services.basicActiveDirectory(program).then(() => resolve()).catch((err) => reject(err));
                break;
        }

    });
}).catch((err) => {
    process.stdin.pause();
    logging.captureError(err);
});




