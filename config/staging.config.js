module.exports = {
	db: {
		uri: process.env.OPENSHIFT_MONGODB_DB_URL,
		name: process.env.OPENSHIFT_APP_NAME
	}
};