//declaring libraries
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const handlebars = require('express-handlebars');

//declaring public variables
const app = express();
const port = process.env.PORT || 5000;
const www = process.env.WWW || './';

app.use(express.static(www));
app.use(express.json());
app.use(express.urlencoded());

const authRouter = require('./routes/auth_route');
const dashboardRouter = require('./routes/dashboard');
const db = require('./db/connectDB');

const hbs = handlebars.create({
	extname       : 'hbs',
	defaultLayout : 'main',
	partialsDir   : __dirname + '/views/partials/',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

//middleware modules
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/handle-errors');
const authenticateUser = require('./middlewares/authentication');

app.use(express.static('./public'));

//server main routes
app.use('/', authRouter);
app.use('/', authenticateUser, dashboardRouter);

// Test dashboard
// app.use('/test', dashboardRouter);

app.use(express.static('./public'));
//sau nay nhung route can co authenticate thi them middleware authenticateUser vao
//Ex: app.use('/order', authenticateUser, orderRouter)

app.use(express.static('./public'));

//error middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startSever = async () => {
	try {
		await db.connect();
		//starting the server
		app.listen(port, () => console.log(`The server is listening on http://localhost:${port}`));
	} catch (error) {
		console.log(error);
	}
};

startSever();
