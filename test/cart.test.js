//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('/carts Routes', () => {
	let testCartId;
	let cartInfo = {
		userId:100,
		products: [
			{
				productId: 10,
				quantity: 5
			}
		]
	};
  
	it('it should create a new Cart', (done) => {
		chai.request(server)
			.post('/carts')
			.send(cartInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.include.all.keys([ 'userId', 'createdAt', 'products', 'updatedAt']);
				expect(res.body).to.not.have.property('errors');
				testCartId=res.body.cartId;
				done();
			});
	});
  
	it('it should GET all the Carts', (done) => {
		chai.request(server)
			.get('/carts')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});

	it('it should GET Only one Cart', (done) => {
		chai.request(server)
			.get(`/carts/${testCartId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('object')
					.to.includes.all.keys([ 'userId', 'createdAt', 'products', 'updatedAt' ]);
				done();
			});
	});
  
	it('it should update a cart with given the id', (done) => {
		cartInfo.products[0].quantity=9;
		cartInfo.userId=testCartId;
		chai.request(server)
			.post('/carts')
			.send(cartInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.includes.all.keys([ 'userId', 'createdAt', 'products', 'updatedAt' ]);
				expect(res.body.products[0]).to.have.property('quantity', 9);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
  
	it('it should DELETE a Cart with given the id', (done) => {
		chai.request(server)
			.delete(`/carts/${testCartId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.to.includes.all.keys([ 'userId', 'createdAt', 'products', 'updatedAt' ])
					.to.not.have.keys(['_id', '__v']);
				expect(res.body).to.have.property('cartId', testCartId);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
});
