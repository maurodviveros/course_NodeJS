"use strict";
const path      = require('path');
const hbs       = require('hbs');
const express   = require('express');
const app   = express();
const PORT  = 8080;


hbs.registerPartials(__dirname + '/views/partials', function (err) {});
app.set('views', path.join(__dirname,'/views'));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.render("home", {
        name: "Mauro Viveros",
        title: "Curso NodeJS"
    });
});

app.get('/generic', (req, res)=>{
    res.render("generic", {
        name: "Mauro Viveros",
        title: "Curso NodeJS"
    });
});
app.get('/elements', (req, res)=>{
    res.render("elements", {
        name: "Mauro Viveros",
        title: "Curso NodeJS"
    });
});

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/404.html"));
});


app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
});