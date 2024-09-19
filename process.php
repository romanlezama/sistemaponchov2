<?php
$is_production=false;
//include( "php-inc/globals.php");
require_once("php-inc/utils/generals.php");
$cmd = getPostVar("cmd");
$idsession = getPostVar("idsession");

$edit = getPostVar("edit");
//$tkn_ses = getPostVar("tkn_ses");
if ($_GET) {
    $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
    header($protocol . ' ' . 405 . ' ' . 'Method Not Allowed');
    $textod405 = getTexto("405");
    echo $textod405;
    exit();
}

if ($cmd == "") {
	/*$protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
    header($protocol . ' ' . 403 . ' ' . 'Forbidden');
    $textod403 = getTexto("403");
    echo $textod403;*/
    exit;
}
$invalidateCMD = false;
/*CUANDO SE PONGA EL ARCHIVO SEPARADO VALIDANDO*/
if($cmd=="LOGIN"){

}

$as_is = false;
$is_html = false;

// if($cmd!="CMDLOGIN" && $cmd!="CMDRECCATALOGO" && $cmd!="CMDADDSOLICITUDP" && $cmd!="CMDENVIACORREO"){
//   //echo isset($_SESSION['idsession']);
// 	if (!isset($_SESSION['idsession'])) {
// 		//if ($_SESSION['idsession'] != $idsession) {
// 			$_SESSION['usuarioSession'] = "NOPE";
// 			session_unset();
// 			session_destroy();
// 			$processedData["error"] = "Su sesión ha expirado, por favor ingrese de nuevo al sistema";
// 			$processedData["idsession"] = 0;
// 			$processedData["cont"] = "LOGIN";
// 			$invalidateCMD = true;
// 		//}
// 	}
// }

$partesCMD = explode(":",$cmd);

$cmd = $partesCMD[0];
if (isset($partesCMD[1])) {
  $grid = $partesCMD[1];
}else {
  $grid = "";
}

