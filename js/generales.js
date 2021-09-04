var oGenerales = {
	fnConsultaCMD : function( oParams, fnSuccess, bAsync ){
		$.ajax({
			'url': '/process.php',
			'data': oParams,
			'async': ( typeof bAsync !== "undefined" ? bAsync : true ),
			'type': 'POST',
			'dataType': "json",
			'success': fnSuccess,
			'error': function(xhr, status, error) {
				console.error("XHR error");
				oGenerales.fnNotificacion('error', 'Error', 'Intermitencia en las comunicaciones');
			}
		});
	},
	fnGetInfoFromCMD : function(oParams){
		var info_obtained = (function () {
	        var info_obtained = null;
	        $.ajax({
	            'url': '/process.php',
	            'data': oParams,
	            'async': false,
	            'type': "POST",
	            'dataType': "json",
	            'success': function(data){
	                info_obtained = data;
	            },
	            'error': function(xhr, status, error) {
					console.error("XHR error");
					oGenerales.fnNotificacion('error', 'Error', 'Intermitencia en las comunicaciones');
				}
	        });
	        return info_obtained;
	    })();
	    return info_obtained;
	},
	fnNotificacion : function( sTipo, sTitulo, sContenido ){
		if( sTipo == "error" )
			toastr.error(sContenido, sTitulo, {"closeButton": true});
		else
			toastr.success(sContenido, sTitulo, {"closeButton": true});
	},
	fnAlert : function( oParams ){
		$("#dialog-alert-aceptar").remove();
		var btnAceptar = $('<button type="button" class="btn btn-info" id="dialog-alert-aceptar">Aceptar</button>');
		$("#modal-footer-btns").append(btnAceptar)
		$("#dialog-alert-content").html( '<p>' + oParams.msg + '</p>' );
		btnAceptar.click(oParams.fnAccept);
		$("#dialog-confirm").modal('show');
	},
	sTipoUser : "",
	sNombreCompleto: "",
	sIdCentro: ""
};
function showLoadingOverlay(){
	$("#loading_overlay").css("display", "block");
}
function hideLoadingOverlay(){
	$("#loading_overlay").css("display", "none");
}