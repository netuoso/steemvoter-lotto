const steem = require('steem');
const moment = require('moment');
const SteemBot = require('steem-bot').default;

const username = 'yourname';
const activeKey = 'youractivekey';
const postingKey = 'yourprivatekey';

module.exports = {
	steem, moment, SteemBot, username, activeKey, postingKey
}
