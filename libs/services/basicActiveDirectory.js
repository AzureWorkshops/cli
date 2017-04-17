'use strict';

const resourceGroup = require('../utils/resourceGroups');

module.exports = function (program, resolve, reject) {
    var groups = new resourceGroup(program.credentials, program.subscription.id);

    groups.create('TestGroup', 'East US', null).then(() => {
        resolve();
    }).catch((err) => {
        reject(err);
    });
}