if (!$invalidateCMD) {
	switch ($cmd) {
		// Cargar y procesar documento de Excel
		case "CMDCARGAXLS": include("php-inc/uploadxlsx.php"); break;
		case "CMDUPLOADTICKETS": include("php-inc/uploadtickets.php"); break;
		case "GETCLIENTES": include("php-inc/getclientes.php"); break;
		case "CMDSAVEINFO": include("php-inc/guardainfo.php"); break;
		case "CMDSAVEINFOTICKETS": include("php-inc/guardainfoTickets.php"); break;
		case "CMDADDCLIENT": include("php-inc/guardacliente.php"); break;
		case "CMDADDTEXT4CLIENT": include("php-inc/guardatextcliente.php"); break;
		case "GETTEXT4CLIENT": include("php-inc/gettxtsclientes.php"); break;
		case "GETFOLIOSEXISTS": include("php-inc/getfoliosexists.php"); break;
		case "CMDEDITRECORD": include("php-inc/updateinforecord.php"); break;
	    // //Login cmd CMDLOGIN
	    // case "CMDLOGIN": include("$inc_dir/procesos/usuarios/vallogin.php");break;

	    // //WHOAMI
	    // case "WHOAMI": include("$inc_dir/procesos/usuarios/whoami.php");break;

	    // //Login cmd CMDLOGOUT
	    // case "CMDLOGOUT": include("$inc_dir/procesos/usuarios/logout.php");break;

     //  //Recupera Catalogo
	  case "CMDREPORTES":include("php-inc/reportes.php");break;
	  // Borra registro
	  case "CMDBORRADATO":include("php-inc/borradato.php");break;

     //  //Recupera datos iniciales para OT
	    // case "CMDDATGENERAL":include("$inc_dir/procesos/ordentrabajo/otgeneral.php");break;

     //  //Recupera categorias iniciales para OT
	    // case "CMDCATEGORIAS":include("$inc_dir/procesos/ordentrabajo/categoriasot.php");break;

     //  //Recupera productos iniciales para OT
	    // case "CMDPRODUCTOS":include("$inc_dir/procesos/ordentrabajo/productosot.php");break;

     //  //Recupera productos iniciales para OT
	    // case "CMDCHATESCRIBE":include("$inc_dir/procesos/chat/chatescribe.php");break;

     //  //Recupera productos iniciales para OT
	    // case "CMDCHATLEE":include("$inc_dir/procesos/chat/chatlee.php");break;

     //  //Recupera productos iniciales para OT
	    // case "CMDCHATNOTIFICA":include("$inc_dir/procesos/chat/chatnotifica.php");break;

     //  //Alta para OT
	    // case "CMDALTAOT":include("$inc_dir/procesos/ordentrabajo/agregaot.php");break;

     //  //Update para OT
	    // case "CMDUPDATEOT":include("$inc_dir/procesos/ordentrabajo/updateot.php");break;

     //  //Update para OT
	    // case "CMDUPDATESTATUSOT":include("$inc_dir/procesos/ordentrabajo/updatestatusot.php");break;

     //  //Add paciente
     //  case "CMDADDPACIENTE":include("$inc_dir/procesos/paciente/agregapaciente.php");break;

     //  //Add direccion
     //  case "CMDADDDIRECCION":include("$inc_dir/procesos/direccion/agregadireccion.php");break;

     //  //Agrega Solicitud pendiente
	    // case "CMDADDSOLICITUDP":include("$inc_dir/procesos/solicitudp/agregasolicitudp.php");break;

     //  //Agrega Laboratorio
	    // case "CMDADDLABORATORIO":include("$inc_dir/procesos/laboratorio/agregalaboratorio.php");break;

     //  //Consulta laboratorios selector
	    // case "CMDSELECTORLABORATORIO":include("$inc_dir/procesos/laboratorio/consultaselectlaboratorio.php");break;

     //  //cambia estatus aprobado usuario Pendiente
     //  case "CMDAPRUEBAUSER":include("$inc_dir/procesos/solicitudp/apruebausuario.php");break;

     //  //calcula costo total de ot
     //  case "CMDCOSTOTOTAL":include("$inc_dir/procesos/ordentrabajo/calculacostoot.php");break;

     //  //calcula costo total de ot
     //  case "CMDRECUPERAOT":include("$inc_dir/procesos/ordentrabajo/recuperaot.php");break;

     //  //Recupera Catalogo
	    // case "CMDRECCATALOGO":include("$inc_dir/procesos/recuperacatalogo.php");break;

     //  //test cmd
	    // case "CMDENVIACORREO":include("$inc_dir/procesos/solicitudp/enviacorreo.php");break;
	    /*

	    //Agrega Gestor
	    case "CMDADDGESTOR":include("$inc_dir/procesos/gestores/addgestores.php");break;

	    //Agrega Pacientes
	    case "CMDADDPACIENTE":include("$inc_dir/procesos/pacientes/addpacientes.php");break;

	    //Agrega Empleados
	    case "CMDADDEMPLEADO":include("$inc_dir/procesos/empleados/addempleados.php");break;

	    //Agrega Centros
	    case "CMDADDCENTRO":include("$inc_dir/procesos/centros/addcentros.php");break;

	    //Agrega Centros
	    case "CMDADDCALENDARIOGES":include("$inc_dir/procesos/calendario/addcalendarioges.php");break;

	    //Agrega Centros
	    case "CMDADDCALENDARIO":include("$inc_dir/procesos/calendario/addcalendario.php");break;

	    //Agrega Usuarios
	    case "CMDADDUSUARIO":include("$inc_dir/procesos/usuarios/addusuario.php");break;

	    //Borra registro
	    case "CMDBORRADATO":include("$inc_dir/procesos/borradato.php");break;

	    //Consulta Calendario
	    case "CMDRECCALENDARIO":include("$inc_dir/procesos/calendario/reccalendario.php");break;

	    //Consulta Calendario citas admin
	    case "CMDRECCALENDARIOCITAADMIN":include("$inc_dir/procesos/calendario/reccalendariocitadmin.php");break;

	    //Consulta Calendario
	    case "CMDRECCALENDARIOGES":include("$inc_dir/procesos/calendario/reccalendarioges.php");break;

	    //Consulta Calendario solo uno
	    case "CMDRECCALENDARIOUNO":include("$inc_dir/procesos/calendario/recuncalendario.php");break;

	    //Consulta Calendario solo uno
	    case "CMDRECCALENDARIOUNOGES":include("$inc_dir/procesos/calendario/recuncalendarioges.php");break;

	    //Consulta Calendario
	    case "CMDEDICALENDARIO":include("$inc_dir/procesos/calendario/edicalendario.php");break;

	    //Consulta Calendario
	    case "CMDEDICALENDARIOGES":include("$inc_dir/procesos/calendario/edicalendarioges.php");break;

	    //Recupera Centros no asignados
	    case "CMDRECCENTRONOASIGNADO":include("$inc_dir/procesos/centros/reccentrosnoasignado.php");break;

	    //Recupera Centros asignados id
	    case "CMDRECCENTROASIGNADOID":include("$inc_dir/procesos/centros/reccentrosasignadosid.php");break;

	    //Agrega Asigna Centros
	    case "CMDADDASIGNACENTROS":include("$inc_dir/procesos/centros/addasignacentros.php");break;

	    //Agrega Asigna Tecnicas
	    case "CMDADDASIGNATECNICAS":include("$inc_dir/procesos/tecnicas/addasignatecnicas.php");break;

	    //Recupera Tecnicas no asignados
	    case "CMDRECTECNICANOASIGNADO":include("$inc_dir/procesos/tecnicas/rectecnicasnoasignado.php");break;

	    //Recupera Tecnicas asignados id
	    case "CMDRECTECNICAASIGNADOID":include("$inc_dir/procesos/tecnicas/rectecnicasasignadosid.php");break;

	    //Recupera Tecnicas asignados id
	    case "CMDRECTECNICAASIGNADOIDADMIN":include("$inc_dir/procesos/tecnicas/rectecnicasasignadosidadm.php");break;

	    //Recupera Selector de centros que pertenecen a un gestor por medio de la usuario tecnica
	    case "CMDRECCMBOCENTROSPORCAL":include("$inc_dir/procesos/calendario/reccentrosportecnica.php");break;

	    //Recupera Selector de centros que pertenecen a un gestor por medio de la usuario tecnica
	    case "CMDRECCMBOCLIENTES":include("$inc_dir/procesos/calendario/recpacientesporcentro.php");break;

	    //Recupera Centros asignados id
	    case "CMDRECGESTORESPORIDCENTRO":include("$inc_dir/procesos/centros/recgestoresporidcentro.php");break;

	    //Consulta Detalle pacienta atenci�n
	    case "CMDRECPACATENCIONUNO":include("$inc_dir/procesos/pacientes/recunpacienteatencion.php");break;

      //**********************INGENIA****************************************************************
      //Agrega General
	    case "CMDADDGENERAL":include("$inc_dir/procesos/generales/addgenerales.php");break;

      //Agrega Paises
	    case "CMDADDPAISES":include("$inc_dir/procesos/paises/addpaises.php");break;

      //Recupera Paises
	    case "CMDRECPAISES":include("$inc_dir/procesos/paises/recpaises.php");break;

      //Agrega Prospectos
	    case "CMDADDPROSPECTO":include("$inc_dir/procesos/prospectos/addprospectos.php");break;

      //Recupera Prospectos
	    case "CMDRECPROSPECTO":include("$inc_dir/procesos/prospectos/recprospectos.php");break;

      //Recupera Cursos
	    case "CMDRECCURSOS":include("$inc_dir/procesos/cursos/reccursos.php");break;

      //Recupera Precios cursos
	    case "CMDRECPRECIOSCURSOS":include("$inc_dir/procesos/precios/reccursosprecios.php");break;

      //Recupera Identificaciones
	    case "CMDRECIDENTIFICACIONES":include("$inc_dir/procesos/identificacion/recidentificacion.php");break;

      //Recupera Cursos X idsucursales
	    case "CMDRECCURSOSSUCURSALES":include("$inc_dir/procesos/cursos/reccursosxidsucursal.php");break;

      //Recupera Matricula nueva
	    case "CMDRECMATRICULANUEVA":include("$inc_dir/procesos/asistentes/recmatriculanueva.php");break;

      //Recupera Matricula nueva
	    case "CMDADDASISTENTES":include("$inc_dir/procesos/asistentes/addasistentes.php");break;

      //Recupera precio por curso
      case "CMDRECPRECIOXCURSO":include("$inc_dir/procesos/cursos/recpreciosxidcurso.php");break;

      //add pagos
      case "CMDADDPAGOS":include("$inc_dir/procesos/pagos/addpago.php");break;

      //add pagos
      case "CMDRECPAGOSPORASISTENTE":include("$inc_dir/procesos/pagos/recpagoxasistente.php");break;

      //recupera cursos por matricula
      case "CMDRECDATOSPORMATRICULA":include("$inc_dir/procesos/cursos/reccursosxmatricula.php");break;

      //recupera cursos por matricula
      case "CMDMODFORMAPAGO":include("$inc_dir/procesos/pagos/modformapago.php");break;

      //borra pago
      case "CMDDELPAGO":include("$inc_dir/procesos/pagos/delpago.php");break;

      //recupera datos del asistente por id
      case "CMDRECDATOSPORIDASISTENTE":include("$inc_dir/procesos/asistentes/recasistentesxid.php");break;

      //recupera datos del asistente por matricula
      case "CMDRECDATOSPORMATRICULAASISTENTE":include("$inc_dir/procesos/asistentes/recasistentesxmatricula.php");break;

      //recupera datos del asistente por matricula
      case "CMDRECDATOSPORMATRICULAASISTENTEIMP":include("$inc_dir/procesos/asistentes/recasistentesxmatriculaimp.php");break;

      //recupera datos del asistente por matricula
      case "CMDRECDATOSPORMATRICULAASISTENTESUS":include("$inc_dir/procesos/asistentes/recasistentesxmatriculasus.php");break;

      //Registra datos de imposibilidad
      case "CMDADDASISTENTEIMPOSIBLE":include("$inc_dir/procesos/asistentes/addimposibilidad.php");break;

      //Registra datos de sustentabilidad
      case "CMDADDASISTENTESUSTENTABILIDAD":include("$inc_dir/procesos/asistentes/addsustentabilidad.php");break;

      //Registra datos de sustentabilidad fds
      case "CMDADDASISTENTESUSTENTABILIDADFDS":include("$inc_dir/procesos/asistentes/addsustentabilidadfds.php");break;

      //sube foto asistentes
      case "CMDSUBEFOTO":include("$inc_dir/procesos/asistentes/addfoto.php");break;

      //sube identificacion imagen
      case "CMDSUBEIMGIDENTIFICACION":include("$inc_dir/procesos/asistentes/addimgidentificacion.php");break;

      //sube actualiza Perfil
      case "CMDUPDATEPERFIL":include("$inc_dir/procesos/usuarios/updateusuario.php");break;

      //recupera datos del asistente por matricula
      case "CMDRECDATOSPORMATRICULAASISTENTESUSFDS":include("$inc_dir/procesos/asistentes/recasistentesxmatriculasusfds.php");break;

      //recupera asistentes terminados
	  case "CMDRECASISTENTESTERMINADOS":include("$inc_dir/procesos/asistentes/recasistentesterminados.php");break;*/


	  default: include("$inc_dir/formas/arrojarFormulario.php");break;
	};
}

