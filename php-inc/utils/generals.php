<?php

//echo "generals";
//Valida existencia de varables post
require_once 'class.inputfilter.php';

function getPostVar($name, $default=''){
	$varPost = "";
	$filter = new InputFilter();
    if( isset( $_POST[$name] ) )
       if(is_array($_POST[$name])){
       		return $_POST[$name];
       }else{
    		$varPost = $filter->process($_POST[$name]);
    		//return safe_string_mysql($varPost);
    		return $_POST[$name];
       }
    if($default!='')
    	$varPost = $filter->process($default);
        return safe_string_mysql($default);
        //return $default;
    return '';
}

function safe_string_mysql($value){
	global $DB_host;
	global $DB_user;
	global $DB_pass;
	global $DB_name;
	global $conexionParaClean;

		$mysqli = new mysqli($DB_host, $DB_user, $DB_pass);
		$mysqli->set_charset("utf8");
		$mysqli->select_db($DB_name);
   return mysqli_real_escape_string($mysqli,$value);
}

function getGetVar($name, $default=''){
    if( isset( $_GET[$name] ) )
        return $_GET[$name];
    if($default!='')
        return $default;
    return '';
}

function isError(&$error){
    return isset ($error) && $error;
}


$conexionParaClean = NULL;
//JAL. Función para limpiar el elemento de código malicioso o que podría causar conflicto con la consulta mysql.
function clean($value) {
	global $DB_host;
	global $DB_user;
	global $DB_pass;
	global $DB_name;
	global $conexionParaClean;

	$mysqli = new mysqli($DB_host, $DB_user, $DB_pass);
	$mysqli->set_charset("utf8");
	$mysqli->select_db($DB_name);


	if (!is_array($value)) {
    	if (get_magic_quotes_gpc())    $value = stripslashes($value);
    	if (!is_numeric($value))    $value = mysqli_real_escape_string($mysqli,$value);
	}
    return $value;
}

//JAL. Usamos la función "clean" sobre el arreglo de $_POST para limpiar todas, requerimos una conexión mysql para usar "mysql_real_escape_string"
function cleanPostVars() {
	global $DB_host;
	global $DB_user;
	global $DB_pass;
	global $DB_name;
	global $conexionParaClean;

	if (count($_POST) > 0) {
		$mysqli = new mysqli($DB_host, $DB_user, $DB_pass);
		$mysqli->set_charset("utf8");
		$mysqli->select_db($DB_name);
		/*$conexionParaClean = mysql_connect( $DB_host, $DB_user, "$DB_pass",true);
		mysql_select_db( $DB_name, $conexionParaClean );*/
		array_map('clean',$_POST);
		//mysql_close($conexionParaClean);
		$mysqli->close();
	}
}

//echo "generals end";

function dj_error( $mensaje ) {
	global $getOut,$processedData,$dj_error_sql,$debug_sql;
	$getOut = true;
	unset($processedData['msg']);
	$processedData['error'] = $mensaje;
	if ($debug_sql && strlen($dj_error_sql) > 0) {
		$processedData['error'] .= "<br/>".$dj_error_sql;
	}
}

function dj_save_sql_error( $qry ) {
	global $dj_error_sql;

	$dj_error_sql = "SQL: $qry.<br/>".mysql_error();
}

function obtenerTipoEntidad($id_entidad) {
	$salas = array("02","03","04","05");

	$numero_entidad = substr($id_entidad,2,2);

	if (in_array($numero_entidad,$salas)) {
		return "sala";
	}

	return "juzgado";
}

function tipoIdentificacionNumerico( $tipo_identificacion_str ) {
	switch ($tipo_identificacion_str) {
		case "cedula_profesional": return 1;
		case "credencial_de_elector": return 2;
		case "3": return 3;
		case "4": return 4;
		case "pasaporte": return 5;
		case "otro": return 6;
	}
	return 0;
}

function getParams() {

	global $_inputParams;

	$params = getPostVar('params');
//	echo "params: $params";
	if ($params != "" && (!isset($_inputParams) || $_inputParams == NULL)) {

		if (strpos($params,"\"") === false) {
			$params = str_replace(array("{","}",":",","),array("{\"","\"}","\":\"","\",\""),$params);
		}

		$_inputParams = json_decode($params,true);
	}

	return $_inputParams;
}

