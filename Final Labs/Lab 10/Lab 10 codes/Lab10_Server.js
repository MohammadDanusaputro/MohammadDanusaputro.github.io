var http = require("http");
var url = require('url');

function queryDatabase(name, password, url, callback)
{
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('Lab10.db');
    db.serialize(function () {
        db.all("SELECT * FROM Users WHERE User=? AND Password=?", [name, password], function (err, rows) {
            if (rows.length > 0) {
                callback("<h1>Hello, " + name + " Log In Successful</h1><p>You asked for <code>" +
                                url + '</code></p> <form action="/login" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Password" name="psw" required>   <button type="submit">Login</button>  </div></form><div class="container" style="background-color:#f1f1f1"><span class="psw">Forgot <a href="resetpassword">Change Password</a></span></div>');

            }
            else {
                callback("<h1>Hello, ??? Log In Failed. Try Again.</h1><p>You asked for <code>" +
                                url + '</code></p> <form action="/login" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Password" name="psw" required>   <button type="submit">Login</button>  </div></form><div class="container" style="background-color:#f1f1f1"><span class="psw">Forgot <a href="resetpassword">Change Password</a></span></div>');
            }

        });

    });
    db.close();
}

function modifyDatabase(name, newPassword, password, url, callback)
{
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('Lab10.db');
    db.serialize(function () {
        db.run("UPDATE Users SET Password = ? WHERE User = ? AND Password = ?", [newPassword, name, password]);
        db.all("SELECT * FROM Users WHERE User=? AND Password=?", [name, newPassword], function (err, rows) {
            if (rows.length > 0) {
                callback("<h1>Hello, " + name + " Password Change & Log In Successful</h1><p>You asked for <code>" +
                                url + '</code></p> <form action="/login" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Password" name="psw" required>   <button type="submit">Login</button>  </div></form><div class="container" style="background-color:#f1f1f1"><span class="psw">Forgot <a href="resetpassword">Change Password</a></span></div>');
            }
            else {
                callback("<h1>Hello, ??? Password Change & Log In Failed. Try Again.</h1><p>You asked for <code>" +
                                url + '</code></p> <form action="/login" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Password" name="psw" required>   <button type="submit">Login</button>  </div></form><div class="container" style="background-color:#f1f1f1"><span class="psw">Forgot <a href="resetpassword">Change Password</a></span></div>');
            }

        });

    });
    db.close();
}

var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    console.log(request.url);
    if (request.url.includes("/login?")) {
        var queryData = url.parse(request.url, true).query;
        var userName = queryData.uname;
        var userPassword = queryData.psw;
        queryDatabase(userName, userPassword, request.url, function (res) {
            response.write(res);
        });
    }

    else if (request.url.includes("/changepass")) {
        var queryData = url.parse(request.url, true).query;
        var userName = queryData.uname;
        var userPassword = queryData.psw;
        var newPassword = queryData.newPassword;
        modifyDatabase(userName, newPassword, userPassword, request.url, function (res) {
            response.write(res);
        });
    }

    else if (request.url.includes("/resetpassword")) {

        response.write('<h1>Reset Password</h1></p> <form action="/changepass" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Current Password" name="psw" required><label><b> New Password</b></label><input type="password" placeholder="Enter New Password" name="newPassword" required><button type="submit">Change Password</button>  </div></form>');
    }
    else {
        response.write('<h1>Please log in!!!</h1></p> <form action="/login" method="get"> <div class="container"><label><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required>   <label><b>Password</b></label> <input type="password" placeholder="Enter Password" name="psw" required>   <button type="submit">Login</button>  </div></form><div class="container" style="background-color:#f1f1f1"><span class="psw">Forgot <a href="resetpassword">Change Password</a></span></div>');
    }

});

server.listen(8000);