'use strict';

const computeManagement = require('azure-arm-compute');

let _client = null;
function _getParams(commandToExecute, fileUris, location) {
    return {
            publisher: "Microsoft.Compute",
            virtualMachineExtensionType: "CustomScriptExtension",
            typeHandlerVersion: "1.4",
            autoUpgradeMinorVersion: true,
            settings: {
                fileUris: fileUris,
                commandToExecute: commandToExecute
            },
            location: location
        }
}

module.exports = class Extensions {
    constructor(credentials, subscriptionId) {
        _client = new computeManagement(credentials, subscriptionId);

    }

    addPowershellExtension(extensionName, resourceGroup, vmName, location, fileUris, commandToExecute) {
        let params = _getParams('powershell -ExecutionPolicy Unrestricted -file ' + commandToExecute, fileUris, location);

        return _client.virtualMachineExtensions.createOrUpdate(resourceGroup, vmName, extensionName, params)
    }

    addCustomExtension(extensionName, resourceGroup, vmName, location, fileUris, commandToExecute) {
        let params = _getParams(commandToExecute, fileUris, location);

        return _client.virtualMachineExtensions.createOrUpdate(resourceGroup, vmName, extensionName, params)
    }

}