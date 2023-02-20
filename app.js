import env from './config'
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import { join } from "path";
import MongoSessionStore from "connect-mongo";
import { globalError, error404Handle } from "./error/";
import webRouters from "./routes/web";

const app = express();

const store = MongoSessionStore.create({
  mongoUrl: process.env.MONGO_URI,
  dbName: "pizzaHub",
  collectionName: "cartSession",
  autoRemove: "native",
});

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: { secure: false, maxAge: oneDay },
  })
);

app.use(express.static("public"));
app.use(expressEjsLayouts);
app.set("views", join(__dirname, "/resources", "/views"));
app.set("layout", "./layouts/main-layout");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;

  next();
});

app.use("/", webRouters);

app.all("*", error404Handle);
app.use(globalError);

export default app;