function getFromParams($name,$default='') {
	$params = getParams();
	if (isset($params[$name])) {
		return $params[$name];
	}
	return getPostVar($name,$default);
}

function diaHabil($fecha,$goBack = false) {
	global $diasInhabilesBanco;

	$tiempo = strtotime($fecha);

	do {

		$itsok = true;

		$yesBack = false;

		$diaSemana = intval(date('N',$tiempo));

		$sumaDias = 0;

		if ($diaSemana == 6) {
			if ($goBack) {
				$sumaDias -= 1;
				$yesBack = true;
			}else {
				$sumaDias += (8 - $diaSemana);
			}
		}else if ($diaSemana == 7) {
			$sumaDias += (8 - $diaSemana);
		}

//		echo "Suma Días: ".$sumaDias."\n";

		$tiempo2 = $tiempo + $sumaDias*24*60*60;

		if ($tiempo2 != $tiempo) {

			$tiempo = $tiempo2;

			$itsok = false;
			$sumaDias = 0;
		}

		$anio = date('Y',$tiempo);
		$soloFecha = date('Y-m-d',$tiempo);

		for ($i = 0; $i < count($diasInhabilesBanco); $i++) {
			if ($soloFecha == str_replace("1900",$anio,$diasInhabilesBanco[$i])) {
				$sumaDias += 1*($yesBack?-1:1);
				break;
			}
		}

		$tiempo2 = $tiempo + $sumaDias*24*60*60;

		if ($tiempo2 != $tiempo) {

			$tiempo = $tiempo2;

			$itsok = false;
			$sumaDias = 0;
		}

	}while(!$itsok);

	$fechaFinal = date("Y-n-j H:i:s",$tiempo);

	return $fechaFinal;
}

function convertirClaveEntidadAJuzgadoSICOR( $id_entidad ) {
	$correspondencias = array(
		"02"=>"SC",
		"03"=>"SP",
		"04"=>"SF",
		"05"=>"SJA",
		"06"=>"PIC",
		"07"=>"PIP",
		"08"=>"PIF",
		"09"=>"PIA",
		"10"=>"PIAG",
		"11"=>"PES",
		"12"=>"PP",
		"13"=>"PDNG",
		"14"=>"PC",
		"15"=>"JFO");

	$clave = substr($id_entidad, 2, 2);
	$numero = substr($id_entidad, 5, 3);

	return $numero.$correspondencias[$clave];
}

function crearElementoForma($id,$name,$defaultvalue,$tipo="hidden",$label="",$maxlength="",$required="",$message="",$rdonly="",$orden="",$filtro="") {
	$elemento = array(
				"id"			=> $id,
				"name"			=> $name,
				"defaultvalue"	=> $defaultvalue,
				"tipo"			=> $tipo,
				"label"			=> $label,
				"maxlength"		=> $maxlength,
				"required"		=> $required,
				"message"		=> $message,
				"rdonly"		=> $rdonly,
				"orden"			=> $orden,
				"filtro"		=> $filtro
				);

	return $elemento;
}

function crearParams( $arregloParams ) {
	str_replace("\"","",json_encode($arregloParams));
}

function crearAccion($actLabel, $actCmd, $actIsPopup = "", $actTituloDeshabilitado = "", $actTituloConfirmacion = "" , $actParams = "") {

		return array(	"label"					=> $actLabel				,
						"cmd"					=> $actCmd					,
						"isPopup"				=> $actIsPopup				,
						"tituloDeshabilitado"	=> $actTituloDeshabilitado	,
						"tituloConfirmacion"	=> $actTituloConfirmacion	,
						"params"				=> $actParams
					);
}

function makeRandomString($size,$salt=NULL) {
	if ($salt == NULL) {
  		$salt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	}
  srand((double)microtime()*1000000);
      $i = 0;
      while ($i < $size) {
            $num = rand() % strlen($salt);
            $tmp = substr($salt, $num, 1);
            $pass = $pass . $tmp;
            $i++;
      }
      return $pass;
}

