const express = require("express");
const app = express();
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
require("dotenv").config();

database.connect();

const port = process.env.PORT;

const systemConfig = require("./config/system");

app.set("views", "./view");
app.set("view engine", "pug");

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
