const express = require("express");
const app = express();
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
require("dotenv").config();

database.connect();

const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// variable env
const port = process.env.PORT;
const parser = process.env.PARSER;
// end variable env

const systemConfig = require("./config/system");

app.set("views", `${__dirname}/view`);

app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

// flash
app.use(cookieParser(`${parser}`));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

app.locals.prefixAdmin = systemConfig.prefixAdmin;
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
