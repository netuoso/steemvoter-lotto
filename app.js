const {steem,SteemBot,username,activeKey,postingKey} = require('./config.js');

const bot = new SteemBot({username, activeKey});

function handleDeposit(data, responder) {
	const amountReceived = parseFloat(data.amount.split(' ')[0]);
  console.log('recevied %s deposit from %s to %s', data.amount, data.from, data.to);
  if (amountReceived === 0.005) {
	  steem.api.getAccountsAsync([responder.responderUsername])
	  	.then((content) => {
	  		const accountInfo = content[0];
	  		const votingPower = Number(accountInfo.voting_power);
	  		if (votingPower < 7000) {
	  			console.log(`Refunding user ${data.from} due to bot voting power too low.`);
	  			// refund user - voting power too low
	  			steem.broadcast.transfer(activeKey, data.to, data.from, data.amount, 'Refunding due to bot voting power below 80 percent. Try again later.', (err, result) => {
			  		console.log(err ? "Error: " + err : "Success: " + result);
	  			})
	  		} else {
	  			if (data.memo.match(/^https?:\/\/(www\.)?steemit\.com\//i)) {
				  	// upvote 100%
				  	const authorName = data.memo.split('#')[1].split('/')[0].replace('@','');
				  	const permlink = data.memo.split('#')[1].split('/')[1];
				  	console.log(`Upvoting user ${authorName} and selling lottery entry.`);
				  	steem.broadcast.vote(activeKey, responder.responderUsername, authorName, permlink, 10000, (err, result) => {
				  		console.log(err ? "Error: " + err : "Success: " + result);
				  	});
				  	// buy lottery entry
						steem.broadcast.customJson(activeKey, [username], [], 'lottery', `{"username": "${data.from}"}`, (err, result) => {
				  		console.log(err ? "Error: " + err : "Success: " + result);
						});
						const steemBalance = accountInfo.balance.split(' ')[0];
						const sbdBalance = accountInfo.sbd_balance.split(' ')[0];
						// send lottery confirmation
						console.log(`Sending lottery confirmation to user ${data.from}.`)
						if (steemBalance > 0) {
							steem.broadcast.transfer(activeKey, responder.responderUsername, data.from, '0.001 STEEM', 'Congratulations! You have purchased a lottery entry for this weeks drawing.', (err, result) => {
					  		console.log(err ? "Error: " + err : "Success: " + result);
							})
						} else if (sbdBalance > 0) {
							steem.broadcast.transfer(activeKey, responder.responderUsername, data.from, '0.001 SBD', 'Congratulations! You have purchased a lottery entry for this weeks drawing.', (err, result) => {
					  		console.log(err ? "Error: " + err : "Success: " + result);
							})
						} else {
							console.log("Error: Unable to send confirmation message due to insufficient funds.");
						}
	  			} else {
						console.log("Refunding user for sending an invalid memo link.");
						steem.broadcast.transfer(activeKey, data.to, data.from, data.amount, 'Refunding because you did attach a valid SteemIt link. Try again using a SteemIt link.', (err, result) => {
				  		console.log(err ? "Error: " + err : "Success: " + result);
						})
	  			}
	  		}
		  });
  } else if (amountReceived === 0.015) {
  	console.log(`Selling lottery entry to user ${data.from}.`)
  	// buy lottery entry
		steem.broadcast.customJson(activeKey, [username], [], 'lottery', `{"username": "${data.from}"}`, (err, result) => {
  		console.log(err ? "Error: " + err : "Success: " + result);
		});
	  steem.api.getAccountsAsync([responder.responderUsername])
	  	.then((content) => {
	  		const accountInfo = content[0];
				const steemBalance = accountInfo.balance.split(' ')[0];
				const sbdBalance = accountInfo.sbd_balance.split(' ')[0];
				if (steemBalance > 0) {
					steem.broadcast.transfer(activeKey, responder.responderUsername, data.from, '0.001 STEEM', 'Congratulations! You have purchased a lottery entry for this weeks drawing.', (err, result) => {
			  		console.log(err ? "Error: " + err : "Success: " + result);
					})
				} else if (sbdBalance > 0) {
					steem.broadcast.transfer(activeKey, responder.responderUsername, data.from, '0.001 SBD', 'Congratulations! You have purchased a lottery entry for this weeks drawing.', (err, result) => {
			  		console.log(err ? "Error: " + err : "Success: " + result);
					})
				} else {
					console.log("Error: Unable to send confirmation message due to insufficient funds.");
				}
			});
  } else {
		// refund user - transfer amount is invalid
		console.log("Refunding user for sending incorrect transfer amount.");
		steem.broadcast.transfer(activeKey, data.to, data.from, data.amount, 'Refunding because you did not send either 0.005 or 0.015 STEEM/SBD. Try again with proper amount.', (err, result) => {
  		console.log(err ? "Error: " + err : "Success: " + result);
		})
  }
}

bot.onDeposit(username, handleDeposit);

bot.start();
