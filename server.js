import express from "express";
import { create } from "express-handlebars";
import * as helpers from "./public/javascripts/helpers.js";
import * as path from "path";
import { fileURLToPath } from "url";
import i18n from 'i18n';
import session from 'express-session';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var app = express();
dotenv.config({ path: './.env' });

// Create `ExpressHandlebars` instance with a default layout.
var hbs = create({
	helpers,

	// Uses multiple partials dirs, templates in "shared/templates/" are shared
	// with the client-side of the app (see below).
	partialsDir: [
		"views/layouts/",
	],
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//i18n config
i18n.configure({
    locales:['en', 'zh-CN'],
    directory: __dirname + '/public/languages',
    defaultLocale: 'en'
});
app.use(i18n.init);
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'sdfddgsadffgegasdfghrjljllihhjykhf'
}));
app.use(setLocale);
function setLocale(req, res, next){
    var locale;
    if(req.acceptsLanguages()){
        locale = req.acceptsLanguages();
    }
    else{
        locale = 'en';
    }

    req.setLocale(locale);

    next();
};


app.get("/", (req, res) => {
	res.render("index");
});

app.get("/brainstorm", (req, res) => {
	res.render("brainstorm");
});

app.get("/down", (req, res) => {
	res.render("down");
});

app.get("/faq", (req, res) => {
	res.render("faq");
});

app.get("/pinode", (req, res) => {
	res.render("pinode");
});

app.get("/support", (req, res) => {
	res.render("support");
});

app.get("/header-dh", (req, res) => {
	res.render("header-dh");
});

app.get("/undefined", (req, res) => {
	res.render("error");
});

app.use(express.static("public/"));
app.use(express.static("views/"));

app.listen(3010, () => {
	console.log("express-handlebars example server listening on: 3010");
});