// if ($grid != NULL && strlen($grid) > 0) {
// 	include("$inc_dir/grids/procesaGrid.php");
// }

// if ($debug_post) {
// 	ob_start();
// 	print_r($_POST);
// 	$elPost = ob_get_clean();
// }

if(isset($processedData)) {
	if (!$is_html) {
		header("Content-Type: application/x-json; charset=UTF-8");
	}

	if ($as_is) {
		if (!$is_html && isset($_SESSION['idsession'])) {
			//$processedData = json_decode($processedData,true);
			$processedData["idsession"] = $_SESSION['idsession'];
			$processedData["id_doctor"] = $_SESSION["id"];

			//if(isset($processedData["elementos"])){
				//array_push($processedData["elementos"],$csrfarray);
				//array_push($processedData["elementos"],$csrfarray);
			//}

			$processedData = json_encode($processedData,JSON_UNESCAPED_SLASHES);
		}

		echo $processedData;
	}else {
		if (isset($_SESSION['idsession'])) {
			$processedData["idsession"] = $_SESSION['idsession'];
      $processedData["id_doctor"] = $_SESSION["id"];
			//$processedData["fea"] = $_SESSION['fea'];
		}

		/*if ($debug_post) {
            $processedData['elPost'] = $elPost;
		}
		if ($debug_ini_en_json) {
			$processedData['elIni'] = $dj_ini;
		}*/

		$processedData["server_name"]= $_SERVER['SERVER_NAME'];
		//print_r($processedData);
		echo json_encode($processedData, /*JSON_UNESCAPED_UNICODE|*/ JSON_UNESCAPED_SLASHES);

	}
}
?>
