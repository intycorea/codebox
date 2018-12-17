var express  = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var session = require("express-session");
var app = express();
const _ = require("lodash");

var credenciales = {
    user:"root",
    password:"",
    port:"3306",
    host:"localhost",
    database:"db_codebox"
};

//Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js

app.use(express.static("public")); //Middlewares
// app.use(express.static("home"));
app.use(session({secret:"#2@%#*(&%$#",resave:true, saveUninitialized:true})); //Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(express.urlencoded({extended:true}));

const home = express.static("home");
app.use(
    function(request, response, next){
        if (!_.isUndefined(request.session.usuario)){
            home(request, response, next);
        }
        else
            return next();
    }
);


app.post("/login", (request, response) => {
    var conexion = mysql.createConnection(credenciales);
    var body = request.body;
    /*
    var sql = `SELECT codigo_usuario, nombre_usuario, correo, url_imagen_perfil
                FROM tbl_usuarios
                WHERE correo = ? AND contrasena = ?;`;

    */

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



/*
app.post("/crear-contacto", (request, response) => {
    const conexion = mysql.createConnection(credenciales);
    var usuario = request.session.usuario;
    var body = request.body;
    var sql = "INSERT INTO tbl_contactos(codigo_usuario, codigo_usuario_contacto) VALUES (?,?);";
    conexion.query(
        sql,
        [usuario.codigo_usuario, body.codigo_usuario_contacto],
        function(err, result){
            if (err) throw err;
            response.send({statusCode: 200, message: "Contacto registrado con éxito", result});
        }
    );
});

*/

















//Crear y levantar el servidor web.
app.listen(3004);
console.log("Servidor inciado en el puerto 3004");