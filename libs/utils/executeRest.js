const request = require('superagent');

module.exports = function(opts) {
    console.log(chalk.bold.cyan('You entered: ') + opts.config + ' ' + opts.subscription);
}