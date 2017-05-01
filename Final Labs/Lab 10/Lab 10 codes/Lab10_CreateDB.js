var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('lab10.db');
db.serialize(function () {
    db.run("CREATE TABLE Users (User TEXT, Password TEXT)");
    db.run("INSERT INTO Users VALUES (?, ?)", ['shannon', 'pass']);
    db.run("ALTER TABLE Users ADD Email TEXT");
    db.run("INSERT INTO Users VALUES (?, ?, ?)", ['john', 'secret', 'john@doe.com']);
    db.all("SELECT * FROM Users", function(err, rows) {  
        rows.forEach(function (row) {  
            console.log(row);  
        })  
    });
});

db.close();