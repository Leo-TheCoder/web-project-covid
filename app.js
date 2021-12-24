//declaring libraries
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

//declaring public variables
const app = express();
const port = process.env.PORT || 5000;
const www = process.env.WWW || './';

app.use(express.static(www));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const loginRouter = require('./routes/auth_routes/login_route');
const logoutRouter = require('./routes/auth_routes/logout_route');
const registerRouter = require('./routes/auth_routes/register_route');
const dashboardRouter = require('./routes/dashboard_route');
const profileRouter = require('./routes/profile_route');
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
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/dashboard', authenticateUser, dashboardRouter);
app.get('/', (req, res) => res.redirect('/dashboard'));
// app.use('/profile', authenticateUser, profileRouter);
app.use('/profile', profileRouter);

// Test dashboard
// app.use('/test', dashboardRouter);

//sau nay nhung route can co authenticate thi them middleware authenticateUser vao
//Ex: app.use('/order', authenticateUser, orderRouter)

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
