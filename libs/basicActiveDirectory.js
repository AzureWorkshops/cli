var chalk = require('chalk');
var azure = require('azure');

module.exports = function(opts) {
    console.log(chalk.bold.cyan('You entered: ') + opts.workshop + ' ' + opts.subscription);
}