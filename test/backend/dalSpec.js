//all mongo things
var Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	ReplSetServers = require('mongodb').ReplSetServers,
	ObjectID = require('mongodb').ObjectID,
	Binary = require('mongodb').Binary,
	GridStore = require('mongodb').GridStore,
	Grid = require('mongodb').Grid,
	Code = require('mongodb').Code,
	BSON = require('mongodb').pure().BSON,
	assert = require('assert'),
	config = require('../../config/wrapper')('test');
var dal = require('../../db/dal')(config);



describe("DAL > ", function() {
	describe("forms management > ", function () {
		var mdb = new Db(config.db().name, new Server(config.db().host, 27017));

		describe("getList method > ", function () {
			it("should return empty list if 'forms' collection is empty or doesn't exist", function (done) {
				var checkMethod = function () {
					dal.getList(function (err, forms) {
						expect(forms.length).toEqual(0);
					});
				};
				mdb.open(function (err, db) {
					db.collection("forms", function (err, formsCollection) {
						formsCollection.drop(function (err, reply) {
							db.collectionNames("forms", function (err, namesAfterDrop) {
								expect(namesAfterDrop.length).toEqual(0);
								checkMethod();

								db.createCollection("forms", function (err, collection) {
									db.collectionNames("forms", function (err, namesAfterCreate) {
										expect(namesAfterCreate.length).toEqual(1);
										checkMethod();
										db.close();
										done();
									});
								});
							});
						});
					});
				});
			});

			it("should return list of forms if 'forms' collection has items", function (done) {
				var forms = [
					{
						name: "form 1",
						description: "form desc 1",
						type: 'radio',
						isActive: true
					},
					{
						name: "form 2",
						description: "form desc 2",
						type: 'radio',
						isActive: true
					},
					{
						name: "form 3",
						description: "form desc 3",
						type: 'checkbox',
						isActive: true
					}
				];
				mdb.open(function (err, db) {
					db.collection("forms", function (err, formsCollection) {
						formsCollection.drop(function (err, reply) {
							db.collectionNames("forms", function (err, namesAfterDrop) {
								expect(namesAfterDrop.length).toEqual(0);
								db.createCollection("forms", function (err, collection) {
									collection.insert(forms, function (err, result) {
										collection.find().toArray(function (err, savedForms) {
											expect(savedForms.length).toEqual(3);
											db.close();
											done();
										});
									});
								});
							});
						});
					});
				});
			});
		});

		describe("getForm method > ", function () {
			it("should return null if 'forms' collection is empty or doesn't exist", function (done) {
				mdb.open(function (err, db) {
					db.dropCollection("forms", function (err, result) {
						db.createCollection("forms", function (err, collection) {
							dal.getForm("53a17fe75ef1aef52c666cd8", function (err, form) {
								expect(err).toBeNull();
								expect(form).toBeNull();
							});
							mdb.close();
							done();
						});
					});
				});
			});

			it("should return form if 'forms' collection contain proper entry", function (done) {
				var form = {
						name: "form 1",
						description: "form desc 1",
						type: 'radio',
						isActive: true
					};
				mdb.open(function (err, db) {
					db.dropCollection("forms", function (err, result) {
						db.createCollection("forms", function (err, collection) {
							collection.insert(form, function(err, result){
								collection.findOne({name: "form 1"}, function(err, formFound){
									dal.getForm(formFound._id.toHexString(), function (err, form) {
										expect(err).toBeNull();
										expect(form._id.toHexString()).toEqual(formFound._id.toHexString());
										expect(form.description).toEqual(formFound.description);
										expect(form.type).toEqual(formFound.type);
										expect(form.isActive).toEqual(formFound.isActive);
									});
									mdb.close();
									done();
								});

							});
						});
					});
				});
			});
		});

	});
});
