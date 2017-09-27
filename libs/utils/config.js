const chalk = require('chalk');
const co = require('co');
const msRest = require('ms-rest-azure');
const prompt = require('co-prompt');
const ResourceManagement = require('azure-arm-resource');
const _ = require('lodash');

String.prototype.rpad = function(padString, length) {
	var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

function* _prompt(maxValue) {
    var value = null;
    while (value == null) {
        value = yield prompt('\n> ');

        if (isNaN(value) || value < 1 || value > maxValue) {
            process.stdout.write(chalk.red('\nPlease enter a valid choice...'));
            value = null;
        } else {
            process.stdin.pause();
            return value;
        }
    }
}

function* _regPrompt(userPrompt, regex, errorMessage, defaultValue) {
    var value = null;
    process.stdout.write('\n' + chalk.yellow(userPrompt));
    do {
        if (defaultValue != null) {
            value = yield prompt('\n(' + defaultValue + ') > ');
        } else {
            value = yield prompt('\n> ');
        }
    
        if (value == '' && defaultValue != null) {
            value = defaultValue;
            process.stdin.pause();
            return defaultValue;
        } else if (!value.match(regex)) {
            process.stdout.write(chalk.red('\n' + errorMessage + '...'));
            value = null;
        } else {
            process.stdin.pause();
            return value;
        }
    } while (value == null) 
}

module.exports = class Config {
    constructor() {

    }

    getConfiguration() {
        process.stdout.write(chalk.yellow('\nChoose a Base Configuration:') + '\n');
        process.stdout.write('    ' + chalk.cyan('1.') + ' Basic Active Directory' + '\n');

        return _prompt(1);
    }

    login() {
        return new Promise((resolve, reject) => {
            process.stdout.write('\n');
            msRest.interactiveLogin((err, credentials, subscriptions) => {
                if (err) { reject(err); }
                else { resolve({ credentials, subscriptions }); }
            });
        });
    }

    getSubscription(subscriptions) {
        return new Promise((resolve, reject) => {
            process.stdout.write(chalk.yellow('\nChoose a Subscription:') + '\n');

            for (var i = 0; i < subscriptions.length; i++) {
                subscriptions[i]._id = i + 1;
                process.stdout.write(chalk.cyan('    ' + ((i * 1) + 1) + '.') + ' ' + subscriptions[i].name + ' ' + chalk.gray('(' + subscriptions[i].id + ')') + '\n');
            }

            co(function* () {
                return yield _prompt(subscriptions.length);
            }).then((id) => {
                resolve((subscriptions.filter((sub) => {
                    return sub._id == id;
                }))[0]);
            });
        });
    }

    getLocation(credentials, subscription) {
        _.remove(credentials.tokenCache._entries, (obj) => {
            return obj.tenantId != subscription.tenantId;
        });

        let resMgnt = new ResourceManagement.SubscriptionClient(credentials);

        return new Promise((resolve, reject) => {
            resMgnt.subscriptions.listLocations(subscription.id)
                .then((locations) => {
                    process.stdout.write(chalk.yellow('\nChoose a Location:') + '\n');

                    for (var i = 0; i < locations.length; i++) {
                        locations[i]._id = i + 1;
                        process.stdout.write(chalk.cyan('    ' + ((i * 1) + 1) + '.') + ' ' + locations[i].displayName + '\n');
                    }

                    co(function* () {
                        return yield _prompt(locations.length);
                    }).then((id) => {
                        resolve((locations.filter((loc) => {
                            return loc._id == id;
                        }))[0]);
                    });
                });
        });
    }

    prompt(prompt, regex, errorMessage, defaultValue = null) {
        return new Promise((resolve, reject) => {
            co(function* () {
                return yield _regPrompt(prompt, regex, errorMessage, defaultValue);
            }).then((response) => {
                resolve(response);
            });
        });
    }

    printResults(results) {
        process.stdout.write('\n\n');
        process.stdout.write(chalk.cyan.yellow('Results:') + '\n');
        for(var key in results) {
            process.stdout.write('    ' + chalk.cyan.bold(key.rpad(" ", 30)) + '|    ' + results[key] + '\n');
        }
        process.stdout.write('\n');
    }
}