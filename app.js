const mysql = require("mysql2");
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "expo",
    password: "password"
});
app.set("view engine", "hbs");
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

app.listen(30333, function(){
    console.log("Сервер ожидает подключения...");
});