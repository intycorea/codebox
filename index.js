var express  = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var session = require("express-session");
var app = express();
const _ = require("lodash");
var flash =require("connect-flash");

var credenciales = {
    user:"root",
    password:"",
    port:"3306",
    host:"localhost",
    database:"db_codebox"
};

//Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js

app.use(express.static("public")); //Middlewares
//app.use(express.static("home"));
app.use(session({secret:"#2@%#*(&%$#",resave:true, saveUninitialized:true})); //Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.urlencoded({extended:true}));
app.use(flash());

const home = express.static("home");
app.use(
    function(req, res, next){
        if (!_.isUndefined(req.session.usuario)){
            home(req, res, next);
        }
        else
            return next();
    }
);


app.post("/login", (request, response) => {
    var conexion = mysql.createConnection(credenciales);
    var body = request.body;
    

    var sql =`SELECT codigo_usuario, nombre, apellido, correo
              FROM tbl_usuario 
              WHERE correo=? AND password=?`;
    
    conexion.query(
        sql,
        [body.correo, body.contrasenia],
        function(err, result){
            if (err) throw err;
            if (!_.isEmpty(result)){
                request.session.usuario = result[0];
                response.send({statusCode: 200, message: "Login exitoso"});
            } else {
                response.send({statusCode: 400, message: "Fallo en login"});
            }
        }
    );
});




app.post("/crear-usuario", (request, response) => {
    var conexion = mysql.createConnection(credenciales);
    var body = request.body;
    var sql = "INSERT INTO tbl_usuario(tipo_plan, nombre, apellido, correo, password) VALUES (?,?,?,?,?);";
    conexion.query(
        sql,
        [body.plan, body.usuario, body.lastname, body.correo, body.contrasenia],
        
        
        function(err, result){
            if (err) console.log (err);
            response.send({statusCode: 200, message: "Usuario registrado con éxito"});
        }
        
    );
   
});




app.get("/logout",function(req, res){
    req.session.destroy();
    res.redirect("index.html");
	//respuesta.send("Sesion eliminada");
});



//Crear y levantar el servidor web.
app.listen(3004);
console.log("Servidor inciado en el puerto 3004");