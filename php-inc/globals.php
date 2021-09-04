<?php

if( !defined("SCRIPT"))
    header('Content-Type: text/html; charset=UTF-8');

if (!defined("RPP")) {define("RPP", 10);}

$dj_ini = parse_ini_file('D:\ProgramasInstalados\xampp\htdocs\siilad_git\skills_depot.ini',true);
$seccionIni = "correspondencia";
$servername = $_SERVER['SERVER_NAME'];
$debug_post = false;
switch ($servername){
	case "localhost":
	/*case "depjud.tsjdf.gob.mx":
	case "sadj.poderjudicialdf.gob.mx":
	case "depjud.poderjudicialdf.gob.mx":*/
		$seccionIni = 'correspondencia';
	break;
}

$DB_host = $dj_ini[$seccionIni]['DB_host'];
$DB_user = $dj_ini[$seccionIni]['DB_user'];
$DB_pass = $dj_ini[$seccionIni]['DB_passwd'];
$DB_name = $dj_ini[$seccionIni]['DB_name'];

//$pdf_server = $dj_ini[$seccionIni]['pdf_server'];
/*
//JAL. Indica si debe mostrarse o no el mensaje de que no hay conexión con el banco. Solo valores booleanos "true " y "false" sin comillas.
$santander_ok = $dj_ini[$seccionIni]['santander_ok'];

//JAL. Indica si es la versión de producción o no
$is_production = $dj_ini[$seccionIni]['is_production'];

//JAL. Indica si debe arrojar la consulta completo y error mysql en caso de error.
$debug_sql = $dj_ini[$seccionIni]['debug_sql'];
*/
//Directorio web y de inclucion
if(defined("SCRIPT") ){
	/*$root_dir = '/var/www';
	$inc_dir =  '/var/www/depgar/php-inc';
	$scripts_dir =  '/var/www/depgar/scripts';*/

  $root_dir = 'D:\ProgramasInstalados\xampp\htdocs';
	$inc_dir =  'D:\ProgramasInstalados\xampp\htdocs\siilad_git\php-inc';
	$scripts_dir =  'D:\ProgramasInstalados\xampp\htdocs\siilad_git\scripts';

	$web_path = '';
}else{

	/*$root_dir = $dj_ini[$seccionIni]['root_dir'];
	$inc_dir = $dj_ini[$seccionIni]['inc_dir'];
	$script_dir = $dj_ini[$seccionIni]['scripts_dir'];*/

  $root_dir = 'D:\ProgramasInstalados\xampp\htdocs';
	$inc_dir =  'D:\ProgramasInstalados\xampp\htdocs\siilad_git\php-inc';
	$scripts_dir =  'D:\ProgramasInstalados\xampp\htdocs\siilad_git\scripts';

	$web_path = "http://".$_SERVER['HTTP_HOST'];//$dj_ini[$seccionIni]['web_path'];

}

/*$montoLimiteAutorizacion= $dj_ini[$seccionIni]['monto_limite_para_autorizacion'];

$comision_dep_santandern= $dj_ini[$seccionIni]['comision_dep_santander'];
$limite_pension_alimenticia= $dj_ini[$seccionIni]['limite_pension_alimenticia'];

$pconcruza = $dj_ini[$seccionIni]['passwd_superadmin'];*/
//$montoLimiteAutorizacion=2;

$rutabaselog = "D:\ProgramasInstalados\xampp\htdocs\siilad_git\logs";//$dj_ini[$seccionIni]['ruta_bitacoras'];

/* ******** ACABAN CONFIGURACIONES DE ARCHIVO .INI ********** */



//JAL. Indica si el process.php debe arrojar el contenido del archivo .ini en el json en una entrada "elIni", para debuguear
$debug_ini_en_json = true;

$rowClass[0]="par";
$rowClass[1]="non";

$dateFormat = "%e-%b-%Y";

if(!defined("SCRIPT")){
$is_ie = (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),"msie") !== false ? true : false);
} else {
  $is_ie = false ;
}

