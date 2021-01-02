//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('User Routes', () => {
	let testUserId;
	let userInfo = {
		email:'testuser@email.com',
		username:'testuser',
		password:'test1234',
		name:{
			firstname:'testFirstName',
			lastname:'testLastName'
		},
		address:{
			city:'testCity',
			street:'testStreet',
			number:19,
			zipcode:123456,
			geolocation: {
				lat:'-46.3159',
				long:'71.1496'
			}
		},
		phone:'1-570-236-7033'
	};
  
	it('it should create a new User', (done) => {
		chai.request(server)
			.post('/users')
			.send(userInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.include.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone', '_id','password' ]);
				expect(res.body).to.not.have.property('errors');
				testUserId=res.body.userId;
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
		chai.request(server)
			.get(`/users/${testUserId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('object')
					.to.includes.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone' ]);
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
					.that.have.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone' ]);
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
					.to.have.all.keys([ 'name', 'address', 'userId', 'email', 'username', 'phone' ])
					.to.not.have.keys(['_id', '__v']);
				expect(res.body).to.have.property('userId', testUserId);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
});