function smrPhp2Firebug( $element, $titulo="" ) {
echo "<script language=\"javascript1.1\" type=\"text/javascript\">\r\n";
echo "if ( typeof loadFirebugConsole == 'function' ) {\r\n";
if ( $titulo!="") {
echo sprintf( "console.log(%s);\r\n", json_encode($titulo ) ) ;
}
echo sprintf( "console.log(%s)\r\n", json_encode($element ) ) ;
echo "return true;";
echo "}\r\n";
echo "</script>\r\n";
}

function agregaHoraFecha($fecha){
	$arrFec = explode(" ",$fecha);
	$fecConHora = $arrFec[0]." ".date("H:i:s");
	return $fecConHora;
}

function agregaHoraInicial($fecha){
	$arrFec = explode(" ",$fecha);
	$fecConHora = $arrFec[0]." "."08:00:00";
	return $fecConHora;
}

function dias_transcurridos($fecha_i,$fecha_f)
{
	$dias	= (strtotime($fecha_i)-strtotime($fecha_f))/86400;
	$dias 	= abs($dias); $dias = floor($dias);
	return $dias;
}

function redondear_dos_decimal($valor) {
   $float_redondeado=round($valor * 100) / 100;
   return $float_redondeado;
}

function validaNAS($nas,$urlsicorp){
	//$nas = getFromParams("nas");
	$theParams = array("comando"	=>"NAS",
						"nas"		=> $nas);

	$url = "$urlsicorp/servsicor.php";

	$postVars = "params=".json_encode($theParams);

	$ch = curl_init( $url );

	curl_setopt( $ch, CURLOPT_POST, 1 );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $postVars );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 0 );
	curl_setopt( $ch, CURLOPT_HEADER, 0 );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );

	$jsonStr = curl_exec( $ch );

	curl_close( $ch );

	$datos = json_decode($jsonStr, true);

	return $datos['juzgado'];

}

function invierteFecha($fechahora){
	$fechaHoraArr = explode(" ",$fechahora);
	$fechasola = $fechaHoraArr[0];
	$fechaArr = explode("-", $fechasola);
	$fecSolaBien = $fechaArr[2]."-".$fechaArr[1]."-".$fechaArr[0];
	if(count($fechaHoraArr)==2){
		$fecSolaBien = $fecSolaBien." ".$fechaHoraArr[1];
	}
	return $fecSolaBien;
}

function convertirJuzgadoAClaveEntidad($juzgado) {
		if (!is_string($juzgado) || $juzgado == "") {
			return "";
		}

		if ($juzgado == "CON") {
			return "CON";
		}

		$aClaves = array(
						"PC"=>"12",
						"PP"=>"12",
						"PIC"=>"06",
						"PIP"=>"07",
						"PIF"=>"08",
						"PIA"=>"09",
						"PIAG"=>"10",
						"PIAT"=>"11",
						"PES"=>"11",
						"PDNG"=>"13",
						"PCPO"=>"14",
						"JFO"=>"15",
						"SC"=>"02",
						"SP"=>"03",
						"SF"=>"04",
						"SJA"=>"05"
						);

		$numero = "";
		$codigo = "";
		for ($i = 0; $i < strlen($juzgado); $i++) {
			if ( $juzgado[$i] == "0" || $juzgado[$i] == "1" || $juzgado[$i] == "2" || $juzgado[$i] == "3" || $juzgado[$i] == "4" || $juzgado[$i] == "5" || $juzgado[$i] == "6" || $juzgado[$i] == "7" || $juzgado[$i] == "8" || $juzgado[$i] == "9" ) {
				$numero .= $juzgado[$i];
			}else {
				$codigo .= $juzgado[$i];
			}
		}

		if (strlen($numero) == 1) {
			$numero = "0".$numero;
		}
		$clave_entidad = "JD".$aClaves[$codigo].".".$numero;

		$arrCveEntidad = explode(".", $clave_entidad);
		if(strlen($arrCveEntidad[0])>2){
			$clave_entidad = $clave_entidad;
		}else{
			$primeros2 = substr($arrCveEntidad[1],0,2);
			$ultimos2 = substr($arrCveEntidad[1],2);
			$clave_entidad = $arrCveEntidad[0].$primeros2.".".$ultimos2;
		}

		return $clave_entidad;
	}

	//if (!function_exists('http_response_code')) {
        function getTexto($code = NULL) {
            if ($code !== NULL) {
                switch ($code) {
                    case 403: $text = '
<html>
<head>
<title>403 Forbidden</title>
</head>
<body bgcolor="white">
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.4.6 (Ubuntu)</center>
</body>
</html>
';
			      break;
                    //case 404: $text = 'Not Found'; break;
                    case 405: $text = '
<html>
<head>
<title>405 Method Not Allowed</title>
</head>
<body bgcolor="white">
<center><h1>405 Method Not Allowed</h1></center>
<hr><center>nginx/1.4.6 (Ubuntu)</center>
</body>
</html>
';
			      break;
                    //$text = 'Method Not Allowed'; break;
                    //default:
                    //    exit('Unknown http status code "' . htmlentities($code) . '"');
                    //break;
                }

                //$protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

               // header($protocol . ' ' . $code . ' ' . $text);

                //$GLOBALS['http_response_code'] = $code;

            }
            // else {

            //    $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);

            //}

            return $text;

        }
   // }

