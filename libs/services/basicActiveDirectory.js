'use strict';

const resourceGroups = require('../utils/resourceGroups');
const extensions = require('../utils/extensions');

module.exports = function (program, resolve, reject) {
    let groups = new resourceGroups(program.credentials, program.subscription.id);
    let exts = new extensions(program.credentials, program.subscription.id);

    groups.create('basicAD', 'East US', './templates/template.json').then((name) => {
        let fileUris = [
            "https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/initialize-single-disk.ps1"
        ];

        Promise.all([
            exts.addPowershellExtension('InitializeDisk', name, 'dc1', 'East US', fileUris, 'initialize-single-disk.ps1'),
            exts.addPowershellExtension('InitializeDisk', name, 'utility', 'East US', fileUris, 'initialize-single-disk.ps1')
        ])
            .then((vals) => {
                console.log(name);
                resolve();
            })
            .catch((err) => { reject(err); });

    }).catch((err) => {
        reject(err);
    });
}