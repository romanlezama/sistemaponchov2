$.validator.addMethod("sololetras", function(value, element) {
  return this.optional(element) || /^[\ba-zA-Z\s-áéíóúñÑ]+$/i.test(value);
}, "Debe introducir sólo letras");

$.validator.addMethod("solonumeros", function(value, element) {
  return this.optional(element) || /^[[0-9]+$/i.test(value);
}, "Debe introducir sólo números");

$.validator.addMethod("sololetrasYmayus", function(value, element){
	return this.optional(element) || /^[\ba-zA-Z.,#-\s]+$/i.test(value);
}, "El texto no debe contener tíldes.");

$.validator.addMethod("entero_negypos", function(value, element) {
  return this.optional(element) || /^-?[0-9]+$/.test(value);
}, "Debe introducir sólo números enteros, positivos o negativos");

$.validator.addMethod( "nombre", function( value, element ){
	var bandera = this.optional(element) || /^[0-9A-ZÁÉÍÓÚÑÜ \&\/,.-]*$/i.test(value);
	if( bandera ){
		var patrones = /  |&&|\/\/|--|ÁÁ|ÉÉ|ÍÍ|ÓÓ|ÚÚ|ÑÑ|ÜÜ/g;
		var repetidos = patrones.test( value );
		if( repetidos ){
			$.validator.messages[ "nombre" ] = "El texto es inválido debido a que se han encontrado secuencias de caracteres especiales duplicados";
			return false;
		} else{
			return bandera;
		}
	} else{
		$.validator.messages[ "nombre" ] = "Debe introducir sólo letras (pueden estar acentuadas)";
		return bandera;
	}
}, "Error");

$.validator.addMethod("direccion", function(value, element) {
  return this.optional(element) || /^[a-zA-Zá-úÁ-Ú 0-9#,-.]+$/i.test(value);
}, "Debe introducir sólo letras (pueden estar acentuadas)");


$.validator.addMethod("rfc", function(value, element) {
  return this.optional(element) || /^[A-Z,Ñ,&amp;]{3,4}\d{6}[0-9,A-Z]{3}$/i.test(value);
}, "El RFC debe tener el siguiente formato: AAAA991231BBB");


$.validator.addMethod("rfc_moral", function(value, element) {
  return this.optional(element) || /^[A-Z,Ñ,&amp;]{3}\d{6}[0-9,A-Z]{3}$/i.test(value);
}, "El RFC debe tener el siguiente formato: AAA991231BBB");

$.validator.addMethod( "ine", function( value, element ){
	return this.optional(element) || /^[A-Z,Ñ,&amp;]{6}\d{8}[HM]{1}[0-9,A-Z]{3}$/i.test(value);
}, "La clave INE debe tener el siguiente formato: AAAAAA00112233ABBB" );


$.validator.addMethod("expediente", function(value, element) {
  return this.optional(element) || /^\d{1,4}[/]19\d{2}|\d{1,4}[/]20\d{2}$/i.test(value);
}, "El expediente debe tener el siguiente formato: 1234/2013");

$.validator.addMethod("curp", function(value, element) {
  return this.optional(element) || /^[a-zA-Z]{4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}[a-zA-Z]{5}[0-9A-Z]{2}$/i.test(value);
}, "La CURP debe tener el siguiente formato: AAAA001122BBBBBBCC");

$.validator.addMethod("nas", function(value, element) {
  return this.optional(element) || /^51[0-9]{2}-[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}$/i.test(value);
}, "El NAS debe tener el siguiente formato: 5100-0000-0000-0000-000");

$.validator.addMethod("expedienteConsecutivo", function(value, element) {
	return this.optional(element) || /^[0-9]{1,6}$/.test(value);
}, "El expediente consecutivo debe tener el siguiente formato: 000000");	

$.validator.addMethod("expedienteAnio", function(value, element) {
	var bandera = this.optional(element) || /^[0-9]{4}$/.test(value);
	if (bandera){
		var d = new Date();
		bandera = value <= d.getFullYear();
		if (!bandera){
			$.validator.messages['expedienteAnio'] ="El año del expediente no puede ser mayor al año actual";
		}
	}else{
		$.validator.messages['expedienteAnio'] = "El año del expediente debe tener el siguiente formato: 0000";
	}
	return bandera;
}, "Error");

$.validator.addMethod("fechaResolucion", function(value, element) {
	var res = value.split("-");
	var c = new Date(res[2], res[1]-1, res[0]);
	var d = new Date();
	return (c <= d);
}, "La fecha de resolución debe ser menor o igual al día actual");

$.validator.addMethod("horaRemate", function(value, element){
  var fRemate = $("#fecha_remate").val();
  var hRemate = value+':00';
  var arFecha = fRemate.split("-");
  fRemate = arFecha[2]+'-'+arFecha[1]+'-'+arFecha[0];
  var fechaHoraRemate = new Date(fRemate+'T'+hRemate);
  var fechaActual = new Date();
  tsFecHorRem = Math.round(fechaHoraRemate.getTime()/1000);
  tsFecAct = Math.round(fechaActual.getTime()/1000);
  return (tsFecHorRem >= tsFecAct);
}, "La hora del remate debe ser mayor o igual a la actual");

$.validator.addMethod("serie_billete", function(value, element) {
  return this.optional(element) || /^[A-Z][0-9][0-9]*$/i.test(value);
}, "El número del billete es incorrecto");

$.validator.addMethod("text_date", function(value, element) {
  return this.optional(element) || /^(\d{2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) de (20\d{2})$/i.test(value);
}, "El formato debe ser ## de xxxxx de ####");

$.validator.addMethod( "obs_can", function( value, element ) {
	return this.optional(element) || /^[1-9](\w+)$/.test(value);
}, "Se requiere un mínimo de 20 caracteres" );

$.validator.addMethod( "telefono_movil", function( value, element ) {
	var inicial = value.substring(0, 1);
	return ( inicial !== "0" );
}, "El número móvil no debe empezar con cero" );