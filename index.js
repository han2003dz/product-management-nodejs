require("dotenv").config();
const express = require("express");
const app = express();
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
database.connect();

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// variable env
const port = process.env.PORT;
const parser = process.env.PARSER;
// end variable env

const systemConfig = require("./config/system");

app.use(methodOverride("_method"));
// flash
app.use(cookieParser(`${parser}`));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

app.set("views", `${__dirname}/view`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

// tinyMce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.use(bodyParser.urlencoded({ extended: false }));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
