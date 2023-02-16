import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { join } from "path";

// express App initlizing
const app = express();

// Static Files
app.use(express.static("public"));

// Set template engine
app.use(expressEjsLayouts);
app.set("views", join(__dirname, "/resources", "/views"));
app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");

// routes
app.get("/", (req, res, next) => {
  res.status(200).render("home", { title: "home page" });
});

export default app;
