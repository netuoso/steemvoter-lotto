const {steem,moment,SteemBot,username,activeKey,postingKey} = require('./config.js');

function runLottery() {
	var done = false;
	var winner = null;
	var transfers = [];
	var lottoReward = '1.000 STEEM';
	var startDate = moment().startOf('week');
	var endDate = moment().endOf('week');
	steem.api.getAccountHistory('netuoso',-1,1000,(err,response) => {
		if (err) {
			return;
		} else {
			response.forEach((item) => {
				if (item[1].op[0] === 'transfer') {
					var validAmount = ['0.015','0.005'].indexOf(item[1].op[1].amount.split(' ')[0]) > 0;
					if ((startDate < moment(item[1].timestamp) < endDate) && validAmount) {
						transfers.push(item[1].op[1].from);
					}
				}
			})
			winner = transfers[Math.floor(Math.random() * transfers.length)];
			done = true;
		}
	});

	setInterval(function(){
		if(done) {
			if(winner) {
				console.log(`Sending lottery winner (${winner}) their prize of ${lottoReward}.`);
				steem.broadcast.transfer(activeKey, username, winner, lottoReward, 'Congratulations! You have won the weekly lottery!', (err, result) => {
		  		console.log(err ? "Error: " + err : "Success: " + result);
				})
			}
			process.exit()
		};
	},1000);
}

runLottery();
