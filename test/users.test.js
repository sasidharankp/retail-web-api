//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

import {userInfo} from '../fixtures/users.js';
import cartModel from '../src/models/cartSchema.js';
import userModel from '../src/models/userSchema.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('/users Routes', () => {
	let testUserId;  
	it('it should create a new User', (done) => {
		chai.request(server)
			.post('/users')
			.send(userInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.include.all.keys([ '__v', '_id', 'cartId', 'createdAt', 'products', 'updatedAt','user' ]);
				expect(res.body).to.not.have.property('errors');
				testUserId=res.body.user;
				done();
			});
	});
  
	it('it should GET all the Users', (done) => {
		chai.request(server)
			.get('/users')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});

	it('it should GET Only one User', (done) => {
		console.log(testUserId);
		chai.request(server)
			.get(`/users/${testUserId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('object')
					.to.includes.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone', 'orders' ]);
				done();
			});
	});
  

  
	it('get Users in a limit and sort', (done) => {
		chai.request(server)
			.get('/users?limit=3&sort=desc')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});
  

	it('it should update a user with given the id', (done) => {
		userInfo.email='testadmin@gmail.com';
		chai.request(server)
			.put(`/users/${testUserId}`)
			.send(userInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone','orders' ]);
				expect(res.body).to.have.property('email', 'testadmin@gmail.com');
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
  
	it('it should DELETE a User given the id', (done) => {
		chai.request(server)
			.delete(`/users/${testUserId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.to.include.keys([ 'message' ]);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
	before(() => {
		userModel.estimatedDocumentCount()
			.then((result) => {
				if(result>0){
					clearDb(userModel);
				}
			})
			.catch((error) => console.log(error));
	});

	after(() => {
		clearDb(userModel);
		clearDb(cartModel);
	});

});

const clearDb=(model)=>{
	model.deleteMany({})
		.then((result) => console.log(result.deletedCount))
		.catch((error) => console.log(error));
};