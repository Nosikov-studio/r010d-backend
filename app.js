const mysql = require("mysql2");
const mysql2 = require ('mysql2/promise');
const express = require("express");
const cors = require('cors');
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "expo",
    password: "password"
});
const pool2 = mysql2.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "expo",
    password: "password"
});


app.use(cors());
app.use(express.json());

app.set("view engine", "hbs");
// *****************************работа с шаблонизатором***********************
// получение списка пользователей
app.get("/", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            users: data
        });
    });
});

// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});
//******************************************************************************************
// *****************************работа разными подходами (метод get) ***********************
//******************************************без БД************************************************

// (без обращения к БД) с выдачей html

app.get("/pupuh", function(req, res){
    res.send('<h1 style="font-size:50px; color:lime"> Its PUPUH!!!!! </h1>');
});

// (без обращения к БД) с выдачей json

app.get("/pupuj", function(req, res){
    res.json([{id:101, name:'vasa', age:39}]);
});

// (без обращения к БД) с генерацией страницы (pupu.hbs)

app.get("/puput", function(req, res){
    res.render("pupu.hbs");
});
// (без обращения к БД) с генерацией страницы (pupu.hbs) и передачей в неё простых данных

app.get("/puputj", function(req, res){
    res.render("pupu.hbs", {id:102, name:'olga', age:45});
});

// (без обращения к БД) с генерацией страницы (pupu.hbs) и передачей в неё массива данных

app.get("/puputja", function(req, res){
    res.render("pupu.hbs", {array:[{id:102, name:'olga', age:45},{id:103, name:'Evgeny', age:50},{id:104, name:'kuku', age:101}]});
});

//*************************************БД********************************************************************

// с помощью колбэков (требуется mysql2)
app.get("/kuku", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data)}</b>`);
    });
});

// с помощью колбэков (требуется mysql2) - если хотим отправить только первый объект (в JSON)
app.get("/kuku/f", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data[1])}</b>`);
    });
});


// с помощью колбэков (требуется mysql2) 
app.get("/nunu", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:pink">nununununu!!!<br> ${(data[0]['name'])}</b>`);
    });
});

// с помощью колбэков (требуется mysql2) - отправка только JSON
app.get("/juju", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.json(data);
    });
});
//***********************************************************************************************************
// с помощью промисов (требуется mysql2/promise)
app.get("/bubu", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function([r, f]) {
        res.send(`<b style="font-size:50px; color:blue"> heaven <br> ${JSON.stringify(r)}</b>/`);
    });
});
// с помощью промисов (требуется mysql2/promise) - если хотим отправить только первый объект (в JSON)
app.get("/bubu/f", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function([r, f]) {
        res.send(`<b style="font-size:50px; color:blue"> heaven <br> ${JSON.stringify(r[1])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise)
app.get("/mumu", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.send(`<b style="font-size:50px; color:brown"> sobaka??? <br> ${JSON.stringify(data[0])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise)- если хотим отправить только первый объект (в JSON)
app.get("/mumu/f", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.send(`<b style="font-size:50px; color:brown"> sobaka??? <br> ${JSON.stringify(data[0][1])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise) - отправка только JSON
app.get("/jujup", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.json(data[0]);
    });
});
//***********************************************************************************************************


// с помощью async - await (требуется mysql2/promise)
app.get("/lulu", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.send(`<b style="font-size:50px; color:red"> fire!!!<br> fire!!! <br> ${JSON.stringify(d[0])} </b>/`);
    });

// с помощью async - await (требуется mysql2/promise)- если хотим отправить только первый объект (в JSON)
app.get("/lulu/f", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.send(`<b style="font-size:50px; color:red"> fire!!!<br> fire!!! <br> ${JSON.stringify(d[0][1])} </b>/`);
    });

// с помощью async - await (требуется mysql2/promise)- отправка только JSON
app.get("/julua", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.json(d[0]);
    });    

    //***********************************************************************************************************
// *****************************работа с get и параметрами****************************************************************

// с помощью колбэков (требуется mysql2) получем id редактируемого пользователя, получаем его из бд
app.get("/kuku/:id", function(req, res){
    const id=req.params.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data)}</b>`);
    });
});


    //***********************************************************************************************************
// *****************************работа с POST****************************************************************

app.get("/api", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) {
        if(err) return console.log(err);
        res.json(data);
    });
});

app.post("/api", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    console.log('from backblabla');
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
        if(err) return console.log(err);
        console.log('from back'+data);
        res.json(data);
    });
});

//***********************************************************
app.listen(30333, function(){
    console.log("Сервер ожидает подключения...");
});