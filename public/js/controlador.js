
function login(){
	var correo = $("#correo_login").val();
	var contrasenia = $("#password_login").val();
	var usuario = {
		correo, contrasenia
	};
	var isValid = true;
	_.forEach(usuario, campo => {
		if(_.isEmpty(campo)){
			isValid = false;
		}
	});
	if(isValid){
		$.ajax({
			url:"/login",
			data: urlEncoded(usuario),
			method:"POST",
			dataType:"json",
			success:function(respuesta){
				var mensaje = "";
				if (!_.isUndefined(respuesta.statusCode) && respuesta.statusCode == 200){
					window.location.href ="../../home.html"
				}
				else{
					mensaje = "ERROR AL INICIAR SESIÓN";
				}
				/*
				$("#mensaje").text(mensaje);
				$("#modalSuccess").modal("show");
				*/
			}
		});
	}
}










function guardarUsuario(){
    var plan = $("#plan").val();
    var usuario = $("#nombre").val();
    var lastname = $("#apellido").val();
	var correo = $("#email").val();
	//var imagen = $("#image").val();
	var contrasenia = $("#password").val();
	var nuevoUsuario = {
		plan, usuario, lastname, correo, contrasenia
	};
	var isValid = true;
	_.forEach( function(nuevoUsuario, campo) {
		if(_.isEmpty(campo)){
			isValid = false;
		}
	});

	if(isValid){
		$.ajax({
			url:"/crear-usuario",
			data: urlEncoded(nuevoUsuario),
			method:"POST",
			dataType:"JSON",
			success:function(respuesta){
				var mensaje = "";
				if (!_.isUndefined(respuesta.statusCode) && respuesta.statusCode == 200){
					mensaje = respuesta.message;
				}
				else{
					mensaje = "Ocurrió un error al guardar usuario";
                }
                /*
				$("#modalRegistro").modal("hide");
				$("#mensaje").text(mensaje);
                $("#modalSuccess").modal("show");
                */
			}
		});
	}
}

function urlEncoded(object){
	var url = "";
	var flag = 0;
	_.forEach(object, function (value, key) {
		if(flag > 0){
			url += "&";
		}
		url += `${key}=${value}`;
		flag++
	});
	return url;
}