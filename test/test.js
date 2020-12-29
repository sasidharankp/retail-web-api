import request from 'supertest';
import app from '../app.js';

describe('App', () =>{
	it('has the default page', function (done) {
		request(app).
			get('/').
			expect(/Welcome to Retail Web API/, done);
	});
});