if( !defined("SCRIPT")) {
  $is_ie = (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),"msie") !== false ? true : false);
} else {
  $is_ie = false ;
}

//JAL. Indica si se debe manejar conexión Oracle, si no se usa por defecto MySQL
$is_oracle = false;

$epsilon = 0.0001; //JAL. Por que algunos procesadores aritméticos apestan -_-

$MES = array("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

$diasInhabilesBanco = array(
	//"1900-01-01", // 1 de enero
	//"1900-02-05", // 5 de febrero
	"1900-05-01", // 1 de mayo
	"1900-07-15", // 15 de Julio
	"1900-07-18", // 18 de Julio
	"1900-07-19", // 19 de Julio
	"1900-07-20", // 20 de Julio
	"1900-07-21", // 21 de Julio
	"1900-07-22", // 22 de Julio
	"1900-07-25", // 25 de Julio
	"1900-07-26", // 26 de Julio
	//"1900-07-27", // 27 de Julio
	//"1900-07-28", // 28 de Julio
	//"1900-07-29", // 29 de Julio
	"1900-09-14", // 14 de septiembre
	"1900-09-15", // 15 de septiembre
	"1900-09-16", // 16 de septiembre
	"1900-10-31", // 31 Octubre
	"1900-11-01", // 1 Noviembre
	"1900-11-02", // 2 Noviembre
	"1900-11-21", // 21 Noviembre
	"1900-12-19", // 19 de diciembre
	"1900-12-20", // 20 de diciembre
	"1900-12-21", // 21 de diciembre
	"1900-12-22", // 22 de diciembre
	"1900-12-23", // 23 de diciembre
	"1900-12-26", // 26 de diciembre
	"1900-12-27", // 27 de diciembre
	"1900-12-28", // 28 de diciembre
	"1900-12-29", // 29 de diciembre
	"1900-12-30", // 30 de diciembre
	"1900-01-01", // 1 enero
	"1900-01-02", // 2 enero
	"1900-01-03", // 3 enero
	"1900-01-04", // 4 enero
	"1900-01-05", // 5 enero
	"1900-01-06"  // 6 enero

);


//$files_dir = "/var/www/depgar/archivos";
$python ="python2.7";
//$temp_dir = "/var/www/public_html/temporales";
$python_ooo = "/opt/openoffice.org3/program/python";

$db_dir = $inc_dir."/db/mysql";

if ($is_oracle) {
	$db_dir = $inc_dir."/db/oracle";
}


//JAL. Incluimos la función de consulta simple de oracle si estamos usando oracle.
if ($is_oracle) {
	require_once("$inc_dir/utils/oracle_simple_query.php");
}


require_once "$inc_dir/utils/generals.php";
require_once "$inc_dir/utils/generalsRedis.php";

//JAL. Constantes de CMD de process.php
require_once "$inc_dir/constantes_cmd.php";

require_once "$inc_dir/php4logger/Logger.php";

require_once "$inc_dir/php4logger/LoggerWrap.php";

//Logger::configure("$inc_dir/php4logger/config.xml");

$rutabaselog = $rutabaselog."/".date("Y")."/".date("m")."/";

Logger::configure(array(
	'rootLogger' => array(
        'appenders' => array('default')
    ),
	'appenders' => array(
        'default' => array(
            'class' => 'LoggerAppenderFile',
            'layout' => array(
                'class' => 'LoggerLayoutPattern',
    			'conversionPattern' => '%date %message'
            ),
            'params' => array(
            	'file' => $rutabaselog.'/bitacora_depjud-'.date("Ymd").'.log',
            	'append' => true
            )
        )
    )
));

$log = LoggerWrap::getMainLoggerWrap();

if(!defined("SCRIPT"))
    require_once "$inc_dir/sesion.php";


//Base de datos
require_once("$inc_dir/db_globals.php");

require_once "$inc_dir/utils/historial.php";

//JAL. Usar la fecha hora centro, siempre.
date_default_timezone_set("America/Mexico_City");

//JAL. Limpiar las variables que llegan por POST para evitar inyección de código.
cleanPostVars();

?>
