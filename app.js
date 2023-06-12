const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const morgan = require("morgan");
const userRoutes = require("./routers/user.route");
const appointmentRoutes = require("./routers/appointement.route");
const app = express();

app.use(express.json());
app.use(morgan());
app.use(cors());
app.use(bodyParser.json());
app.use("/api",userRoutes.router);
app.use("/api",appointmentRoutes.router);

app.listen(config.port, () => {
  console.log("Server Started on PORT 3000");
});
