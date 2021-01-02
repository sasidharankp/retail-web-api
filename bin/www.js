#!/usr/bin/env node

/**
 * module dependencies.
 */
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import app from '../app.js';
import debug from 'debug';
import https from 'https';
import fs from 'fs';

/**
 * read keys and cert files for HTTPS server
 */
const key = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');

/**
 * get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000');

app.set('port', port);

/**
 * create HTTPS server.
 */

const server = https.createServer({ key,
	cert }, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * normalize a port into a number, string, or false.
 */

function normalizePort (val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * event listener for HTTPS server "error" event.
 */

function onError (error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(`${bind} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(`${bind} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * event listener for HTTPS server "listening" event.
 */

function onListening () {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

	debug(`Listening on ${bind}`);
	console.log(`Listening on ${bind}`);
}