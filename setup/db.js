import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.dev';
dotenv.config({ path: envFile });
import mongoose from 'mongoose';
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const mongoDbUrl =
  `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}?retryWrites=true&w=majority`;
  
let _db;
console.log(`FROM DB.JS FILEPATH: ${envFile}`);
console.log(`FROM DB.JS NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FROM DB.JS DB_HOST: ${process.env.DB_HOST}`);

const initDb = (callback) => {
	if (_db) {
		console.log('Database is already initialized!');

		return callback(null, _db);
	}
	mongoose.
		connect(mongoDbUrl, { useNewUrlParser: true,
			useUnifiedTopology: true }).
		then((client) => {
			_db = client;
			callback(null, _db);
		}).
		catch((err) => {
			callback(err);
		});
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
		
};

const getDb = () => {
	if (!_db) {
		throw Error('Database not initialzed');
	}

	return _db;
};

export default { initDb,
	getDb };
