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
app.set("layout", "./layouts/main-layout");
app.set("view engine", "ejs");

// routes
app.get("/", (req, res, next) => {
  res.status(200).render("pages/home", { title: "Real time Pizza App" });
});

app.all("*", (req, res, next) => {
  res.status(404).render("pages/404/404", {
    title: "ERROR",
    layout: "./layouts/error-layout",
  });
})

export default app;
