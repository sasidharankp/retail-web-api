import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import logger from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import indexRouter from './src/routes/index.js';
import productRouter from './src/routes/product.js';
import cartRouter from './src/routes/cart.js';
import userRouter from './src/routes/user.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(
	logger(
		':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
	)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/carts', cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.all('*', (req, res) => {
	res.status(404).json({
		message: 'Route Does Not Exist',
	});
});
export default app;
