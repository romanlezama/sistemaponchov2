<div class="wrapper full-page-wrapper page-login text-center">

	<div class="inner-page">
	
		<div class="logo"><a href="index.html"><img src="img/logo.png" alt="" /></a></div>
		<div class="login-box center-block">
			<form class="form-horizontal" action="/process.php" method="POST" id="formLogin">
				<p class="title">Iniciar Sesión</p>
				<div class="form-group">
					<label for="username" class="control-label sr-only">Usuario</label>
					<div class="col-sm-12">
						<div class="input-group">
							<input type="text" placeholder="Usuario" class="form-control" name="usuario">
							<span class="input-group-addon"><i class="fa fa-user"></i></span>
						</div>
					</div>
				</div>
				<label for="password" class="control-label sr-only">Contraseña</label>
				<div class="form-group">
					<div class="col-sm-12">
						<div class="input-group">
							<input type="password" placeholder="Contraseña" class="form-control" name="upswd">
							<span class="input-group-addon"><i class="fa fa-lock"></i></span>
						</div>
					</div>
				</div>
				<button class="btn btn-custom-primary btn-lg btn-block btn-login"><i class="fa fa-arrow-circle-o-right"></i> Iniciar</button>
			</form>
		</div>
	</div>
	<div class="push-sticky-footer"></div>
</div>
<script>
	$("#formLogin").ajaxForm({
    	dataType : 'json', // La respuesta de espera en formato JSON
    	// Antes de que se envíe la información, se muestra un loader...
    	beforeSubmit : function( formData, jqForm, options ){
    		//Pace.start();
    	},
    	// Manejo la respuesta del servidor una vez procesados los datos enviados
    	success : function( resp ){
    		if( typeof resp.idsession != "undefined" ){
    			localStorage.setItem("idsession", resp.idsession);
    			oGenerales.sTipoUser = resp.perfil.tipo_usuario;
    			oGenerales.sNombreCompleto = resp.perfil.nombre_completo;
    			oGenerales.sIdCentro = resp.idcentro;
    			window.location.href = "#/dashboard/";
    		}else{
    			localStorage.setItem("idsession", undefined);
    			oGenerales.sTipoUser = "";
    			oGenerales.sNombreCompleto = "";
    			oGenerales.sIdCentro = "";
    			oGenerales.fnNotificacion( 'error', 'Error', resp.error );
    		}
    		//Pace.stop();
    	},
    	// Si ocurre algún error en las comunicaciones con el servidor, lanza error
    	error : function( ){
    		console.log('XHR Error');
    		//Pace.stop();
    	}
    });
</script>