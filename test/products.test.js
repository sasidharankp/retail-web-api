//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

import {products, productInfo} from '../fixtures/products.js';
import productModel from '../src/models/productSchema.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('/products Routes', () => {
	let testProductId;

	it('Should check If the Collecion Is empty', (done) => {
		productModel.estimatedDocumentCount()
			.then((result) => {
				expect(result).to.eql(0);
				done();
			})
			.catch((error) => console.log(error));
	});
	
	it('it should add multiple products at once', (done) => {
		chai.request(server)
			.post('/products/bulk')
			.send(products)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				expect(res.body[0]).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name','stock', 'price', 'description', 'image', '_id', '__v' ]);
				expect(res.body).to.not.have.property('errors');
				testProductId=res.body.productId;
				done();
			});
	});

	it('it should create a new product', (done) => {
		chai.request(server)
			.post('/products')
			.send(productInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name', 'price', 'stock', 'description', 'image', '_id', '__v' ]);
				expect(res.body).to.not.have.property('errors');
				testProductId=res.body.productId;
				done();
			});
	});

	it('it should GET all the Products', (done) => {
		chai.request(server)
			.get('/products')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});

	it('it should GET Only one Product', (done) => {
		chai.request(server)
			.get(`/products/${testProductId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('object')
					.to.includes.all.keys([ 'productId', 'category', 'name', 'price','stock', 'description','image' ]);
				done();
			});
	});
  
	it('get products in a category', (done) => {
		chai.request(server)
			.get('/products/category/electronics')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});
  
	it('get products in a limit and sort', (done) => {
		chai.request(server)
			.get('/products?limit=3&sort=desc')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(err).to.be.a('null');
				expect(res.body)
					.to.be.an('array').that.is.not.empty  
					.not.to.be.an('object');
				done();
			});
	});
  
	it('it should update a product with given the id', (done) => {
		productInfo.description= 'Laser Light Saber, Red Color',
		chai.request(server)
			.put(`/products/${testProductId}`)
			.send(productInfo)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name', 'price', 'stock', 'description', 'image' ]);
				expect(res.body).to.have.property('description', 'Laser Light Saber, Red Color');
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
  
	it('it should DELETE a product given the id', (done) => {
		chai.request(server)
			.delete(`/products/${testProductId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.to.have.all.keys([ 'productId', 'category', 'name', 'price', 'stock', 'description', 'image' ])
					.to.not.have.keys(['_id', '__v']);
				expect(res.body).to.have.property('productId', testProductId);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});

	it('it should DELETE all Products in the Collection', (done) => {
		chai.request(server)
			.delete('/products/bulk')
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.to.include.keys([ 'deletedCount']);
				expect(res.body.deletedCount).to.be.greaterThan(0);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
	
	before(() => {
		productModel.estimatedDocumentCount()
			.then((result) => {
				if(result>0){
					clearDb(productModel);
				}
			})
			.catch((error) => console.log(error));
	});

	after(() => {
		clearDb(productModel);
	});

});

const clearDb= (model) => {
	model.deleteMany({})
		.then((result) => console.log(result.deletedCount))
		.catch((error) => console.log(error));
};