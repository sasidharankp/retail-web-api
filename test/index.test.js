import  chai  from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';
const expect=chai.expect;

chai.use(chaiHttp);
describe('App', () =>{
	it('has the default page', (done) => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(err).to.be.null;
				done();
			});
	});
});