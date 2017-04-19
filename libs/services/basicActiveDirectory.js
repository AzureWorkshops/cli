'use strict';

const resourceGroups = require('../utils/resourceGroups');
const extensions = require('../utils/extensions');

module.exports = function (program) {
    let groups = new resourceGroups(program.credentials, program.subscription.id);
    let exts = new extensions(program.credentials, program.subscription.id);
    let returnObj = {};

    return groups.createWithUri('basicAD', program.location.name, 'https://raw.githubusercontent.com/AzureWorkshops/cli/master/templates/basicAD.json', '1.0.2.0')
        .then((group) => {
            returnObj.ResourceGroup = group;
            return Promise.resolve();
        })
        .then(() => { return exts.addPowershellExtension('SetStaticIp', returnObj.ResourceGroup, 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/set-static-ip.ps1"], 'set-static-ip.ps1', 'Setting static ip on host OS for \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('InitializeDisk', returnObj.ResourceGroup, 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/initialize-single-disk.ps1"], 'initialize-single-disk.ps1', 'Adding \'Data\' (F:) Drive on \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('CreateAd', returnObj.ResourceGroup, 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad.ps1"], 'create-ad.ps1', 'Configuring Domain Controller for \'azurelab.cloud\' on \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('CreateAdUsers', returnObj.ResourceGroup, 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad-users.ps1"], 'create-ad-users.ps1', 'Creating demo accounts in \'azurelab.cloud\' domain...'); })
        .then(() => { return exts.addPowershellExtension('SetStaticIp', returnObj.ResourceGroup, 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/set-static-ip.ps1"], 'set-static-ip.ps1 -IPs "10.3.1.4"', 'Setting static ip on host OS for \'utility\' VM...'); })
        .then(() => { return exts.addPowershellExtension('InitializeDisk', returnObj.ResourceGroup, 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/initialize-single-disk.ps1"], 'initialize-single-disk.ps1', 'Adding \'Data\' (F:) Drive on \'utility\' VM...'); })
        .then(() => { return exts.addPowershellExtension('AddMachineToAd', returnObj.ResourceGroup, 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/add-machine-to-ad.ps1"], 'add-machine-to-ad.ps1', 'Adding \'utility\' VM to \'azurelab.cloud\' domain...'); })
        .then(() => {
            process.stdout.write(JSON.stringify(returnObj));
        });
}