/**
* @method json_diffs
*
* @param jsonAntes
* @param jsonDespues
*
* @author Carlos Olvera
*
* @return jsonDifFinal
*
* Saca un json con las diferencias entre los jsonAntes y jsonDespues
*
*/
function json_diffs($jsonAntes,$jsonDespues){

   	$array1 = json_decode($jsonAntes,true);
   	$array2 = json_decode($jsonDespues,true);

   	$arrDif = array_diff($array1, $array2);
   	$arrDifKey = array_diff_key($array1, $array2);
   	foreach ($arrDifKey as $elemento){
   		array_push($arrDif);
   	}

   	$arrDif2 = array_diff($array2, $array1);
   	$arrDifKey2 = array_diff_key($array2, $array1);
   	foreach ($arrDifKey2 as $elemento2){
   		array_push($arrDif2);
   	}

   	$arrdifFinal = array_merge($arrDif,$arrDif2);

   	if(count($arrdifFinal)==0) {
   		$jsonDifFinal = "";
   	}else{
   		$jsonDifFinal = json_encode($arrdifFinal, JSON_UNESCAPED_SLASHES);
   	}

   	return $jsonDifFinal;
}

function validaNombreComplementario($cadenaNombre){
	$retorno = false;

	$cadenabusca = "&&";
	$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
	if ($posicion_coincidencia === false) {
		$cadenabusca = "\/\/";
		$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
		if ($posicion_coincidencia === false) {
			$cadenabusca = ",,";
			$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
			if ($posicion_coincidencia === false) {
				$cadenabusca = "..";
				$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
				if ($posicion_coincidencia === false) {
					$cadenabusca = "--";
					$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
					if ($posicion_coincidencia === false) {
						$cadenabusca = "  ";
						$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
						if ($posicion_coincidencia === false) {
							$cadenabusca = "ÁÁ";
							$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
							if ($posicion_coincidencia === false) {
								$cadenabusca = "ÉÉ";
								$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
								if ($posicion_coincidencia === false) {
									$cadenabusca = "ÍÍ";
									$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
									if ($posicion_coincidencia === false) {
										$cadenabusca = "ÓÓ";
										$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
										if ($posicion_coincidencia === false) {
											$cadenabusca = "ÚÚ";
											$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
											if ($posicion_coincidencia === false) {
												$cadenabusca = "ÑÑ";
												$posicion_coincidencia = strpos($cadenaNombre, $cadenabusca);
												if ($posicion_coincidencia === false) {
													return true;
												}else {
													return false;
												}
											}else {
												return false;
											}
										}else {
											return false;
										}
									}else {
										return false;
									}
								}else {
									return false;
								}
							}else {
								return false;
							}
						}else {
							return false;
						}
					}else {
						return false;
					}
				}else {
					return false;
				}
			}else {
				return false;
			}
		}else {
			return false;
		}
	}else {
		return false;
	}

}

