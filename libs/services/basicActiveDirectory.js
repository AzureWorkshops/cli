'use strict';

const ResourceGroups = require('../utils/resourceGroups');
const Extensions = require('../utils/extensions');
const Config = require('../utils/config');
const chalk = require('chalk');

module.exports = function (program) {
    let groups = new ResourceGroups(program.credentials, program.subscription.id);
    let exts = new Extensions(program.credentials, program.subscription.id);
    let returnObj = {};
    let config = new Config();

    return new Promise((resolve) => { resolve(); })
    
        // Get Active Directory Domain
        .then(() => { return config.prompt('Enter a AD domain name:', /^[a-zA-Z0-9]{3,}\.[a-zA-Z]{2,}$/g, 'Must be in the format of \'xxx.xx\'', 'azurelab.cloud'); })
        .then((domain) => { returnObj['Domain Name'] = domain; Promise.resolve(); })

        // Get NETBIOS Name
        .then(() => { return config.prompt('Enter a NETBIOS name:', /^[a-zA-Z0-9]{3,}$/g, 'Must be in the format of \'xxx\'', (returnObj['Domain Name'].split('.')[0]).toUpperCase()); })
        .then((netbios) => { returnObj['NETBIOS'] = netbios.toUpperCase(); Promise.resolve(); })

        // Set Domain Admin Account
        .then(() => {
            returnObj['Domain Admin'] = returnObj['NETBIOS'].toLowerCase() + '\\cloudadmin';
            returnObj['Domain Admin Password'] = 'Pass@word1234';
            Promise.resolve();
        })

        // Create Group
        .then(() => { return groups.createWithUri('basicAD', program.location.name, 'https://raw.githubusercontent.com/AzureWorkshops/cli/master/templates/basicAD.json', '1.0.2.0'); })
        .then((group) => { returnObj['Resource Group'] = group; Promise.resolve(); })

        // Run Extensions
        .then(() => { return exts.addPowershellExtension('SetStaticIp', returnObj['Resource Group'], 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/set-static-ip.ps1"], 'set-static-ip.ps1', 'Setting static ip on host OS for \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('InitializeDisk', returnObj['Resource Group'], 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/initialize-single-disk.ps1"], 'initialize-single-disk.ps1', 'Adding \'Data\' (F:) Drive on \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('CreateAd', returnObj['Resource Group'], 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad.ps1"], 'create-ad.ps1 -Domain "' + returnObj['Domain Name'] + '" -Netbios "' + returnObj['NETBIOS'] + '" -DomainAdminPassword "' + returnObj['Domain Admin Password'] + '"', 'Configuring Domain Controller for \'' + returnObj['Domain Name'] + '\' on \'dc1\' VM...'); })
        .then(() => { return exts.addPowershellExtension('CreateAdUsers', returnObj['Resource Group'], 'dc1', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad-users.ps1"], 'create-ad-users.ps1 -Domain "' + returnObj['Domain Name'] + '"', 'Creating demo accounts in \'' + returnObj['Domain Name'] + '\' domain...'); })
        .then(() => { return exts.addPowershellExtension('SetStaticIp', returnObj['Resource Group'], 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/set-static-ip.ps1"], 'set-static-ip.ps1 -IPs "10.3.1.4"', 'Setting static ip on host OS for \'utility\' VM...'); })
        .then(() => { return exts.addPowershellExtension('InitializeDisk', returnObj['Resource Group'], 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/initialize-single-disk.ps1"], 'initialize-single-disk.ps1', 'Adding \'Data\' (F:) Drive on \'utility\' VM...'); })
        .then(() => { return exts.addPowershellExtension('AddMachineToAd', returnObj['Resource Group'], 'utility', program.location.name, ["https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/add-machine-to-ad.ps1"], 'add-machine-to-ad.ps1 -Domain "' + returnObj['Domain Name'] + '" -DomainAdmin "' + returnObj['Domain Admin'] + '" -DomainAdminPassword "' + returnObj['Domain Admin Password'] + '"', 'Adding \'utility\' VM to \'' + returnObj['Domain Name'] + '\' domain...'); })
        .then(() => {
            config.printResults(returnObj);
        });
}