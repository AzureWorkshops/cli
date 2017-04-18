'use strict';

const resourceManagement = require('azure-arm-resource');
const fs = require('fs');
const time = require('./time');

let _client = null;
function _create(name, groupParams, params) {
    name = 'azworkshops_' + name + '_' + time();

    return new Promise((resolve, reject) => {
        _checkExistence(name).then((exists) => {
            if (exists) {
                reject('Resource Group already exists.')
            } else {
                _client.resourceGroups.createOrUpdate(name, groupParams)
                    .then(() => {
                        _client.deployments.createOrUpdate(name, name, params, (err, result, request, response) => {
                            if (err) { reject(err); }
                            else {
                                resolve(name);
                            }
                        });
                    }).catch((err) => {
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
    constructor(credentials, subscriptionId, callback) {
        _client = new resourceManagement.ResourceManagementClient(credentials, subscriptionId);
    }

    create(name, location, template, callback) {
        var templateContent = JSON.parse(fs.readFileSync(template, 'utf8'));

        var groupParams = {
            location: location
        };

        var params = {
            properties: {
                template: templateContent,
                mode: 'Incremental',
                parameters: {
                    timestamp: {
                        value: time()
                    }
                }
            }
        };

        return _create(name, groupParams, params);
    }

    createWithUri(name, location, templateUri, templateVer, callback) {
        var groupParams = {
            location: location
        };

        var params = {
            properties: {
                mode: 'Incremental',
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