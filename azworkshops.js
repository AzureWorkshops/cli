#!/usr/bin/env node --harmony
'use strict';

const co = require('co');
const program = require('commander');
const Services = require('./libs/services');
const Config = require('./libs/utils/config');
const Logging = require('./libs/utils/logging');

let logging = new Logging();

program
    .version('1.0.2')
    .option('-s, --subscription <id>', 'your subscription id')
    .option('-c, --config <configuration id>', 'id of the base configuration')
    .parse(process.argv);

co(function* () {
    let config = new Config();
    
    program.config = yield config.getConfiguration();

    let { credentials, subscriptions } = yield config.login();
    
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