function enviaCorreo($email,$nombre,$num_cel){
    require('mailer/src/PHPMailer.php');
    require('mailer/src/SMTP.php');
    require('mailer/src/Exception.php');
    require('mailer/src/OAuth.php');

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    //Luego tenemos que iniciar la validación por SMTP:
    $mail->IsSMTP();
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = "ssl";
    $mail->Host = "smtp.gmail.com"; // A RELLENAR. Aquí pondremos el SMTP a utilizar. Por ej. mail.midominio.com
    $mail->Username = "carloaolverar@gmail.com"; // A RELLENAR. Email de la cuenta de correo. ej.info@midominio.com La cuenta de correo debe ser creada previamente.
    $mail->Password = "Kldnpdlvkm-1"; // A RELLENAR. Aqui pondremos la contraseña de la cuenta de correo
    $mail->Port = 587; // Puerto de conexión al servidor de envio.
    $mail->From = "soporte@innovan2.com"; // A RELLENAR Desde donde enviamos (Para mostrar). Puede ser el mismo que el email creado previamente.
    $mail->FromName = "Innovandolab"; //A RELLENAR Nombre a mostrar del remitente.
    $mail->addAddress("orcas40@gmail.com"); // Esta es la dirección a donde enviamos
    $mail->IsHTML(true); // El correo se envía como HTML
    $mail->Subject = "Correo de prueba - SOLICITUD DE ALTA"; // Este es el titulo del email.
    $plantilla = file_get_contents('mailB.html');
    $cuerpo1 = str_replace("<p id='name'></p>","<p id='name'>".$nombre."</p>",$plantilla);
    $cuerpo1 = str_replace("<p id='email'></p>","<p id='name'>".$email."</p>",$plantilla);
    $cuerpo1 = str_replace("<p id='cel'></p>","<p id='name'>".$num_cel."</p>",$plantilla);
    $body = $cuerpo1;
    $mail->Body = $body; // Mensaje a enviar.
    try {
			print_r($mail);
			$exito = $mail->Send(); // Envía el correo.
			echo "******* $exito";
		} catch (Exception $e) {
			echo 'Excepción capturada: '.$e->getMessage()."\n";
		}
    if($exito){
        echo 'El correo fue enviado correctamente.';
        return $exito;
    }
    else{
			  echo 'Hubo un problema. Contacta a un administrador.';
				return $exito;
		}
}

function sendmail($nombre,$email,$num_cel){
	# FIX: Replace this email with recipient email
  $mail_to = "orcas40@gmail.com";
  # Sender Data
  // $subject = trim($_POST["subject"]);
  $subject = "Contacto";
  $name = str_replace(array("\r","\n"),array(" "," ") , strip_tags(trim($_POST["name"])));
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $whatsapp = trim($_POST["whatsapp"]);
  $message = trim($_POST["message"]);

  /*if ( empty($name) OR !filter_var($email, FILTER_VALIDATE_EMAIL) OR empty($message)) {
      # Set a 400 (bad request) response code and exit.
      http_response_code(400);
      echo "Por favor complete la forma y trate nuevamente.";
      exit;
  }*/

  # Mail Content
  /*$content = "From: soporte@innovan2.com";
  $content = "Name: $name\n\n";
  $content .= "Email: $email\n\n";
  $content .= "Whatsapp: $whatsapp\n\n";
  $content .= "Message:\n$message\n";*/

	$plantilla = file_get_contents('mailB.html');
	$cuerpo1 = str_replace("<p id='name'></p>","<p id='name'>".$nombre."</p>",$plantilla);
	$cuerpo1 = str_replace("<p id='email'></p>","<p id='name'>".$email."</p>",$plantilla);
	$cuerpo1 = str_replace("<p id='cel'></p>","<p id='name'>".$num_cel."</p>",$plantilla);

  # email headers.
  $headers = "From: Soporte soporte@innovan2.com";

  # Send the email.
	$success = mail($mail_to,"Correo de prueba - SOLICITUD DE ALTA",$cuerpo1);
  if ($success) {
      # Set a 200 (okay) response code.
      http_response_code(200);
      echo "Gracias su correo fue enviado. <a href='javascript:history.back(1);'>Regresar</a>";
			return $success;
  } else {
      # Set a 500 (internal server error) response code.
      http_response_code(500);
      echo "Oops! Something went wrong, we couldn't send your message.";
			return $success;
  }

}
?>
