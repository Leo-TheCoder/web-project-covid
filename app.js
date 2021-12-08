//decalring libraries
const express = require("express");
const handlebars = require('express-handlebars');
const { Router } = require('express');

//declaring public variables
const port = process.env.PORT || 5000;
const www = process.env.WWW || "./";

const app = express();
app.use(express.static(www));
app.use(express.json());
app.use(express.urlencoded());
//console.log(`serving ${www}`);

const hbs = handlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

//server main functions
app.use('/', require('./controllers/users/login.C'));


/*app.get("*", (req, res) => {
  res.sendFile(`index.html`, { root: www });
});*/

//starting the server
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
