//declaring libraries
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const cors = require('cors');

//declaring public variables
const app = express();
const port = process.env.PORT || 5000;
//const www = process.env.WWW || "./";

//app.use(express.static(www));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const loginRouter = require("./routes/auth_routes/login_route");
const logoutRouter = require("./routes/auth_routes/logout_route");
const registerRouter = require("./routes/auth_routes/register_route");
const dashboardRouter = require("./routes/dashboard_route");
const profileRouter = require("./routes/profile_route");
const patientsRouter = require("./routes/patients_route");
const areaRouter = require("./routes/area_route");
const productRouter = require("./routes/product_route");
const productPackRouter = require("./routes/pack_route");
const cartRouter = require("./routes/cart_route");
const orderRouter = require("./routes/order_route");
const adminRouter = require("./routes/admin_route");
const statisticRouter = require('./routes/statistic_route');
const db = require("./db/connectDB");

const hbs = handlebars.create({
  extname: "hbs",
  defaultLayout: "main",
  partialsDir: __dirname + "/views/partials/",
  helpers: {
    compare(s1, s2, options) {
      if (s1 == s2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

//middleware modules
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/handle-errors");
const {
  auth: authenticateUser,
  authManager: authenticateManager,
  authPatient: authenticatePatient,
  authAdmin: authenticateAdmin,
} = require("./middlewares/authentication");
const auditMiddleware = require("./middlewares/audit");
const {checkIfServerInit} = require("./middlewares/init-admin"); 

app.use("/register", registerRouter);
app.use('/', checkIfServerInit);

app.use(express.static("./public"));
app.use("/uploads", express.static("./uploads"));
//server main routes
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/dashboard", [authenticateUser, auditMiddleware], dashboardRouter);
app.get("/", (req, res) => res.redirect("/dashboard"));
app.use("/profile", [authenticateUser, auditMiddleware], profileRouter);
app.use(
  "/patients",
  [authenticateUser, authenticateManager, auditMiddleware],
  patientsRouter
);
app.use("/products", authenticateUser, productRouter);
app.use("/packs", [authenticateUser] , productPackRouter);
app.use("/cart", [authenticateUser, authenticatePatient], cartRouter);
app.use(
  "/areas",
  [authenticateUser, authenticateAdmin, auditMiddleware],
  areaRouter
);
app.use("/orders", [authenticateUser, auditMiddleware], orderRouter);
app.use("/admin", [authenticateUser, authenticateAdmin], adminRouter);
app.use("/statistic", [authenticateUser, authenticateManager], statisticRouter);

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
    app.listen(process.env.PORT || 5000, () =>
      console.log(`The server is listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startSever();
