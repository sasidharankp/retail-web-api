import express from 'express';
const router = express.Router();

/* gET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Retail Web API' });
});

export default router;
