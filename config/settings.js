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
			"user"
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
			"testuser"
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
			"vdanilov@tula.co",
			"aandrushkevich@tula.co",
			"master"
		]
	}
};