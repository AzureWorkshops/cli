#!/usr/bin/env node --harmony
'use strict';

var chalk = require('chalk');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var azure = require('azure');
var msRest = require('ms-rest-azure');
var workshops = require('./libs');

program
    .version('1.0.0')
    .option('-s, --subscription <id>', 'your subscription id')
    .option('-w, --workshop <workshop number>', 'workshop number to build')
    .parse(process.argv);

co(function* () {
    yield setWorkshop();
    var {credentials, subscriptions} = yield azureLogin();
    yield setSubscription(subscriptions);

}).then(() => {
    switch (program.workshop) {
        case '1':
            workshops.basicActiveDirectory(program);
            break;
    }

    process.exit(1);
});

function* setWorkshop() {
    if (!program.workshop) {
        displayMenu();

        program.workshop = yield prompt('\n> ');
    }
}

function displayMenu() {
    console.log(chalk.yellow('\nChoose a Workshop:'));
    console.log('    ' + chalk.cyan('1.') + ' Basic Active Directory');
}

function azureLogin() {
    return new Promise((resolve, reject) => {
        console.log('\n');
        msRest.interactiveLogin((err, credentials, subscriptions) => {
            if (err) reject(err);

            resolve({credentials, subscriptions});
        });
    });
}

function* setSubscription(subscriptions) {
    if (!confirmSubscription(subscriptions)) {
        displaySubscriptions(subscriptions);
        var id = yield prompt('\n> ');
        program.subscription = (subscriptions.filter((sub) => {
            return sub._id == id; 
        }))[0];
    }
}

function displaySubscriptions(subscriptions) {
    console.log(chalk.yellow('\nChoose a Subscription:'));

    for(var i = 0; i < subscriptions.length; i++) {
        subscriptions[i]._id = i+1;
        console.log(chalk.cyan('    ' + ((i*1)+1) + '.') + ' ' + subscriptions[i].name + ' ' + chalk.gray('(' + subscriptions[i].id + ')'));
    }
}

function confirmSubscription(subscriptions) {
    if (!program.subscription) return false;

    var filtered = subscriptions.filter((sub) => {
        return sub.id == program.subscription;
    });

    if (filtered.length == 0 || filtered.length > 1)
        return false;

    program.subscription = { id: program.subscription };
    return true;
}
