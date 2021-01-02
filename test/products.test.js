//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import  chai  from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

const expect=chai.expect;
// const should=chai.should;

chai.use(chaiHttp);

describe('Product Routes', () => {
	let testProductId;
  
	it('it should create a new product', (done) => {
		let newProduct = {
			name: 'Light Saber',
			category: 'Hobby',
			description: 'Laser Light Saber, Blue Color',
			price: 199,
			image: 'https://i.picsum.photos/id/1010/5184/3456.jpg'
		};
		chai.request(server)
			.post('/products')
			.send(newProduct)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name', 'price', 'description', 'image', '_id', '__v' ]);
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
					.to.includes.all.keys([ 'productId', 'category', 'name', 'price', 'description' ]);
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
		let newProduct = {
			name: 'Light Saber',
			category: 'Hobby',
			description: 'Laser Light Saber, Red Color',
			price: 199,
			image: 'https://i.picsum.photos/id/1010/5184/3456.jpg'
		};
		chai.request(server)
			.put(`/products/${testProductId}`)
			.send(newProduct)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.that.have.all.keys([ 'productId', 'category', 'name', 'price', 'description', 'image' ]);
				expect(res.body).to.have.property('description', 'Laser Light Saber, Red Color');
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
  
	it('it should DELETE a book given the id', (done) => {
		chai.request(server)
			.delete(`/products/${testProductId}`)
			.end((err, res) => {
				expect(res.status).to.deep.eql(200);
				expect(res.body).to.be.an('object')
					.to.have.all.keys([ 'productId', 'category', 'name', 'price', 'description', 'image' ])
					.to.not.have.keys(['_id', '__v']);
				expect(res.body).to.have.property('productId', testProductId);
				expect(res.body).to.not.have.property('errors');
				done();
			});
	});
});
