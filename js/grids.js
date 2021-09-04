/**
 * Creación de tablas dinámicas (Grids) a partir de las definiciones en .json
 *
 * @summary   Generación de tablas dinámicas
 *
 * @requires jquery-2.2.4.min.js
 * @requires jquery.dataTables.min.js
*/
/**
 * @var {json} renderers
 * Contiene las funciones que dan "formato" a los "metatipos" de una tabla dinámica
*/
var renderers = {
	/**
	* Crea link que procesará una petición de login hacia un sistema dado, procesa metatipo "link"
	* @param {String} val
	* @param {String} id
	* @return {String}
	*/
	to_link : function( val, id ){
		return '<a href="javascript:;" onclick="fnFormDialog(\''+val+'\')">'+val+'</a>';
	},
	/**
	* Crea botón para los registros de tipo "boton"
	* @param {String} val
	* @param {String} u_id
	* @return {String}
	*/
	to_button : function( val, u_id ){
		return '<button style="z-index:0;" class="light tiny text_only has_text" onclick="clickBoton(\''+val+'\', \''+u_id+'\')"><span>' + val + '</span></button>';
	},
	to_date : function( fecha ){
		if(fecha != null){
	        return moment(fecha).format('DD/MM/YYYY');
	    } else {
	        return "";
	    }
	},
	to_link_pdf : function( val, url ){
		return '<a href="'+url+'" target="_blank">'+val+'</a>';
	},
	/**
	 * Convierte un número dado ya sea entero o flotante en formato moneda con separación de miles y centavos
	 * con dos décimas 000,000.00
	 * @param {integer/float} num Número entero o flotante a convertir
	 * @return {string} número convertido en formato moneda
	 */
	to_pesos: function( num ) {
	    if(num === null){
	        return "";
	    } else {
	        num = num.toString().replace(/\$|\,/g,'');
	        if(isNaN(num))
	            num = "0";
	        var sign = (num == (num = Math.abs(num)));
	        num = Math.floor(num*100+0.50000000001);
	        var cents = num%100;
	        num = Math.floor(num/100).toString();
	        if(cents < 10)
	            cents = "0" + cents;
	        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	            num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
	        return (((sign)?'':'-') + num + '.' + cents);
	    }
	}
};
/**
* Procesa el click del botón generado por el metatipo "boton"
* @param {String} val
* @param {String} u_id
*/
function clickBoton( val, u_id ){
	var conf_forma = { // Configuraciones con las que se harán las peticiones para armar las formas en popup
        tipo : 'form',
        popup : true,
        data : { forma: "", edit: "si", u_id: u_id }
	};
	var procesa_forma = true; // Bandera para verificar si procede o no la petición, no procesde en caso de que no haya definición para la forma que se intenta llamar
	procesa_forma = false;
	//dialog_alert( 'Mensaje', 'Forma en proceso' );
	oGenerales.fnNotificacion( '', 'Mensaje', "Forma en proceso" );
	if( procesa_forma ) // Si mi bandera es true hago la petición de la forma definida
		procesa_peticion( conf_forma );
}
/**
* Inicio las configuraciones para armar la tabla dinámica
*/
var grid = {
	/**
	* Función que se encarga de transformar el json consultado en tabla dinámica y la presenta en pantalla
	* @param {String} n_json
	* @param {<div/>} espacio
	* @param {json} botonesCabecera
	*/
	crear : function( n_json, espacio, botonesCabecera ){
		$.ajax({
			url : '/maquetas/tablas/' + n_json + '.json',
			dataType : 'json',
			cache : false,
			beforeSend: function(){
				//Pace.start();
			},
			success : function( resp ){
	            var conf_grid = resp; // @var {json} Contiene las configuraciones del grid
	            var grid_id = conf_grid.id_tabla; // @var {String} id de la tabla dinámica

	            $( "#titulo" ).html( '<h2>' + resp.titulo + '</h2>' );
				espacio.html('<div align="left" class="box grid_16 single_datatable">'+
							'<div id="div__'+conf_grid.div_table+'" class="no_margin">'+
								'<table id="'+grid_id+'" class="table table-sorting table-striped table-hover datatable"></table>'+
							'</div>'+
							'<div id="folios_totales"></div>'+
							/*'<div class="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix" style="text-align: right">'+
								'<button class="btn btn-danger" onclick="descarga_archivo(\''+grid_id+'\',\'PDF\')"><i class="fa fa-download"></i>PDF</button>&nbsp;'+
								'<button class="btn btn-success" onclick="descarga_archivo(\''+grid_id+'\',\'XLS\')"><i class="fa fa-download"></i>XLS</button>'+
							'</div>'+*/
						'</div>');
	            var cols_new = new Array(); // @var {array} contendrá las nuevas configuraciones de columnas, después de ser procesadas
	            var cols = conf_grid.columns; // @var {array} Columnas predefinidas en el json
	            for( var i=0; i<cols.length; i++ ){ // Recorro las columnas
	            	var c = cols[ i ];
	            	var c_new = {};
	            	c_new[ 'title' ] = c.sTitle; // Título de la columna en tabla dinámica
	            	c_new[ 'visible' ] = ( c.bVisible == "F" || c.tipo == "NOSELECT" ) ? false : true; // Si se debe o no mostrar la columna
	            	c_new[ 'width' ] = ( c.sWidth == 0 ) ? null : c.sWidth + 'em';// Define ancho
	            	switch( c.tipo ){ // Inicia proceso para renderear los metatipos definidos
	            		case 'link': // @return <a href="javascript:funcion()">Etiqueta</a>
	            			c_new[ 'render' ] = function( data, type, row, meta ){
	            				if( $( "#user_firmado_perfil" ).val() == "digitalizacion1" )
	            					return renderers.to_link( data, row[0]);
	            				else if( $( "#user_firmado_perfil" ).val() == "juridico" )
	            					return renderers.to_link_pdf( data, row[15] )
	            				else
	            					return data;
	            			}
	            			break;
	            		case 'boton': // @return <button onclick="funcion()">Etiqueta<button>
	            			c_new[ 'render' ] = function( data, type, row, meta ){
	            				return renderers.to_button( data, row[0] );
	            			}
	            			break;
	            		case 'date':
	            		case 'fecha':
	            			c_new[ 'render' ] = function( data, type, row, meta ){
	            				return renderers.to_date( data );
	            			}
	            			break;
	            		case 'moneda':
	            			c_new['class'] = "right";
	            			c_new[ 'render' ] = function( data, type, row, meta ){
	            				return renderers.to_pesos( data );
	            			}
	            			break;
	            		case 'status':
	            			c_new[ 'render' ] = function( data, type, row, meta ){
	            				switch (data){
	            					case "pagado":
	            						return '<span class="label label-success">Pagado</span>';
	            						break;
	            					case "pendiente":
	            						return '<span class="label label-warning">Pendiente</span>';
	            						break;
	            					case "excedido":
	            						return '<span class="label label-info">Excedido</span>';
	            						break;
	            					case "adeudo":
	            						return '<span class="label label-danger">Adeudo</span>';
	            						break;
	            					default: break;
	            				}
	            				//<span class="label label-success">Active</span>
	            			}
	            			break;
	            		default : break;
	            	} // Termina el proceso de rendereo de metatipos
	            	cols_new.push( c_new );
	            }
				$( "#" + grid_id ).dataTable({
					pageLength: 10,
					searching: false,
					paginationType: "bootstrap",
					columns : cols_new,
        			rowCallback: function( row, data ) {
			            $(row).click(function(e) { // Hago la selecciÃ³n de un registro del Datatable.
			                if ( $(this).hasClass('row_selected') ) {
			                    $(this).removeClass('row_selected');
			                    $( ".habilitaRow" ).prop( 'disabled', true );
			                } else {
			                    $('#'+grid_id).dataTable().$('tr.row_selected').removeClass('row_selected');
			                    $(this).addClass('row_selected');
			                    $( ".habilitaRow" ).prop( 'disabled', false );
			                }
			            });
			        },
					language : {
			            lengthMenu : "Mostrar _MENU_ renglones por página",
			            zeroRecords : "No se encontraron datos",
			            info : "Mostrando _START_ al _END_ de _TOTAL_ registros",
			            infoEmpty : "No hay información disponible",
			            infoFiltered : "(Filtrado de _MAX_ renglones totales)",
			            search: "Buscar:"
			        }
				});

				$( "#" + grid_id ).dataTable().on( 'search.dt', function () {
				    $( "#"+grid_id+" tbody>tr" ).click(function(e) { // Hago la selecciÃ³n de un registro del Datatable.
		                if ( $(this).hasClass('row_selected') ) {
		                    $(this).removeClass('row_selected');
		                    $( ".habilitaRow" ).prop( 'disabled', true );
		                } else {
		                    $('#'+grid_id).dataTable().$('tr.row_selected').removeClass('row_selected');
		                    $(this).addClass('row_selected');
		                    $( ".habilitaRow" ).prop( 'disabled', false );
		                }
		            });
				} );
	            /**
	            * Inserción de botones
	            * [Condiciones] Para mostrar en popup la forma de filtros
	            * [XLS] [CSV] [PDF] Para generar descarga del reporte en el formato deseado
	            */
	            var div_encab_grid = $( "#" + grid_id + "_wrapper>div:first" );
	            var div_info_grid = $( "#" + grid_id + "_info" );
	            //div_encab_grid.css( 'float', 'right' );
	            $("#"+grid_id+"_length").css('display', 'none');
	            div_encab_grid.css({"display": "block", "width": "100%"});
	            div_encab_grid.html( '<div class="padding-bottom-10 row">'+
	            	'<div class="col-md-8">'+
	            		'<strong>Filtros: </strong><span id="text_filtros"></span>'+
	            	'</div>'+
	            	'<div class="col-md-4 right">'+
	            		'<button class="btn btn-primary" id="btnFiltros"><i class="fa fa-filter"></i> Condiciones</button></div>'+
	            	'</div>' );

	            $( "#btnFiltros" ).click( function(){ // Configuro el click del botón [Condiciones]
	            	$( "#dialog-filtro" ).modal( 'show' );
	            	$( ".ui-widget-overlay" ).css( "height", $(document).height() );
	            } );

            	var btnAdd = $( '<button class="btn btn-success"><i class="fa fa-plus"></i> Agregar</button>' );
            	var btnEdit = $( '<button class="btn btn-warning habilitaRow" disabled><i class="fa fa-pencil-square-o"></i> Editar</button>' );
            	var btnRmv = $( '<button class="btn btn-danger habilitaRow" disabled><i class="fa fa-trash"></i> Eliminar</button>' );
            	btnAdd.click(function(){
            		var nameForma = (grid_id=="inscripcionPosibilidad") ? 'inscribePosibilidad' : grid_id;
            		/*
            		oGenerales.fnConsultaCMD( {cmd: "CMDRECFORMAEDIT", params: {forma: nameForma, id: "", edit: "no"}}, function(oInfoForm){
            			forma.crear(oInfoForm, $('#dialog-form-content') );
            		} );
            		*/
            		forma.consulta_json('inscribePosibilidad', $('#dialog-form-content'));
            		$("#dialog-form").on("hidden.bs.modal", function () {
					    $("#dialog-form-content").html('. . .');
					    $("#title_popup").html('Cargando Contenido');
					});
            		$('#dialog-form').modal( 'show' );
            	});

            	btnEdit.click(function(){
            		var row_selected = $( "#" + grid_id ).DataTable().row('.row_selected').data();
            		oGenerales.fnConsultaCMD( {cmd: "CMDRECFORMAEDIT", params: {forma: grid_id, id: row_selected[0], edit: "si"}}, function(oInfoForm){
            			oInfoForm.elementos.push({"label": "","name": "edit","id": "edit","tipo": "hidden","rdonly": "F","maxlength": "0","defaultvalue": "yes","filtro": "F","required": "","message": ""});
            			forma.crear(oInfoForm, $('#dialog-form-content') );
            		} );
            		$("#dialog-form").on("hidden.bs.modal", function () {
					    $("#dialog-form-content").html('. . .');
					    $("#title_popup").html('Cargando Contenido');
					});
            		$('#dialog-form').modal( 'show' );
            	});

            	$("#dialog-alert-aceptar").click(function(){
					var row_selected = $( "#" + grid_id ).DataTable().row('.row_selected').data();
    				oGenerales.fnConsultaCMD( {cmd: "CMDBORRADATO", tabla: grid_id, id: row_selected[0]}, function(resp){
            			var titulo_msg = ( resp.msg == "Error" ) ? 'Error' : 'Mensaje';
		        		var tipo_msg = ( resp.msg == "Error" ) ? 'error' : '';
		        		var text_msg = ( resp.msg == "Error" ) ? 'Ocurrió un error' : 'Registro eliminado correctamente';
		        		oGenerales.fnNotificacion( tipo_msg, titulo_msg, text_msg );
		        		if( resp.msg != "Error" )
		        			grid.cargaInformacion( grid_id, '{}' );
            		} );
				});
            	btnRmv.click(function(){
            		$("#dialog-alert-content").html( '<p>¿Está seguro que desea eliminar este registro?</p>' );
					$("#dialog-confirm").modal('show');
            	});
            	/*$('#'+grid_id+'_wrapper').before( btnAdd );
            	$('#'+grid_id+'_wrapper').before( '&nbsp;' );
            	$('#'+grid_id+'_wrapper').before( btnEdit );
            	$('#'+grid_id+'_wrapper').before( '&nbsp;' );
            	$('#'+grid_id+'_wrapper').before( btnRmv );*/
	            grid.cargaInformacion( grid_id, '{}' ); // Se encargará de llenar la tabla dinámica con los registros, después de ejecutar el query
	            grid.PopUpFiltros( conf_grid ); // Genera forma de filtros
			},
			error : function(){ // Si existiera error al consultar el json de la tabla dinámica
				//dialog_alert( 'Error', 'Intermitencia en las comunicaciones' );
				oGenerales.fnNotificacion( 'error', 'Error', "Intermitencia en las comunicaciones" );
	            //hideLoadingOverlay();
			}
		});
	},
	/**
	* Produce la forma para filtrar la información de la tabla dinámica
	* @param {json} data
	*/
	PopUpFiltros : function( data ){

	    var columnas 	= 	data.columns,
			arrLimites 	= 	[],
			name_report = 	data.id_tabla;

		for(var r=0; r<columnas.length; r++){
			var rango = columnas[r].rango;
			if(rango=="lils")
				arrLimites.push(rango);
		}
		var contenedor = $('<div class="card-block"></div>');
		var fm_filtros = $( '<form id="form_filtros" method="POST" />' );
		/**
		* Crea un campo <iput/>
		* @param {String} nm
		* @param {String} tipo
		* @return {<input/>} input
		*/
		var crear_input = function( nm, tipo, placeholder ){
			var input = $( '<input type="text" name="'+nm+'" class="form-control" placeholder="'+placeholder+'" />' );
			if( tipo.match( /date|datepicker/g ) ){
				input.datepicker({
			        format: 'dd/mm/yyyy'
			        //daysOfWeekDisabled: [0,6], ------------------> Deshabilita el Sábado y Domingo
			    }).on('changeDate', function(ev){
				    $(this).datepicker('hide');
				});
			    //input.addClass('date_picker');
			}
			return input;
		}
		/**
		* Recorro las columnas definidas para la tabla dinámica, si tiene definido un "rango"
		* Se creará su campo para ser tomado en cuenta en los filtros
		*/
		for( var i=0; i<columnas.length; i++ ){
			var c = columnas[ i ];
			if( typeof c.rango !== "undefined" ){
				var form_row = $('<div class="form-group row"></div>');
				form_row.append('<div style="margin-left:10px;"><label class="form-form-control-label">' + c.sTitle + '</label></div>');
				switch( c.rango ){
					case 'lils': // Límite inferior y Superior, indica que el filtro será en rango
						var input_li = $( '<div/>', {class: "col-md-6"} ).html( crear_input( 'li_' + c.campo, c.tipo, 'Desde' ) );
						var input_ls = $( '<div/>', {class: "col-md-6"} ).html( crear_input( 'ls_' + c.campo, c.tipo, 'Hasta' ) );
						form_row.append( input_li ).append( input_ls );
						break;
					case 'igual': // El filtro será de igualdad
						var input_ig = $( '<div/>', {class: "col-md-12"} ).html( crear_input( c.campo, c.tipo, 'Igual a' ) );
						form_row.append( input_ig );
						break;
					default : break;
				}
				fm_filtros.append( form_row );
			}
		}
		contenedor.append(fm_filtros);
		$("#espacio_filtro").append(contenedor);
		/**
		* Se crean y configuran los botones
		* [Consultar] para iniciar la consulta de los filtros
		* [Limpiar Forma] Resetea la forma de consultas para introducir nueva información
		* [Limpiar Filtros] Además de resetear la forma, limpia cualquier filtro de la tabla dinámica
		*/
		var bts = $( '#dialog-filtro-footer' );
		bts.html('<button class="btn btn-success" data-dismiss="modal" id="btn_filtrar" type="button">Consultar</button>'+
			'<button class="btn btn-info" id="limpiar_form" type="button">Limpiar Forma</button>'+
			'<button class="btn btn-primary" data-dismiss="modal" id="limpiar_filtros" type="button">Quitar filtros activos</button>'
		);

	    $("#btn_filtrar").click(function(){
	        if($("#form_filtros").valid()){
	            var filtro_json = JSON.stringify( $("#form_filtros").serializeObject() );
				grid.cargaInformacion( name_report, filtro_json );
				$( '#dialog-filtro' ).modal('hide');
	        }
	    });

	    $("#limpiar_form").click(function(){
	    	$("#form_filtros")[0].reset();
	        $("#entNbreve").val('');
	    });

	    $("#limpiar_filtros").click(function(){
	        $("#form_filtros")[0].reset();
	        $("#entNbreve").val('');
			grid.cargaInformacion( name_report, '{}' );
			$( '#dialog-filtro' ).modal('hide');
	    });
	},
	/**
	 * Prepara un string con los filtros para pasarlos ya formateados al process
	 * @param {String} filtro_json_to_post
	 * @retun {String}
	*/
	get_filters_format : function(filtro_json_to_post){
		var aFiltros = [];
		var oFilter = JSON.parse( filtro_json_to_post );
		$.each(oFilter, function(i, v){
			if( !/^li_|^ls_/.test(i) ){
				aFiltros.push( i + ' = "' + v + '"' );
			}else if(/^li_/.test(i)){
				i = i.split('li_')[1];
				if(/\d{2}\/\d{2}\/\d{4}/.test(v)){
					var aV = v.split('/');
					v = aV[2] + '-' + aV[1] + '-' + aV[0];
					aFiltros.push( i + ' >= "' + v + '"' );
				}else{
					if(typeof eval(v) === 'number'){
						aFiltros.push( i + ' >= ' + v );
					}else{
						aFiltros.push( i + ' >= "' + v + '"' );
					}
				}
			}else if(/^ls_/.test(i)){
				i = i.split('ls_')[1];
				if(/\d{2}\/\d{2}\/\d{4}/.test(v)){
					var aV = v.split('/');
					v = aV[2] + '-' + aV[1] + '-' + aV[0];
					aFiltros.push( i + ' <= "' + v + '"' );
				}else{
					if(typeof eval(v) === 'number'){
						aFiltros.push( i + ' <= ' + v );
					}else{
						aFiltros.push( i + ' <= "' + v + '"' );
					}
				}
			}
		});
		var strFiltros = aFiltros.join(' AND ');
		return strFiltros;
	},
	/**
	* Consulta los registros de la BD y llena la tabla dinámica
	* @param {String} nombre_grid
	* @param {json} filtro_json
	*/
	cargaInformacion : function( nombre_grid, filtro_json_to_post ){
		//showLoadingOverlay();
		var llena_grid = function( respuesta ){
			var aRegistros = respuesta.data;
    		if( aRegistros.length > 0 ){
	            $( "#"+nombre_grid ).dataTable().fnClearTable();
	            $( "#"+nombre_grid ).dataTable().fnAddData( aRegistros );
	            var filtro_activo = respuesta.cnd.condiciones;
	            filtro_activo = ( filtro_activo == "Ninguna" ) ? '' : filtro_activo;
	            //filtro_activo = ( filtro_activo.match(/Ninguna|uid/g) ) ? '' : filtro_activo;
	            $( "#text_filtros" ).html( filtro_activo );
	        } else{
	        	$( "#text_filtros" ).html('');
	            $( "#"+nombre_grid ).dataTable().fnClearTable( 0 );
				$( "#"+nombre_grid ).dataTable().fnDraw();
	        }
	        //hideLoadingOverlay();
		};
		/**
		 * Simularé la respuesta de algunos grids
		 */
		if( nombre_grid == "inscripcionPosibilidad" ){
			llena_grid( {
				cnd:{
					condiciones: "grupo igual a OPCIÓN 1"
				},
				data: [
					[ "(11165) (XXX) BORGES KENDY", 5000, 5000, "pagado" ],
					[ "(11162) (XXX) LASFHLSDFH A", 0, 0, "pendiente" ],
					[ "(9297) (XXX) NUÑEZ DIEGO", 3000, 4000, "excedido" ],
					[ "(11687) (XXX) TEST ROBERTO", 13000, 8000, "adeudo" ]
				]
			} );
		}else{
			if(filtro_json_to_post != '{}'){
				filtro_json_to_post = grid.get_filters_format(filtro_json_to_post);
			}
			oGenerales.fnConsultaCMD(
				{
					cmd: "CMDREPORTES",
					nombre_reporte: nombre_grid,
					tipo_reporte:"S",
					filtro_json: filtro_json_to_post
				}, llena_grid );
		}
	}
}
/**
* Inicia la descarga de un reporte en el formato deseado
* @param {String} id_repo
* @param {String} tipo_dwl
*/
function descarga_archivo( id_repo, tipo_dwl ){
	var espacio = $("#espacio");
	var filtro_json = JSON.stringify( $("#form_filtros").serializeObject() );
    espacio.append("<form action='/process.php' id='dwlAcuse' method='POST'><input type='hidden' value='"+filtro_json+"' name='filtro_json' /><input type='hidden' value='"+id_repo+"' name='nombre_reporte' /><input type='hidden' value='"+tipo_dwl+"' name='tipo_reporte' /><input type='hidden' value='CMDREPORTES' name='cmd' /></form>");
    $("#dwlAcuse").submit();
    $("#dwlAcuse").remove();
}