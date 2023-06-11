const path = require("path");

require('dotenv').config();

const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection.js");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);


const PORT = process.env.PORT || 3001;
const app = express();


// session setup
const sess = {
  secret: "Super secret secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const helpers = require("./utils/helpers");

const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.use(routes);

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening\nhttp://localhost:${PORT}`)
  );
}); 