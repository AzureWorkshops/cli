'use strict';

const computeManagement = require('azure-arm-compute');
const Spinner = require('cli-spinner').Spinner;

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
        Spinner.setDefaultSpinnerString(0);
    }

    addPowershellExtension(extensionName, resourceGroup, vmName, location, fileUris, commandToExecute, customMessage) {
        let spinnerText = customMessage != null ? customMessage : 'Adding extension \'' + extensionName + '\'...';
        let params = _getParams('powershell -ExecutionPolicy Unrestricted -file ' + commandToExecute, fileUris, location);

        return new Promise((resolve, reject) => {
            let spinner = new Spinner(spinnerText);
            spinner.start();
            return _client.virtualMachineExtensions.createOrUpdate(resourceGroup, vmName, extensionName, params)
                .then(() => {
                    return _client.virtualMachineExtensions.deleteMethod(resourceGroup, vmName, extensionName)
                        .then(() => {
                            spinner.stop();
                            process.stdout.write('\n');
                            resolve();
                        })
                        .catch((err) => {
                            spinner.stop(true);
                            reject(err);
                        });

                })
                .catch((err) => {
                    spinner.stop(true);
                    reject(err);
                });
        });
    }

    addCustomExtension(extensionName, resourceGroup, vmName, location, fileUris, commandToExecute, customMessage) {
        let spinnerText = customMessage != null ? customMessage : 'Adding extension \'' + extensionName + '\'...';
        let params = _getParams(commandToExecute, fileUris, location);

        return new Promise((resolve, reject) => {
            let spinner = new Spinner(spinnerText);
            spinner.start();
            return _client.virtualMachineExtensions.createOrUpdate(resourceGroup, vmName, extensionName, params)
                .then(() => {
                    spinner.stop();
                    process.stdout.write('\n');
                    resolve();
                })
                .catch((err) => {
                    spinner.stop(true);
                    reject(err);
                });
        });
    }

}