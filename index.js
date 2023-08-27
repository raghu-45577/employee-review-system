const express = require("express");
const db = require("./config/mongoose");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const app = express();
require("dotenv").config();
const port = 8000;

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));
app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "momentoos",
    secret: "development",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 120,
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://vraghu45577:olgMTyGaGL4C5vKs@employee-review-system.08rjvqm.mongodb.net/employee-review-system?retryWrites=true&w=majority",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes/index"));

app.listen(process.env.PORT, function (err) {
  if (err) {
    console.log("Error in creating express server ", err);
    return;
  }
  console.log(`Server is up and running on port ${process.env.PORT}`);
});
