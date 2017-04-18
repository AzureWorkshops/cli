#!/usr/bin/env node --harmony
'use strict';

const chalk = require('chalk');
const co = require('co');
const prompt = require('co-prompt');
const program = require('commander');
const azure = require('azure');
const msRest = require('ms-rest-azure');
const services = require('./libs/services');
const os = require('os');
const request = require('superagent');

let client = {
    OS: os.type(),
    OS_Version: os.release(),
    OS_Full: os.type() + ' ' + os.release()
};

let isTx = true;
log('info', client).then(() => { isTx = false; });

program
    .version('1.0.0')
    .option('-s, --subscription <id>', 'your subscription id')
    .option('-c, --config <configuration id>', 'id of the base configuration')
    .parse(process.argv);

co(function* () {
    try {
        yield setConfig();
        let { credentials, subscriptions } = yield azureLogin();
        program.credentials = credentials;
        yield setSubscription(subscriptions);
    }
    catch (exc) {
        yield captureError(exc);
    }
}).then(() => {
    return new Promise((resolve, reject) => {
        
        switch (program.config) {
            case '1':
                services.basicActiveDirectory(program, resolve, reject);
                break;
        }

    }).catch((err) => {
        isTx = true;
        captureError(err).then(() => { isTx = false; });
    });
}).then(() => {
    // co stalls the process, so force exit
    if (!isTx) process.exit(0);
});

function* setConfig() {
    if (!program.config) {
        displayMenu();

        program.config = yield prompt('\n> ');
    }

}

function displayMenu() {
    console.log(chalk.yellow('\nChoose a Base Configuration:'));
    console.log('    ' + chalk.cyan('1.') + ' Basic Active Directory');
}

function azureLogin() {
    return new Promise((resolve, reject) => {
        console.log('\n');
        msRest.interactiveLogin((err, credentials, subscriptions) => {
            if (err) reject(err);
console.log(JSON.stringify(credentials));
            resolve({ credentials, subscriptions });
        });
    });
}

function* setSubscription(subscriptions) {
    if (!confirmSubscription(subscriptions)) {
        displaySubscriptions(subscriptions);
        let id = yield prompt('\n> ');
        program.subscription = (subscriptions.filter((sub) => {
            return sub._id == id;
        }))[0];
    }
}

function displaySubscriptions(subscriptions) {
    console.log(chalk.yellow('\nChoose a Subscription:'));

    for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i]._id = i + 1;
        console.log(chalk.cyan('    ' + ((i * 1) + 1) + '.') + ' ' + subscriptions[i].name + ' ' + chalk.gray('(' + subscriptions[i].id + ')'));
    }
}

function confirmSubscription(subscriptions) {
    if (!program.subscription) return false;

    let filtered = subscriptions.filter((sub) => {
        return sub.id == program.subscription;
    });

    if (filtered.length == 0 || filtered.length > 1)
        return false;

    program.subscription = { id: program.subscription };
    return true;
}

function log(type, data) {
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
                console.error('Problem sending telemetry.');
            });
    });
}

function captureError(err) {
    return log('error', err).then(() => { 
        console.log(chalk.red('ERROR: ' + err));
        process.exit(1); 
    });
}