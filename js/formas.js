/**
 * Generación de formularios a partir de un archivo .json
 * Las formas pueden contener campos requeridos y validadores para tipos de datos especiales
 *
 * @summary   Generación de formularios
 *
 * @requires jquery-2.2.4.min.js
 * @requires bootstrap-datepicker.js
 * @requires validation-min.js
 * @requires jquery.form.js
 * @requires bootstrap-multiselect.js
 * @requires bootstrap-switch.min.js
 * @jquery.masked-input.js
 * @jquery.inputmask.js
 * @jquery.inputmask.numeric.extensions.js
 * @parsley.min.js
 * @select2.min.js
*/
var forma = {
	/**
	* Consulta un archivo .json y la respuesta la manda a procesar a la función que genera el <form/>
	* @param {String} n_json
	* @param {<div/>} espacio
	*/
	consulta_json : function( nombre, espacio, data ){
		var data_send = ( typeof data !== "undefined" ) ? data : {};
		//var url_send = 'accion/forma';
		var url_send = 'json/'+nombre+'.json';
		$.ajax({ // Realiza la petición del archivo .json
			url : url_send, // URL donde se encuentra el archivo en cuestión
			dataType : 'json', // La respuesta se recibirá en formato JSON
			cache : false, // No guarda información en el caché
			type : 'POST',
			//data : data_send,
			success : function( resp ){ // Función que procesará la respuesta (JSON)
				forma.crear( resp, espacio );
			}
		});
	},
	/**
	* Configura el formulario y lo pinta en el "espacio" indicado
	* @param {json} resp
	* @param {<div/>} espacio
	* @return {<form/>} Formulario generado
	*/
	crear : function( resp, espacio ){
		var forma = resp.forma;
		var elementos = resp.elementos;
		var titulo = ( espacio.attr( 'id' ) == "espacio" ) ? $( "#titulo" ) : $( "#title_popup" );
		espacio.html('');
		var ancho = '100%';
		var widget = $( '<div class="card" style="width: ' + ancho + ';" />' );
		if( espacio.attr('id') == "espacio" ){
			widget.append('<div class="card-header"><i class="fa fa-edit"></i> '+forma.tituloformulario+'</div>');
		} else{
			$( "#title_popup" ).html( forma.tituloformulario );
		}

		var widget_content = $( '<div class="card-block collapse in" />' );
		var card_bottom = $('<div class="card-footer" />');

		var enctype = '';
		if( typeof forma.uploadFile !== "undefined" ){
			enctype = 'enctype="multipart/form-data"';
		}

		var form = $( '<form class="form-horizontal" method="POST" action="process.php" role="form" id="form' + forma.clave + '" parsley-validate novalidate '+enctype+'/>' );
		/**
		* Empiezo con la generación de los elementos
		*/
		var a_elementos = resp.elementos; // Array que contiene los elementos que contendrá el <form/>
		//var reglas = {};
		var requeridos = {}; // JSON con los elementos que son requeridos al llenar el <form/>
		var mensajes_requeridos = {}; // JSON de strings que se mostrarán si un requerido aún está sin valor
		var clones_default = { "email": [], "movil": [], "fijo": [], "domicilio": [] }; // JSON contendrá los elementos como defaultvalue que se debe agregar
		/**
		* @var {array} sin_metatipo
		* Para los que están aquí solo se valida que sean requeridos pero no tienen validación especial (sin metatipo)
		*/
		var sin_metatipo = ["text","select","option","option_end","date","datetime","sololetras","textarea","solonumeros","radio_group","radio","radio_end","password","telefono_fijo","telefono_movil","file","moneda", "pin", "preview", "colorpicker","selectZona"];
		/**
		* Crea un "renglón" <fieldset/> con sus configuraciones y lo devuelve para que éste sea agregado al <form/>
		* Generará con etiquetas y campo
		* @param {String} etiqueta
		* @param {String} sub_etiqueta
		* @param {String} id_fs
		* @param {String} nm_campo
		* @param {<input/>} elemento
		* @return {<fieldset/>} fieldset
		*/
		var add_elemento = function( etiqueta, sub_etiqueta, id_fs, nm_campo, elemento, icon ){
			var form_group = $( '<div class="form-group row" id="fieldset_' + id_fs + '"/>' );
			var label = $( '<label for="' + nm_campo + '" class="col-md-3 form-control-label">' + etiqueta + '</label>' );
			var col_input = $( '<div class="col-md-9"/>' );
			var input_group = $( '<div class="input-group"/>' );
			icon = ( typeof icon != "undefined" ) ? icon : 'edit';
			var span_i = icon=='sinIco'?'':$('<span class="input-group-addon"><i class="fa fa-'+icon+'"></i></span>');
			input_group.append( span_i );
			input_group.append( elemento );
			form_group.append( label );
			col_input.append( input_group );
			form_group.append( col_input );
			return form_group;
		};
		/**
		* Recorro el array de elementos que compondrán el <form/>
		* Cada uno tendrá su configuración correspondiente
		*/
		for( var i=0; i<a_elementos.length; i++ ){
			var e = a_elementos[ i ];
			var dfv = ( e.defaultvalue == null ) ? '' : e.defaultvalue; // {String} Contendrá el defaultvalue si éste es establecido desde la maqueta
			var plh = ''; // {String} con el placeholder si éste es definido en la maqueta
			if( typeof dfv === "string" ){
				if(dfv.match(/__/g)){
					plh = dfv.split( '__' )[1];
					dfv = '';
				}
			}

			var mxl = ( e.maxlength !== 0 && e.maxlength !== "0" ) ? 'maxlength="'+e.maxlength+'"' : ''; // {String} Cantidad de caracteres admitidos en el campo
			var rdo = ''; // {String} Si el elemento es de solo lectura
			if( e.rdonly === "T" ){
				rdo = ( e.tipo.match( /select|radio|radio_end/g ) ) ? 'disabled' : 'readonly';
				if(e.tipo == 'text')
					rdo = 'readonly disabled';
			}
			var a_sbt = e.label.split( '\\n' );// {String} sub-etiqueta
			var sbt = ( typeof a_sbt[1] !== "undefined" ) ? a_sbt[1] : '';
			var btn_add = false; // {bool} true si se podrá agregar más de un registro similar, false si es único
			// ======= NUEVA FUNCIONALIDAD : Agregará un botón que permite agregar más de un campo parecido
			if( typeof e.multiple !== "undefined" ){
				btn_add = ( e.multiple == "T" ) ? true : false;
			}
			// =========================================================
			/**
			* Si desde la maqueta, se define que el campo es requerido e.required=="T"
			* se configuran los campos con sus mensajes en caso de no llevar valor al submit
			*/
			if( e.required === "T" ){
				var name_req = ( btn_add ) ? e.name + '[]' : e.name;
				if( sin_metatipo.indexOf( e.tipo ) == -1 ){
					requeridos[ name_req ] = {};
	                mensajes_requeridos[ name_req ] = {};
	                requeridos[ name_req ][ 'required' ] = true;
	                requeridos[ name_req ][ e.tipo ] = true;
	                mensajes_requeridos[ name_req ][ 'required' ] = e.message;
				} else {
					/*if( e.tipo == "file" ){
						requeridos[ name_req ] = { accept: "png", required: (e.required=="T"?true:false) };
						mensajes_requeridos[ name_req ] = e.message;
					} else {*/
						requeridos[ name_req ] = "required";
						mensajes_requeridos[ name_req ] = e.message;
					//}
				}
			}
			/**
			* switch para analizar el "tipo" de campo y agregar sus configuraciones únicas
			* En caso de no tener algún "metatipo" o validación definida, el elemento será creado de tipo "text"
			*/
			switch( e.tipo ){
				case 'select': // Inicia la configuración para agregar un campo tipo <select/>
					var sel_lbl = e.label;
					var sel_slb = sbt;
					var sel_id = e.id;
					var sel_name = e.name;
					var sel_dfval = e.defaultvalue;
					var onChangeSelect = '';
					if ( oGenerales.sTipoUser != "Admin" ) {
						e.filtro = ( e.id=="idcentros" ) ? "onChange__fnGetPacientes" : e.filtro;
					}
					if( oGenerales.sTipoUser == "Admin" ){
						e.filtro = ( e.id=="idcentros" && forma.clave=="calendario" ) ? "onChange__fnGetGestoresPacientes" : e.filtro;
					}
					if( e.filtro.match(/onChange/g) ){
						var aFiltro = e.filtro.split('__');
						onChangeSelect = 'onchange="'+aFiltro[1]+'(this);"';
					}
					var select = $( '<select id="'+sel_id+'" name="'+sel_name+'" class="__select form-control" '+onChangeSelect+' '+rdo+'/>' );
					break;
				case "option": // Agrega las opciones al <select/> definido en el tipo "select"
					var selected = ( e.filtro === "selected" ) ? 'selected' : '';
					select.append( '<option value="' + e.name + '" ' + selected + '>' + dfv + '</option>' );
					break;
				case "option_end": // Agrega la última opción y cierra el <select/>
					var selected = ( e.filtro === "selected" ) ? 'selected' : '';
					select.append( '<option value="' + e.name + '" ' + selected + '>' + dfv + '</option>' );
					/**
					* Selector dinámico, cargará el json de respuesta de la petición al <select/> formado
					* @summary Selector de remitentes
					* @param {json} a_estatus
					*/
					var fnLlenaSelect = function( aResp ){
						//console.log(aResp);
						var sOptions = '<option value="">Seleccione una opción</option>';
						var aCatalogo = aResp.catalogo;
						for( var c=0; c<aCatalogo.length; c++ ){
							var oOpcion = aCatalogo[c];
							var sSelected = ( sel_dfval == oOpcion.id ) ? 'selected': '';
							sOptions += '<option value="' + oOpcion.id + '" '+sSelected+'>' + oOpcion.campo + '</option>';
						}
						select.html(sOptions);
						//hideLoadingOverlay();
					};
					if ( oGenerales.sTipoUser != "Admin" ) {
						e.filtro = ( e.filtro=="centros" ) ? "CMDRECCMBOCENTROSPORCAL" : e.filtro;
						e.filtro = ( e.filtro=="pacientes" ) ? "" : e.filtro;
						e.filtro = ( e.filtro=="empleados" ) ? "" : e.filtro;
					}

					if( forma.clave == "calendario" && (sel_id == "idempleados" || sel_id == "idpacientes") && sel_dfval != ""  ){

						oGenerales.fnConsultaCMD( { cmd: (sel_id=="idempleados"?"CMDRECGESTORESPORIDCENTRO":"CMDRECCMBOCLIENTES"), idcentros: form.find("#idcentros").val() }, fnLlenaSelect, false );

					}

					if( forma.clave == "usuarios" && sel_id == "idempleados" && sel_dfval != "" ){
						var rol = form.find("#idroles").val();
						var oTablasPorRol = { "2": "empleados", "3": "gestores", "4": "tecnicas", "6": "empleados" };
						oGenerales.fnConsultaCMD( { cmd: "CMDRECCATALOGO", tabla: oTablasPorRol[ rol ] }, fnLlenaSelect, false );
					}

					if( e.filtro !== "" && e.filtro !== "F" ){
						if( e.filtro == "CMDRECCENTRONOASIGNADO" || e.filtro == "CMDRECTECNICANOASIGNADO" || e.filtro == "CMDRECCMBOCENTROSPORCAL" )
							oGenerales.fnConsultaCMD( { cmd: e.filtro }, fnLlenaSelect, false );
						else
							oGenerales.fnConsultaCMD( { cmd: "CMDRECCATALOGO", tabla: e.filtro }, fnLlenaSelect, false );
					}

					if( (oGenerales.sTipoUser=="Centros" || oGenerales.sTipoUser=="Admin Centro") && forma.clave=="calendario" && sel_id == "idpacientes" ){
						oGenerales.fnConsultaCMD( { cmd: "CMDRECCMBOCLIENTES", idcentros: oGenerales.sIdCentro }, fnLlenaSelect, false );
					}

					if( oGenerales.sTipoUser != "Admin" && (sel_id=="idempleados"||sel_id=="idgestores") ){
						form.append('');
					}else if( (oGenerales.sTipoUser=="Centros" || oGenerales.sTipoUser=="Admin Centro") && (forma.clave=="pacientes"||forma.clave=="calendario"&&sel_id=="idcentros") ){
						form.append('');
					} else{
						form.append( add_elemento( sel_lbl, sel_slb, sel_id, sel_name, select, 'sinIco' ) );
					}
					break;
				case "selectZona":
					oGenerales.fnConsultaCMD( { cmd: "CMDRECCATALOGO", tabla: "zonas" }, function( aResp ){
						var groupSelect = $( '<select id="'+e.id+'" name="'+e.name+'" class="__select form-control" '+rdo+' onchange="fnSelZona(this);" style="width:100%;" placeholder="Una o más zonas" multiple/>' );
						groupSelect.append('<option value="">Selecciona una zona</option>');
						var aGrupos = aResp.catalogo.grupos;
						for( var iGrupo=0; iGrupo<aGrupos.length; iGrupo++ ){
							var oGrupo = aGrupos[ iGrupo ];
							var optGroup = $('<optgroup label="'+oGrupo.nombre+'">');
							for( var iZona=0; iZona<oGrupo.zonas.length; iZona++ ){
								var oZona = oGrupo.zonas[iZona];
								var sSelected = ( e.defaultvalue == oZona.idzona ) ? 'selected' : '';
								optGroup.append('<option value="'+oZona.idzona+'" data-tiempoduracion="'+oZona.duracion+'" '+sSelected+'>'+oZona.nombre+'</option>');
							}
							groupSelect.append(optGroup);
						}
						form.append( add_elemento( e.label, sbt, e.id, e.name, groupSelect, 'sinIco' ) );
					}, false );
					break;
				case "text": // Configura un campo de tipo text o password, cuentan con las mismas configuraciones
				case "password":// solo cambia el tipo de campo
					// ---- Inicia falta agregar al server ----------
					var text = $( '<input id="'+e.id+'" class="form-control parsley-validated" type="'+e.tipo+'" name="'+e.name+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+' />' );
					if( e.filtro.match(/equalto/g) ){
						var id_eq = e.filtro.split( '_' );
						console.log(id_eq[1]);
						requeridos[ e.name ] = {
			        		required: true,
			        		equalTo: "#"+id_eq[ 1 ]
			        	};
			        	mensajes_requeridos[ e.name ] = {
			        		required: e.message,
			            	equalTo: "Las contraseñas no coinciden"
			        	};
					}
					// -------- termina falta agregar al server --------------
					form.append( add_elemento( e.label, sbt, e.id, e.name, text, (e.tipo=="password"?'lock':'edit') ) );
					break;
				case "radio_group": // Configura un grupo de botones tipo "radiobutton"
					var radio_group = $( '<div class="col-md-9 row"/>' );
					var rad_lbl = e.label;
					var rad_slb = sbt;
					var rad_id = e.id;
					var rad_name = e.name;
					break;
				case "radio": // Agrega un campo <input type="radiobutton"/> al grupo de "radio_group"
					var checked = ( e.filtro === "selected" ) ? 'checked' : '';
					radio_group.append('<div class="radio col-md-6"><label for="'+e.id+'"><input id="'+e.id+'" type="radio" name="' + e.name + '" value="' + e.id + '" '+checked+' '+rdo+'> '+e.defaultvalue+'</label></div>');
					break;
				case "radio_end": // Agrega el último radiobutton y cierra el grupo donde se estaban añadiendo
					var checked = ( e.filtro === "selected" ) ? 'checked' : '';
					radio_group.append('<div class="radio col-md-6"><label for="'+e.id+'"><input id="'+e.id+'" type="radio" name="' + e.name + '" value="' + e.id + '" '+checked+' '+rdo+'> '+e.defaultvalue+'</label></div>');
					form.append( add_elemento( rad_lbl, rad_slb, rad_id, rad_name, radio_group, 'sinIco' ) );
					radio_group.parent().css('width', '100%');
					break;
				case "check_group": // Configura un grupo de botones tipo "radiobutton"
					var check_group = $( '<div class="col-md-9"/>' );
					var chk_lbl = e.label;
					var chk_slb = sbt;
					var chk_id = e.id;
					var chk_name = e.name;
					break;
				case "check": // Agrega un campo <input type="radiobutton"/> al grupo de "radio_group"
					var checked = ( e.filtro === "selected" ) ? 'checked' : '';
					check_group.append('<div class="checkbox"><label for="'+e.id+'"><input id="'+e.id+'" type="checkbox" name="'+e.name+'" value="'+e.id+'" '+checked+' '+rdo+'>'+e.defaultvalue+'</label></div>');
					break;
				case "check_end": // Agrega el último radiobutton y cierra el grupo donde se estaban añadiendo
					var checked = ( e.filtro === "selected" ) ? 'checked' : '';
					check_group.append('<div class="checkbox"><label for="'+e.id+'"><input id="'+e.id+'" type="checkbox" name="'+e.name+'" value="'+e.id+'" '+checked+' '+rdo+'>'+e.defaultvalue+'</label></div>');
					form.append( add_elemento( chk_lbl, chk_slb, chk_id, chk_name, check_group, 'sinIco' ) );
					check_group.parent().css('width', '100%');
					break;
				case "telefono_fijo":
				case "telefono_movil": // Agrega campo con la máscara (999) 999-9999 para números móviles
					var btn_disabled = ( rdo !== '' ) ? 'disabled' : '';
					var btn_mas = ( btn_add ) ? '<button class="btn btn-default" type="button" onclick="add_clon(\''+e.id+'\')" '+btn_disabled+'><i class="fa fa-plus-square"></i></button>' : '';
					var nom_add = ( btn_add ) ? e.name + '[]' : e.name;
					var tel = $( '<input id="'+e.id+'" class="telefono form-control parsley-validated" type="telefono" name="'+nom_add+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+' />' );
					tel.mask('999-999-999');
					form.append( add_elemento( e.label, sbt, e.id, e.name, tel, 'phone' ) );
					tel.after( btn_mas );
					break;
				case "email": // Agrega campo de tipo email, el texto debe cumplir con la característica micorreo@localhost.com
					var btn_disabled = ( rdo !== '' ) ? 'disabled' : '';
					var btn_mas = ( btn_add ) ? '<button class="btn btn-default" type="button" onclick="add_clon(\''+e.id+'\')" '+btn_disabled+'><i class="fa fa-plus-square"></i></button>' : '';
					var email = $( '<input type="email" parsley-type="email" data-parsley-trigger="change" class="form-control parsley-validated" name="'+e.name+'" id="'+e.id+'" '+rdo+' value="' + dfv + '">' );
					form.append( add_elemento( e.label, sbt, e.id, e.name, email, 'envelope-o' ) );
					break;
				case "date": // Agrega campo de tipo fecha, al recibir el focus, muestra date-picker para seleccionar una fecha específica
					var confDate = {
						format: 'dd/mm/yyyy',
						//daysOfWeekDisabled: [0,6], ------------------> Deshabilita el Sábado y Domingo
					}
					var withDefault = false;
					if( dfv !== "" ){
						withDefault = true;
						var toDefault = new Date(dfv.replace(/-/g, '/'));
						dfv = moment(dfv).format('DD-MM-YYYY HH:mm');
					}
					var defDate = (e.filtro=="hoy") ? "date_hoy" : "";
					var date = $( '<input id="'+e.id+'" class="form-control date_picker parsley-validated '+defDate+'" type="text" name="'+e.name+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+'/>' );
					form.append( add_elemento( e.label, sbt, e.id, e.name, date, 'calendar' ) );
					date.datepicker(confDate).on('changeDate', function(ev){
					    $(this).datepicker('hide');
					});
					if (withDefault){
						date.datepicker('setDate', toDefault);
					}
					break;
				case "datetime":
					if( dfv !== "" )
						dfv = moment(dfv).format('DD-MM-YYYY HH:mm');
					var datetime = $( '<input id="'+e.id+'" class="form-control parsley-validated" type="text" name="'+e.name+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+'/>' );
					form.append( add_elemento( e.label, sbt, e.id, e.name, datetime, 'calendar' ) );
					datetime.daterangepicker({
				        singleDatePicker: true,
				        showDropdowns: true,
				        timePicker: true,
				        timePicker24Hour: true,
				        disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23, 24],
				        enabledHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
				        locale: {
                            format: 'DD-MM-YYYY HH:mm'
                        }
				    });
				    if( e.id == "cdcalendarioinicial" ){
				    	datetime.on('apply.daterangepicker', function(ev, picker) {
							if( $("#idzona").val() != "" ){
								var sIdZona = $("#idzona").val();
								var duracion = $("#idzona").find("option:selected").data("tiempoduracion");
								$("#cdcalendariofinal").val( moment(picker.startDate).add(parseInt(duracion), 'm').format('DD-MM-YYYY HH:mm') );
							}
						});
				    }
					break;
				case "hidden": // Agrega campos ocultos
					var hidden = $( '<input type="hidden" class="form-control parsley-validated" name="'+e.name+'" id="'+e.id+'" value="'+dfv+'" '+mxl+' '+rdo+' />' );
					form.append( hidden );
					break;
				case "button":
				case "buttonDwl":
				case "submit": // Agrega el área de botones con el botón para [Enviar la información del formulario]
					var btnSubmit = $(
						'<button id="'+e.id+'" type="'+(e.tipo=="submit"?"submit":"button")+'" class="btn '+((e.tipo=="submit")?"btn-primary":"btn-success")+'">'+
							((e.tipo=='buttonDwl')?'<i class="fa fa-download"></i>':'')+
							dfv+
						'</button>'
					);
					btnSubmit.click(function(){
						form.submit();
					});
					card_bottom.append( btnSubmit );
					break;
				case "moneda": // Agrega un campo de tipo moneda, acepta solo números y decimales, les agrega formato 9,999.99
					var moneda = $( '<input id="'+e.id+'" class="form-control parsley-validated" type="'+e.tipo+'" name="'+e.name+'__moneda" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+' style="text-align: right;"/>' );
					moneda.inputmask( 'decimal', {
                        radixPoint: '.',
                        digits: 2,
                        repeat: 20,
                        autoGroup: true,
                        groupSeparator: ',',
                        groupSize: 3,
                        rightAlign: false
                    } );
					form.append( add_elemento( e.label, sbt, e.id, e.name, moneda, 'usd' ) );
					break;
				case "direccion": // Agrega todos los elementos que componen un domicilio completo (calle, colonia, número interior, exterior, etc...)
					var btn_mas = ( btn_add ) ? '<button class="btn btn-default" type="button" onclick="add_clon_array(\''+e.id+'\')"><i class="fa fa-plus-square"></i></button>' : '';
					var nom_add = ( btn_add ) ? e.name + '__array' : e.name;
					var ar_dir = ( dfv.length > 0 ) ? dfv[0].split( '|' ) : dfv;
					var dfv_calle = ( dfv.length > 0 ) ? ar_dir[0] : "";
					var df_next = ( dfv.length > 0 ) ? ar_dir[1] : "";
					var df_nint = ( dfv.length > 0 ) ? ar_dir[2] : "";
					var df_colonia = ( dfv.length > 0 ) ? ar_dir[3] : "";
					var df_cp = ( dfv.length > 0 ) ? ar_dir[4] : "";
					var df_municipio = ( dfv.length > 0 ) ? ar_dir[5] : "";
					var df_estado = ( dfv.length > 0 ) ? ar_dir[6] : "";
					var df_referencias = ( dfv.length > 0 ) ? ar_dir[7] : "";
					var df_descripcion = ( dfv.length > 0 ) ? ar_dir[8] : "";
					df_descripcion = ( df_descripcion ) ? df_descripcion : '';
					var direccion = $('<div id="input-group-appendable4" class="input-group input-group-appendable"><input type="text" class="form-control parsley-validated" placeholder="Calle" value="'+dfv_calle+'" style="width: 15em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Núm. Ext." value="'+df_next+'" style="width: 6em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Núm. Int." value="'+df_nint+'" style="width: 6em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Colonia" value="'+df_colonia+'" style="width: 15em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" style="width: 9em ! important;" value="'+df_cp+'" placeholder="Código Postal" class="form-control parsley-validated" onkeypress="return only_num(event)" maxlength="5" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Municipio" value="'+df_municipio+'" style="width: 15em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Estado" value="'+df_estado+'" style="width: 15em ! important;" '+rdo+'>&nbsp;'+
						'<input type="text" class="form-control parsley-validated" placeholder="Referencias" value="'+df_referencias+'" style="width: 40em ! important;" '+rdo+'>'+btn_mas + '</div>');
					form.append( add_elemento( e.label, sbt, e.id, e.name, direccion ) );
					var clearfix = direccion.parent();
					clearfix.addClass( 'domicilio' );
					var fieldset = clearfix.parent();
					var span = fieldset.find( 'label>span' );
					var dis_select = ( rdo === "readonly" ) ? 'disabled' : '';
					var select_desc = $( '<select class="" '+dis_select+'><option value="casa">Domicilio Particular</option><option value="trabajo">Trabajo</option><option value="otro">Otro</option></select>' );
					select_desc.find( 'option' ).each(function(){
						if( df_descripcion == $(this).val() ){
							$(this).attr('selected', true);
						}
					});

					span.html( select_desc );
					for( var cl=1; cl<dfv.length; cl++ ){
						clones_default.domicilio.push( { name : e.id, defaultvalue : dfv[ cl ], tipo: 'domicilio' });
					}
					break;
				case "solonumeros": // Agrega campo que permite entrada solo números, sin texto ni caracteres especiales
					var solonumeros = $( '<input id="'+e.id+'" class="form-control parsley-validated" type="'+e.tipo+'" name="'+e.name+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+' />' );
					form.append( add_elemento( e.label, sbt, e.id, e.name, solonumeros ) );
					break;
				case "file":
					if(typeof e.aceptar != "undefined" && e.aceptar == "excel"){
						var inputFile = $( '<input id="'+e.id+'" type="'+e.tipo+'" name="'+e.name+'" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>' );
					}else{
						var inputFile = $( '<input id="'+e.id+'" type="'+e.tipo+'" name="'+e.name+'" accept="image/*"/>' );
					}
					form.append( add_elemento( e.label, sbt, e.id, e.name, inputFile, 'sinIco' ) );
					requeridos[ e.name ] = { accept: "png|jpg|gif|xls|xlsx", required: (e.required=="T"?true:false) };
					mensajes_requeridos[ name_req ] = e.message;
					break;
				case "colorpicker":
					form.append('<div class="form-group row" id="fieldset_'+e.id+'">'+
									'<label for="'+e.id+'" class="col-md-3 form-control-label">'+e.label+'</label>'+
									'<div class="col-md-9">'+
										'<div class="input-group">'+
											'<div class="__colorpicker input-group colorpicker-component">'+
												'<input id="'+e.id+'" class="form-control parsley-validated" type="text" name="'+e.name+'" value="'+dfv+'" readonly="true" style="background-color:transparent !important;" />'+
												'<span class="input-group-addon"><i></i></span>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>');
					break;
				default: // Si el campo no cuenta con tipo específico se crea en formato de texto
					var metatipos_a_mayus = [ 'rfc', 'curp', 'nombre', 'ine' ]; // El texto introducido será convertido a mayus
					var a_mayus = ( metatipos_a_mayus.indexOf( e.tipo ) !== -1 ) ? 'style="text-transform: uppercase;" onChange="to_mayus(this);"' : '';
					var def = $( '<input id="'+e.id+'" class="form-control parsley-validated" type="'+e.tipo+'" name="'+e.name+'" placeholder="'+plh+'" value="'+dfv+'" '+mxl+' '+rdo+' '+a_mayus+'/>' );
					form.append( add_elemento( e.label, sbt, e.id, e.name, def ) );
					break;
			}
		}// Termina el recorrido de los elementos
		widget_content.append( form );
		widget.append( widget_content );
		widget.append( card_bottom );
		espacio.html( widget );
		$( '.__select' ).select2({
			width: null,
			containerCssClass: ':all:'
		});
		$( '.switch-demo' ).bootstrapSwitch();
		$( '.telefono' ).mask('999-999-999');

		//$( '.__colorpicker' ).colorpicker();
		form.validate({ // Hace las validaciones de los campos que se definieron como requeridos antes de enviar la información
            ignore: ':hidden:not(".__select")',
            rules: requeridos,
            messages: mensajes_requeridos,
            errorPlacement: function(error, element) {
	        	if(element.attr('type')=="radio"){
	        		error.insertAfter(element.parent().parent().parent());
	        	}else{
	        		error.insertAfter(element.parent());
	        	}
	        }
        });

  //       if(oGenerales.sTipoUser=="Gestores"){
		// 	fnSelCentroid(resp.idempleadosfrm);
		// }

        var formConfirm = null;
        form.ajaxForm({ // Envío la información en el <form/> al servidor
        	dataType : 'json',
        	beforeSubmit : function( formData, jqForm, options ){ // Configuro la información antes de enviarla
        		showLoadingOverlay();
        		/*$( "input:disabled" ).each(function(){
        			formData.push({
        				name: $(this).attr("name"),
        				required: false,
        				type: "text",
        				value: $(this).val()
        			});
        		});*/
        		if (forma.clave == "uploadxls" || forma.clave == 'uploadtickets'){
        			$("#bombas").html('');
        			$("#clientes").html('');
        			$("#tickets").html('');
        			$("#saveInfo").remove();
        		}
        		for(var conta = 0; conta<formData.length; conta++){
        			if( /__moneda$/g.test( formData[conta].name ) ){
        				formData[conta]['value'] = parseFloat( formData[conta].value.replace(/,/g,"") );
        				//formData[conta]['name'] = formData[conta].name.replace('__moneda', '');
        			}
        			if( /\w\./g.test( formData[conta].name ) ){
        				formData[conta]['name'] = formData[conta].name.split('.')[1];
        			}
        			if( /\d+\/\d+\/\d+/g.test( formData[conta].value ) ){
        				var arValue = formData[conta].value.split('/');
        				formData[conta]['value'] = arValue[2] +'-'+ arValue[1] +'-'+ arValue[0];
        			}
        		}
        	},
        	success : function( resp ){ // Manejo la respuesta del servidor una vez procesados los datos enviados
        		if( typeof resp.error !== "undefined" ){
        			oGenerales.fnNotificacion( 'error', 'Error', resp.error );
        		}else if(typeof resp.msg !== "undefined"){
        			var titulo_msg = ( resp.msg == "Error" ) ? 'Error' : 'Información cargada exitosamente';
				    var tipo_msg = ( resp.msg == "Error" ) ? 'error' : '';
	        		oGenerales.fnNotificacion( tipo_msg, titulo_msg, resp.msg );
        		}
				if( typeof resp.msg !== "undefined" && resp.msg !== "" ){
					form[0].reset();
					if( espacio.attr('id') != "espacio" ){
						$('#dialog-form').modal( 'hide' );
						grid.cargaInformacion( forma.clave.replace('formEdit', ''), '{}' );
					}
				}
				if( $('input[name="cmd"]').val() == "CMDCARGAXLS" ){
					// Agrego la fecha obtenida
					$("#dateDocto").html( resp['full_date'] );
					var info_to_save = {'bombas': {}, 'clientes': {}};
					// Agrego la información de las Bombas
                    jQuery.each( resp['totales'], function(bomba, val){
                        row = $('<p class="data-row">'+
                            '<span class="data-name">'+bomba+'</span>'+
                            '<span class="data-value">'+renderers.to_pesos(val)+'</span>'+
                        +'</p>');
                        $("#bombas").append( row );
                    } );
                    info_to_save['bombas'] = resp['totales'];
                    info_to_save['full_date'] = resp['full_date'];
                    // Agrego la información de los Clientes
                    clientes = oGenerales.fnGetInfoFromCMD({cmd: 'GETCLIENTES'});
                    console.log( 'Clientes desde la BD '+JSON.stringify(clientes) );
                    var oClientes = {};
                    $.each( clientes, function(nomc, idc){
                    	oClientes[ idc ] = nomc;
                    } );
                    var aClientesSelected = [];
                    txtsClientes = oGenerales.fnGetInfoFromCMD({cmd: 'GETTEXT4CLIENT'});
                    console.log(txtsClientes);
                    jQuery.each( resp['clientes'], function(cliente, val){
                        if(typeof clientes[cliente] == "undefined" ){
                            console.error("No se encontro el cliente "+cliente);
                            clienteLower = cliente.toLowerCase().replace(/ /g, '_');
                            if(typeof txtsClientes[clienteLower] != "undefined"){
                            	row = $('<p class="data-row">'+
	                                '<span class="data-name">'+cliente+' <i>['+oClientes[txtsClientes[ clienteLower ]]+']</i></span>'+
	                                '<span class="data-value clientsAccepted" data-valuecliente="'+val+'" data-idclieteselected="'+(txtsClientes[ clienteLower ])+'">'+renderers.to_pesos(val)+'</span>'+
	                            +'</p>');
	                            aClientesSelected.push( txtsClientes[ clienteLower ] );
                            }else{
                            	row = $('<p class="data-row text-danger">'+
	                                '<span class="data-name"><nombrecliente>'+cliente+'</nombrecliente><code>Este cliente no se encuentra en la Base de Datos</code></span>'+
	                                '<a href="#" data-textocliente="'+cliente+'" data-valuecliente="'+val+'" data-type="select2" class="editInLine">Seleccionar</a>'+
	                                '<span class="data-value">'+renderers.to_pesos(val)+'</span>'+
	                            +'</p>');
                            }
                        } else {
                            //info_to_save['clientes'][ clientes[ cliente ] ] = val;
                            row = $('<p class="data-row">'+
                                '<span class="data-name">'+cliente+'</span>'+
                                '<span class="data-value clientsAccepted" data-valuecliente="'+val+'" data-idclieteselected="'+(clientes[ cliente ])+'">'+renderers.to_pesos(val)+'</span>'+
                            +'</p>');
                            aClientesSelected.push( clientes[ cliente ] );
                        }
                        $("#clientes").append( row );
                    } );

                    //*******************************************
					/*	Seleccionar Cliente inline
					/********************************************/                    
					var aClientes = [];
                    $.each( clientes, function(nomc, idc){
                    	if( ! aClientesSelected.includes( idc ) ){
                    		aClientes.push({ value: idc, text: nomc });
                    	}
                    } );
                    $('.editInLine').editable({
						source: aClientes,
						url: 'process.php',
						send: 'always',
						params: function(params) {
							var newParams = {};
						    newParams.cmd = "CMDADDTEXT4CLIENT";
						    newParams.textCliente = $(this).data('textocliente').toLowerCase().replace(/ /g, '_');
						    newParams.idCliente = params.value;
						    $(this).data('idclieteselected', params.value);
						    return newParams;
						},
						success: function(responseText, newValue) {
							response = JSON.parse(responseText);
						    $(this).parent().find('code').remove();
							if( response.msg == "Ok" ){
								oGenerales.fnNotificacion( '', 'Mensaje', "Texto relacionado correctamente." );
							}else{
								oGenerales.fnNotificacion( 'error', 'Error', "Ocurrió un error" );
								return "Error al actualizar";
							}
						},
						select2: {
							width: 200,
							placeholder: 'Clientes',
							allowClear: true
						}
					});

                    var btnSaveInfo = $('<button type="button" class="btn btn-success" id="saveInfo">Guardar Información</button>');
                    btnSaveInfo.click(function(){
                    	oGenerales.fnAlert({
                    		msg: '<strong>La información será guardada en la Base de Datos, los clientes marcados en rojo no se guardaran</strong>',
                    		fnAccept: function(){
                    			//showLoadingOverlay();
                    			info_to_save[ 'clientes' ] = {}
                    			$(".editInLine").each(function(index){
                    				id_client = $(this).data('idclieteselected');
                    				val_client = $(this).data('valuecliente');
                    				if(typeof id_client != "undefined"){
										info_to_save[ 'clientes' ][ id_client ] = val_client;
                    				}
                    			});
                    			$(".clientsAccepted").each(function(index){
                    				id_client = $(this).data('idclieteselected');
                    				val_client = $(this).data('valuecliente');
                    				if(typeof id_client != "undefined"){
										info_to_save[ 'clientes' ][ id_client ] = val_client;
                    				}
                    			});
								console.log(info_to_save);
		                    	oGenerales.fnConsultaCMD({'cmd': 'CMDSAVEINFO', 'info_to_save': JSON.stringify( info_to_save )}, function(data){
		                    		hideLoadingOverlay();
		                            if( /^Error:/.test(data.msg) ){
		                                oGenerales.fnNotificacion('error', 'Error', 'Error al guardar la información');
		                            } else{
		                                oGenerales.fnNotificacion('msg', 'Mensaje', 'Información guardada correctamente');
		                                btnSaveInfo.prop("disabled", true);
		                            }
		                            $("#dialog-confirm").modal('hide');
		                    	}, false);
                    		}
                    	});
                    });
                    $("#profile-tab").append( btnSaveInfo );
				} else if( $('input[name="cmd"]').val() == "CMDUPLOADTICKETS" ){
					clientes = oGenerales.fnGetInfoFromCMD({cmd: 'GETCLIENTES'});
                    console.log( 'Clientes desde la BD '+JSON.stringify(clientes) );
                    var oClientes = {};
                    var aClientesSelected = [];
                    var info_to_save = {'folios': {}}
                    $.each( clientes, function(nomc, idc){
                    	oClientes[ idc ] = nomc;
                    } );
                    txtsClientes = oGenerales.fnGetInfoFromCMD({cmd: 'GETTEXT4CLIENT'});
                    console.log(txtsClientes);
                    var folios = [];
                    for( var i=0; i<resp.length; i++ ){
                    	folios.push( "'"+(resp[ i ][ 'folio' ].toString())+"'" );
                    }
                    folsExists = oGenerales.fnGetInfoFromCMD({cmd: 'GETFOLIOSEXISTS', 'folios': JSON.stringify(folios)});
                    console.log(folsExists);
                    for( var i=0; i<resp.length; i++ ){
                    	var info_ticket = resp[i];
                    	var cliente = info_ticket['cliente'];
                    	var folio = info_ticket['folio'];
                    	var p_folio = $('<p class="toSaveFolio" data-key="folio" data-val="'+folio+'" data-folio="'+folio+'" style="font-weight: bold; background-color: khaki; padding: 5px;">FOLIO: '+folio+' </p>');
                    	if( folsExists['total_folios'].includes(folio.toString()) ){
                    		var info_folio = folsExists['info_folios'][folio];
                    		p_folio.append('<code>Este folio ya fue registrado el '+info_folio['fechaCarga']+'</code>');
                    	}
                    	var row = $('<div></div>');
                    	row.append(p_folio);
                    	if(typeof clientes[cliente] == "undefined" ){
                            console.error("No se encontro el cliente "+cliente);
                            clienteLower = cliente.toLowerCase().replace(/ /g, '_');
                            if(typeof txtsClientes[clienteLower] != "undefined"){
	                            row.append('<p class="data-row">'+
		                                '<span class="data-name">Cliente</span>'+
		                                '<span class="data-value toSaveFolio" data-key="cliente" data-val="'+(txtsClientes[ clienteLower ])+'" data-folio="'+folio+'">'+cliente+' <i>['+oClientes[txtsClientes[ clienteLower ]]+']</i></span>'+
		                            '</p>');
	                            aClientesSelected.push( txtsClientes[ clienteLower ] );
                            }else{
	                            row.append('<p class="data-row">'+
		                                '<span class="data-name">Cliente</span>'+
		                                '<span class="data-value"><nombrecliente>'+cliente+'</nombrecliente><code>Este cliente no se encuentra en la Base de Datos</code></span>'+
		                                '<a href="#" data-key="cliente" data-textocliente="'+cliente+'" data-type="select2" data-folio="'+folio+'" class="editInLine">Seleccionar</a>'+
		                            '</p>');
                            }
                        } else {
                            row.append('<p class="data-row">'+
		                                '<span class="data-name">Cliente</span>'+
		                                '<span class="data-value toSaveFolio" data-key="cliente" data-val="'+clientes[cliente]+'" data-folio="'+folio+'">'+cliente+'</span>'+
		                            '</p>');
                            aClientesSelected.push( clientes[ cliente ] );
                        }
                        if(info_ticket['monto'] == ""){
                        	info_ticket['monto'] = 0;
                        }
                        row.append('<p class="data-row">'+
		                                '<span class="data-name">Fecha de venta</span>'+
		                                '<span class="data-value toSaveFolio" data-key="fecha_de_venta" data-val="'+info_ticket['fecha_de_venta']+'" data-folio="'+folio+'">'+info_ticket['fecha_de_venta']+'</span>'+
		                            '</p>'+
		                            '<p class="data-row">'+
		                                '<span class="data-name">Monto</span>'+
		                                '<span class="data-value toSaveFolio" data-key="monto" data-val="'+info_ticket['monto']+'" data-folio="'+folio+'">'+renderers.to_pesos(info_ticket['monto'])+'</span>'+
		                            '</p>'+
		                            '<p class="data-row">'+
		                                '<span class="data-name">Número de tarjeta</span>'+
		                                '<span class="data-value toSaveFolio" data-key="numero_de_tarjeta" data-val="'+info_ticket['numero_de_tarjeta']+'" data-folio="'+folio+'">'+info_ticket['numero_de_tarjeta']+'</span>'+
		                            '</p>')
                        $("#tickets").append( row );
                    }
                    //*******************************************
					/*	Seleccionar Cliente inline
					/********************************************/                    
					var aClientes = [];
                    $.each( clientes, function(nomc, idc){
                    	if( ! aClientesSelected.includes( idc ) ){
                    		aClientes.push({ value: idc, text: nomc });
                    	}
                    } );
                    $('.editInLine').editable({
						source: aClientes,
						url: 'process.php',
						send: 'always',
						params: function(params) {
							var newParams = {};
						    newParams.cmd = "CMDADDTEXT4CLIENT";
						    newParams.textCliente = $(this).data('textocliente').toLowerCase().replace(/ /g, '_');
						    newParams.idCliente = params.value;
						    $(this).data('val', params.value);
						    return newParams;
						},
						success: function(responseText, newValue) {
							response = JSON.parse(responseText);
						    $(this).parent().find('code').remove();
							if( response.msg == "Ok" ){
								oGenerales.fnNotificacion( '', 'Mensaje', "Texto relacionado correctamente." );
							}else{
								oGenerales.fnNotificacion( 'error', 'Error', "Ocurrió un error" );
								return "Error al actualizar";
							}
						},
						select2: {
							width: 200,
							placeholder: 'Clientes',
							allowClear: true
						}
					});
					var btnSaveInfo = $('<button type="button" class="btn btn-success" id="saveInfo">Guardar Información</button>');
					btnSaveInfo.click(function(){
                    	oGenerales.fnAlert({
                    		msg: '<strong>La información será guardada en la Base de Datos, los clientes marcados en rojo no se guardaran</strong>',
                    		fnAccept: function(){
                    			//showLoadingOverlay();
                    			info_to_save[ 'folios' ] = {}
                    			$(".editInLine").each(function(index){
                    				var id_client = $(this).data('val');
                    				var f = $(this).data('folio');
                    				if( ! folsExists['total_folios'].includes(f.toString()) ){
                    					if(typeof id_client != "undefined"){
											info_to_save[ 'folios' ][f] = {};
	                    				}
	                    				info_to_save['folios'][f][ 'cliente' ] = parseInt(id_client);
                    				}
                    			});
                    			$(".toSaveFolio").each(function(index){
                    				k = $(this).data('key');
                    				v = $(this).data('val');
                    				f = $(this).data('folio');
                    				if( ! folsExists['total_folios'].includes(f.toString()) ){
                    					if(typeof info_to_save['folios'][f] == "undefined"){
											info_to_save['folios'][f] = {};
	                    				}
	                    				info_to_save['folios'][f][k] = v;
                    				}
                    			});
								//console.log(info_to_save);
		                    	oGenerales.fnConsultaCMD({'cmd': 'CMDSAVEINFOTICKETS', 'info_to_save': JSON.stringify( info_to_save )}, function(data){
		                    		hideLoadingOverlay();
		                            if( /^Error:/.test(data.msg) ){
		                                oGenerales.fnNotificacion('error', 'Error', 'Error al guardar la información');
		                            } else{
		                                oGenerales.fnNotificacion('msg', 'Mensaje', 'Información guardada correctamente');
		                                btnSaveInfo.prop("disabled", true);
		                            }
		                            $("#dialog-confirm").modal('hide');
		                    	}, false);
                    		}
                    	});
                    });
					$("#profile-tab").append( btnSaveInfo );
				}
				hideLoadingOverlay();
        	},
        	error : function( ){ // Si ocurre algún error en las comunicaciones con el servidor
        		//dialog_alert( 'Error', 'Intermitencia en las comunicaciones' );
        		oGenerales.fnNotificacion( 'error', 'Error', "Intermitencia en las comunicaciones" );
        		hideLoadingOverlay();
        	}
        });
        //hideLoadingOverlay();
	}
};
/**
 * Función general para descargar archivos (Vouchers y reportes en formato XLS y PDF)
 * @param {string} nombre : Contiene el nombre del archivo a descargar
 * @param {string} filtro : JSON convertido en cadena que contiene los filtros activos
 * @param {string} tipo : Tipo de archivo a descargar, puede ser 'V' (Voucher), XLS, PDF ó CSV
 */
function dwl_file( nombre, filtro, tipo ){
    $( "#espacio" ).append("<form action='accion/generagrid' id='dwlAcuse' method='POST' style='display:none;'>"+
                "<input type='hidden' value='" + filtro + "' id='filtro_json' name='filtro_json' />"+
                "<input type='hidden' value='" + nombre + "' id='nombre' name='nombre' />"+
                "<input type='hidden' value='" + tipo + "' id='tipo' name='tipo' />"+
            "</form>");
    $("#dwlAcuse").submit();
    $("#dwlAcuse").remove();
}

/**
 * Transforma el texto que se introduce a un campo de texto de minúsculas a mayúsculas
 * @param {<input/>} input
 */
function to_mayus(input){
	input.value = input.value.toUpperCase();
}

/**
 * Acepta solo caracteres numÃ©ricos en un campo de texto
 * @param {<input/>} evt
 */
function only_num(evt){
	var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
     var regex = /^[\b0-9\s]$/;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
