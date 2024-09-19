<?php
include("db.php");
// include( "$inc_dir/globals.php");
// require_once "$inc_dir/obj/ObjUsuario.php";
// require_once "$inc_dir/db/mysql/DBUsuario.php";
// if ($_GET) {
//     $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
//     header($protocol . ' ' . 405 . ' ' . 'Method Not Allowed');
//     $textod405 = getTexto("405");
//     echo $textod405;
//     exit();
// }
$nombre      	= $_POST["nombre_reporte"];
$tipo        	= $_POST["tipo_reporte"];
$filtro_json 	= $_POST["filtro_json"];
$xls = false;
if(isset($_POST['download_by'])){
  if($_POST['download_by'] == 'xls'){
    $xls = true;
  }
}
if ($nombre == "" || $tipo == "" || $filtro_json == "") {
	$protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
    header($protocol . ' ' . 403 . ' ' . 'Method Not Allowed');
    $textod403 = getTexto("403");
    echo $textod403;
    exit();
}
$condiciones = 'Ninguna';
// session_start();
// if (!isset($_SESSION["idsession"])) {
//   header("location: /index.html");
//   exit();
// }
// $usuarioSession = $_SESSION['idsession'];
// // Espacio disponible para Alonso
// $reportesQueNecesitanIdEntidad = array("asdfadf");
// $reportesQueNecesitanTipoUsuario = array("firmaliberacion");

// if (in_array($nombre,$reportesQueNecesitanIdEntidad)) {
//   if ($filtro_json == '{}') {
//     $jsonArray = array();
//   } else {
//     $jsonArray = json_decode($filtro_json,true);
//   }
//   $jsonArray['idEntidad'] = $usuarioSession->getClaveEntidad();
//   $filtro_json = json_encode($jsonArray);
// }
// if (in_array($nombre,$reportesQueNecesitanTipoUsuario)) {
//   if ($filtro_json == '{}') {
//     $jsonArray = array();
//   } else {
//     $jsonArray = json_decode($filtro_json,true);
//   }
//   $jsonArray['tipo_usuario'] = $usuarioSession->getTipo();
//   $filtro_json = json_encode($jsonArray);
// }

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$columnHeader = '';  

switch ($nombre) {
  case 'bombas':
    $columnHeader = "ID\tClave de la Bomba\tFecha de Corte\tVenta\tFecha de Carga";  
    $sql = "SELECT id, claveBomba, fechaCorte, totalVenta, fechaCarga FROM bombas";
    if($filtro_json != "{}"){
      $sql .= " WHERE " . $filtro_json;
      $condiciones = str_replace( array('>=', '<=', 'LIKE', 'AND'), array('mayor o igual que', 'menor o igual que', 'contiene', 'y'), $filtro_json );
    }
    break;

  case 'ventasclientes':
    $columnHeader = "ID\tNombre del cliente\tFecha de Venta\tVenta\tFecha de Carga";
    $sql = "SELECT v.id, c.nombreCliente, v.fechaVenta, v.totalVenta, v.fechaCarga FROM ventasclientes v JOIN clientes c WHERE v.idCliente = c.id";
    if($filtro_json != "{}"){
      $sql .= " AND " . $filtro_json;
      $condiciones = str_replace( array('>=', '<=', 'LIKE', 'AND'), array('mayor o igual que', 'menor o igual que', 'contiene', 'y'), $filtro_json );
    }
    break;
  
  case 'tickets':
    $columnHeader = "ID\tNombre del cliente\tFecha de Venta\tVenta\tFecha de Carga\tFolio\tTarjeta";
    $sql = "SELECT t.id, c.nombreCliente, t.fechaVenta, t.montoVenta, t.fechaCarga, t.folio, t.numeroTarjeta FROM tickets t JOIN clientes c WHERE t.id_cliente = c.id";
    if($filtro_json != "{}"){
      $sql .= " AND " . $filtro_json;
      $condiciones = str_replace( array('>=', '<=', 'LIKE', 'AND'), array('mayor o igual que', 'menor o igual que', 'contiene', 'y'), $filtro_json );
    }
    break;
  default:
    // code...
    break;
}
// if($nombre == "bombas"){
//   $columnHeader = "ID\tClave de la Bomba\tFecha de Corte\tVenta\tFecha de Carga";  
//   $sql = "SELECT id, claveBomba, fechaCorte, totalVenta, fechaCarga FROM bombas";
//   if($filtro_json != "{}"){
//     $sql .= " WHERE " . $filtro_json;
//     $condiciones = str_replace( array('>=', '<=', 'LIKE', 'AND'), array('mayor o igual que', 'menor o igual que', 'contiene', 'y'), $filtro_json );
//   }
// }else{
//   $columnHeader = "ID\tNombre del cliente\tFecha de Venta\tVenta\tFecha de Carga";
//   $sql = "SELECT v.id, c.nombreCliente, v.fechaVenta, v.totalVenta, v.fechaCarga FROM ventasclientes v JOIN clientes c WHERE v.idCliente = c.id";
//   if($filtro_json != "{}"){
//     $sql .= " AND " . $filtro_json;
//     $condiciones = str_replace( array('>=', '<=', 'LIKE', 'AND'), array('mayor o igual que', 'menor o igual que', 'contiene', 'y'), $filtro_json );
//   }
// }



// ===========================================================================================================
if($xls){
  //$conn = new mysqli('localhost', 'root', '');  

  $result = $conn->query($sql);
  $setData = '';  
  if ($result->num_rows > 0) {
    while($row = $result->fetch_row()) {
      $rowData = '';  
      foreach ($row as $value) {  
          $value = '"' . $value . '"' . "\t";  
          $rowData .= $value;  
      }  
      $setData .= trim($rowData) . "\n";  
    }
  } 
  header("Content-type: application/octet-stream");  
  header("Content-Disposition: attachment; filename=".$nombre.".xls");  
  header("Pragma: no-cache");  
  header("Expires: 0");  
    
  echo ucwords($columnHeader) . "\n" . $setData . "\n";  
}else{
  $result = $conn->query($sql);

  $clientes = array();

  if ($result->num_rows > 0) {
    while($row = $result->fetch_row()) {
      //$clientes[ $row["id"] ] = $row["id"];
      array_push($clientes, $row);
    }
  }
  echo json_encode( array(
    'data' => $clientes,
    'cnd' => array('condiciones' => $condiciones)
  ) );

}
// ===========================================================================================================


?>
