(function($) {
	var app = $.sammy('body', function() {
		this.use('Template');
		this.get('#/', function(context) {
			var iSesion = fnEvalSesion();
			if( iSesion != 0 ){
				window.location.href = "#/dashboard/";
			} else{
				window.location.href = "#/login/";
			}
		});
		this.get('#/dashboard/', function(context) {
			var iSesion = fnEvalSesion();
			if(iSesion!=0){
				$.ajax({ url: 'templates/dashboard.tpl', cache: false,
					success: function(data){
						$("#espacio").html(data);
					}
				});
			} else{
				window.location.href = "#/login/"
			}
		});
		this.get('#/uploadtickets/', function(context) {
			var iSesion = fnEvalSesion();
			if(iSesion!=0){
				$.ajax({ url: 'templates/cargatickets.tpl', cache: false,
					success: function(data){
						$("#espacio").html(data);
					}
				});
			} else{
				window.location.href = "#/login/"
			}
		});
		this.get('#/login/', function(context) {
			var iSesion = fnEvalSesion();
			if(iSesion!=0){
				window.location.href = "#/dashboard/";
			}else{
				$.ajax({ url: 'templates/login.tpl', cache: false,
					success: function(data){
						$("footer").before(data);
					}
				});
			}
		});
		this.get('#/nuevocliente/', function(context) {
			var iSesion = fnEvalSesion();
			if(iSesion!=0){
				$.ajax({ url: 'templates/nuevocliente.tpl', cache: false,
					success: function(data){
						$("#espacio").html(data);
					}
				});
			}else{
				$.ajax({ url: 'templates/login.tpl', cache: false,
					success: function(data){
						$("footer").before(data);
					}
				});
			}
		});
		this.get(/\#\/consultas\/(.*)/,function(context){
			$('body').removeClass('mobile-open');
			var sClave = this.params['splat'][0];
			sClave = sClave.replace("/","");
			var iSesion = fnEvalSesion();
			if ( iSesion != 0 ) {
				$.ajax({ url: 'templates/consultas/'+sClave+'.tpl', cache: false, async: false,
					success: function(data){
						$('#espacio').html(data);
					}
				});
			} else {
				window.location.href = "#/login/"; // Direccionamos al login
			}
		});
	});
	$(function() {
		app.run('#/');
	});

})(jQuery);

function fnEvalSesion() {
	var iSesion = (function() {
		var iSesion = null;
		$.ajax({
			'url': 'pruebasesion.json',
			'async': false, 'global': false, cache: false, 
			//'type': 'POST',
			 'dataType': "json",
			//'data': {cmd: "WHOAMI", idsession: localStorage.getItem("idsession")},
			'success': function(data) {
				$("body>div").remove();
				if ((typeof data.idsession != "undefined") && (data.idsession != "")){
					iSesion = data.idsession;
					/*oGenerales.sTipoUser = data.perfil.tipo_usuario;
					oGenerales.sNombreCompleto = data.perfil.nombre_completo;
					oGenerales.sIdCentro = data.idcentro;*/
					$.ajax({ url: 'templates/home.tpl', cache: false, async: false,
						success: function(data){
							$('footer').before(data);
						}
					});
				}else{
					iSesion = 0;
					oGenerales.sTipoUser = "";
					oGenerales.sNombreCompleto = "";
					oGenerales.sIdCentro = "";
				}
			},
			'error': function(xhr, status, error) {
				console.error("XHR error");
				iSesion = 0;
				oGenerales.sTipoUser = "";
				oGenerales.sNombreCompleto = "";
				oGenerales.sIdCentro = "";
			}
		});
		return iSesion;
	})();
	return iSesion;
}