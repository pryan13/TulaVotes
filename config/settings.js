module.exports = {
	development: {
		db: function() {
			var name = "tulaVotes",
				host = "localhost";

			return {
				name: name,
				host: host,
				uri: "mongodb://" + host + "/" + name
			};
		},
		allowedUsers: [
			"master@tula.co",
			"aandrushkevich@tula.co",
			"ashakh@tula.co",
			"sseviaryn@tula.co",
			"mchernyavsky@tula.co",
			"vkuznecov@tula.co",
			"vgamzunov@tula.co",
			"ykozlova@tula.co",
			"vsemiachko@tula.co"
		]
	},
	test: {
		db: function() {
			var name = "tulaVotes_test",
				host = "localhost";

			return {
				name: name,
				host: host,
				uri: "mongodb://" + host + "/" + name
			};
		},
		allowedUsers: [
			"vdanilov@tula.co",
			"master@tula.co"
		]
	},
	staging: {
		db : function() {
			var name = process.env.OPENSHIFT_APP_NAME;

			return {
				uri: process.env.OPENSHIFT_MONGODB_DB_URL + name
			};
		},
		allowedUsers: [
			"master@tula.co",
			"aandrushkevich@tula.co",
			"ashakh@tula.co",
			"sseviaryn@tula.co",
			"mchernyavsky@tula.co",
			"vkuznecov@tula.co",
			"vgamzunov@tula.co",
			"ykozlova@tula.co",
			"vsemiachko@tula.co"
		]
	}
};