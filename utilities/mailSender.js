/**
 * Created by MChernyavsky on 30.09.2014.
 */
module.exports = function() {
	var config = require('../config/wrapper')();
	var email   = require("emailjs/email");

	var server  = email.server.connect({
		user: 'tulavotes@gmail.com',
		password: 'votesTula1',
		host:    "smtp.gmail.com",
		ssl:     true

	});

	var sendMail = function(mailOptions){
		server.send(mailOptions, function(err, message) {
			console.log(err || message);
		});
	};

	var createNotificationMailOptions = function(vote, user){
		var recipients =  config.allowedUsers.toString();
		var voteId = typeof(vote._id) === 'object' ? vote._id.toJSON() : vote._id;
 		var mailBody = '<b>'+ vote.name+' ✔</b><br/><br/>'
			+ vote.description + '<br/><br/>Создал: '
			+ user.name + '<br/><br/>Ссылка: '
			+ vote.host + '/#/view/'+ voteId;
		if(vote.expireAt){
			var expireDate = typeof(vote.expireAt) === 'object' ? vote.expireAt.toISOString() : vote.expireAt;
			mailBody += '<br/><br/>Актуально до: ' + expireDate.replace(/T/, ' ').replace(/\..+/, '')
		}
		var mailOptions = {
			from: 'tulavotes@devsmtp.tula.tc',
			to: recipients,
			subject: 'Новое голосование на TulaVotes : '+ vote.name,
			attachment:
				[
					{data:mailBody, alternative:true}
				]
		};

		return mailOptions;
	};

	var sendMailToSubscribers = function(vote, user) {
		if(vote.isSendMail && vote.isActive && (vote.isSendMail !== vote.isSendMailOld || vote.isActive !== vote.isActiveOld)) {
			var mailOptions = createNotificationMailOptions(vote, user);
			sendMail(mailOptions);
		}
	};

	return {
		sendMailToSubscribers: sendMailToSubscribers
	};
};