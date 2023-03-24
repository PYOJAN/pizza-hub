import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { join } from "path";
import MongoSessionStore from "connect-mongo";
import { globalError, error404Handle } from "./error/";
import webRouters from "./routes/web";
import apiRouters from "./routes/api"
import Gaurd from "./app/http/middlewares/authMiddleware";
import addEmptyCartIfNotThere from "./app/http/middlewares/cartItem.moddleware";

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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});
// sanitizing data for noSQL injection
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  }),
);

app.use("/", [addEmptyCartIfNotThere, Gaurd.isUserLoggedin], webRouters);
app.use("/api/v1/auth", apiRouters)

app.all("*", error404Handle);
app.use(globalError);

export default app;
