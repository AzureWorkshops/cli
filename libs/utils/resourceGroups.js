'use strict';

const resourceManagement = require('azure-arm-resource');
const chalk = require('chalk');

var _client;
function _create(name, params) {
    return new Promise((resolve, reject) => {
        _checkExistence(name).then((exists) => {
            if (exists) {
                reject('Resource Group already exists.')
            } else {
                _client.resourceGroups.createOrUpdate(name, params, (err, result, request, response) => {
                    if (err) reject(err);
                    else
                        resolve(result);
                });
            }
        });
    });
}

function _checkExistence(name) {
    return _client.resourceGroups.checkExistence(name);
}

module.exports = class ResourceGroups {

    constructor(credentials, subscription, callback) {
        _client = new resourceManagement.ResourceManagementClient(credentials, subscription);
    }

    create(name, location, template, callback) {
        var params = {
            location: location/*,
            properties: {
                template: template
            }*/
        };

        return _create(name, params);
    }

    createWithUri(name, location, templateUri, templateVer, callback) {
        var params = {
            location: location,
            properties: {
                templateLink: {
                    uri: templateUri,
                    contentVersion: templateVer
                }
            }
        };

        return _create(name, params);
    }
}