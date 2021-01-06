//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../app.js';
import cartModel from '../src/models/cartSchema.js';
import {productInfo} from '../fixtures/products.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('/carts Routes', () => {
	let testCartId;
	let testUserId=mongoose.Types.ObjectId();
	let cartInfo = {
		products: [
			{
				productId: '',
				quantity: 5
			}
		]
	};

	// eslint-disable-next-line mocha/no-exclusive-tests
	it.only('it should create a new product', (done) => {
		console.log(`PRODUCT INFO: ${JSON.stringify(productInfo,null,2)}`);
		chai.request(server)
			.post('/products')
			.send(productInfo)
			.end((err, res) => {
				console.log(`RESPONSE: ${JSON.stringify(res.body,null,2)}`);
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name', 'price', 'stock', 'description', 'image', '_id', '__v' ]);
				expect(res.body).to.not.have.property('errors');
				cartInfo.products[0].productId=res.body.productId;
				done();
			});
	}).timeout(10000);

	it('it should create a new Cart', (done) => {
		chai.request(server)
			.post(`/carts/${testUserId}`)
			.send(cartInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.include.all.keys([ '_id', 'cartId', 'user', 'createdAt', 'products', 'updatedAt', '__v']);
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

	it('it should add items to cart', (done) => {
		chai.request(server)
			.put(`/carts/${testCartId}`)
			.send(cartInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.includes.all.keys([ 'cartId', 'user', 'products', 'updatedAt','cartTotal' ]);
				expect(res.body.products[0]).to.have.property('quantity', 5);
				expect(res.body).to.not.have.property('errors');
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
					.to.includes.all.keys([ 'cartId', 'user', 'createdAt', 'products', 'updatedAt','cartTotal' ]);
				done();
			});
	});
  
	it('it should update a cart with given the id', (done) => {
		cartInfo.products[0].quantity=9;
		chai.request(server)
			.put(`/carts/${testCartId}`)
			.send(cartInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.includes.all.keys([ 'cartId', 'user', 'products', 'updatedAt','cartTotal' ]);
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
					.to.includes.all.keys([ 'cartId', 'user', 'createdAt', 'products', 'updatedAt' ])
					.to.not.have.keys(['_id', '__v']);
				expect(res.body).to.have.property('cartId', testCartId);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});

	after(() => {
		clearDb(cartModel);
	});

});

const clearDb= async (model) => {
	await model.deleteMany({})
		.then((result) => console.log(result.deletedCount))
		.catch((error) => console.log(error));
};