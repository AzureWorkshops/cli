const moment = require('moment');

module.exports = function() {
    return moment().format("MMDDhhmmssSSSS");
}