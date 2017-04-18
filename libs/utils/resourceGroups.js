'use strict';

const resourceManagement = require('azure-arm-resource');
const chalk = require('chalk');
const fs = require('fs');
const time = require('./time');
const Spinner = require('cli-spinner').Spinner;

let _client = null;
function _create(name, groupParams, params) {
    name = 'azworkshops_' + name + '_' + time();

    return new Promise((resolve, reject) => {
        let spinner = new Spinner('Creating resource group \'' + chalk.yellow(name) + '\'...');
        spinner.start();

        _checkExistence(name).then((exists) => {
            if (exists) {
                spinner.stop(true);
                reject('Resource Group already exists.')
            } else {
                _client.resourceGroups.createOrUpdate(name, groupParams)
                    .then(() => {
                        spinner.stop();
                        process.stdout.write('\n');

                        spinner = new Spinner('Deploying resources (this may take some time)...');
                        spinner.start();
                        _client.deployments.createOrUpdate(name, name, params, (err, result, request, response) => {
                            if (err) {
                                spinner.stop(true);
                                reject(err);
                            }
                            else {
                                spinner.stop();
                                process.stdout.write('\n');
                                resolve(name);
                            }
                        });
                    }).catch((err) => {
                        spinner.stop(true);
                        reject(err);
                    });
            }
        });
    });
}

function _checkExistence(name) {
    return _client.resourceGroups.checkExistence(name);
}

module.exports = class ResourceGroups {
    constructor(credentials, subscriptionId) {
        _client = new resourceManagement.ResourceManagementClient(credentials, subscriptionId);
        Spinner.setDefaultSpinnerString(0);
    }

    create(name, location, template) {
        var templateContent = JSON.parse(fs.readFileSync(template, 'utf8'));

        var groupParams = {
            location: location
        };

        var params = {
            properties: {
                template: templateContent,
                mode: 'Complete',
                parameters: {
                    timestamp: {
                        value: time()
                    }
                }
            }
        };

        return _create(name, groupParams, params);
    }

    createWithUri(name, location, templateUri, templateVer) {
        var groupParams = {
            location: location
        };

        var params = {
            properties: {
                mode: 'Complete',
                templateLink: {
                    uri: templateUri,
                    contentVersion: templateVer,
                    parameters: {
                        timestamp: time()
                    }
                }
            }
        };

        return _create(name, groupParams, params);
    }
}