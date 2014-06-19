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



describe("DAL", function() {
	describe("forms management", function () {
		var mdb = new Db(config.db().name, new Server(config.db().host, 27017));

		describe("getList method", function () {
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

		describe("getForm method", function () {
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

		describe("createForm method", function(){
			it("should create and persist new form", function (done) {
				var form = {
					name: "new form",
					description: "new form desc",
					type: 'radio',
					isActive: true
				};
				mdb.open(function (err, db) {
					db.dropCollection("forms", function (err, result) {
						db.createCollection("forms", function (err, collection) {
							dal.createForm(form, function(err, createdForm){
								collection.findOne({name: createdForm.name}, function(err, formFound){
									expect(err).toBeNull();
									expect(createdForm._id.toHexString()).toEqual(formFound._id.toHexString());
									expect(createdForm.description).toEqual(formFound.description);
									expect(createdForm.type).toEqual(formFound.type);
									expect(createdForm.isActive).toEqual(formFound.isActive);
									mdb.close();
									done();
								});
							});
						});
					});
				});
			});
		});

		describe("updateForm method", function(){
			it("should update and persist existing form", function (done) {
				var form = {
						name: "new form",
						description: "new form desc",
						type: 'radio',
						isActive: true
					},
					updated = {
						name: "updated form",
						description: "updated form desc",
						type: 'checkbox',
						isActive: false
					};
				mdb.open(function (err, db) {
					db.dropCollection("forms", function (err, result) {
						db.createCollection("forms", function (err, collection) {
							collection.insert(form, function(err, result){
								collection.findOne({name: "new form"}, function(err, formFound){
									updated.formId = formFound._id.toHexString();
									dal.updateForm(updated, function(err, updatedForm){
										expect(err).toBeNull();
										expect(updatedForm._id.toHexString()).toEqual(updated.formId);
										expect(updatedForm.description).toEqual(updated.description);
										expect(updatedForm.type).toEqual(updated.type);
										expect(updatedForm.isActive).toEqual(updated.isActive);
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

		describe("deleteForm method", function(){
			it("should delete existing form", function (done) {
				var form = {
						name: "new form",
						description: "new form desc",
						type: 'radio',
						isActive: true
					};
				mdb.open(function (err, db) {
					db.dropCollection("forms", function (err, result) {
						db.createCollection("forms", function (err, collection) {
							collection.insert(form, function(err, result){
								dal.deleteForm(form._id.toHexString(), function(err){
									expect(err).toBeNull();
									collection.findOne({name: "new form"}, function(err, formFoundAfterDelete){
										expect(err).toBeNull();
										expect(formFoundAfterDelete).toBeNull();
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
});
