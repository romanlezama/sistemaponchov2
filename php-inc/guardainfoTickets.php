<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
$str_info = $_POST['info_to_save'];
$json_info = json_decode($str_info);
$folios = $json_info->{'folios'};
$fechaCarga = date("Y-m-d");
#echo '========= FOLIOS ==========';
$queryAll = '';
//$testPrint = [];
foreach ($folios as $folio => $infoFolio) {
	$fecha_venta = $infoFolio->{'fecha_de_venta'};
	$date_fecha_venta = date('Y-m-d', strtotime($fecha_venta));
	$queryAll .= 'INSERT INTO tickets (numeroTarjeta, folio, fechaVenta, fechaCarga, montoVenta, id_cliente) VALUES ("'.$infoFolio->{'numero_de_tarjeta'}.'", "'.$folio.'", "'.$date_fecha_venta.'", "'.$fechaCarga.'", '.$infoFolio->{'monto'}.', '.$infoFolio->{'cliente'}.');';
	//array_push($testPrint, $queryAll);
}
//echo $queryAll;
#echo '========= CLIENTES ==========';
$resultado = '';
if ($conn->multi_query( $queryAll ) === TRUE){
	$resultado = 'Creados correctamente';
} else{
	$resultado = 'Error: '.$conn->error;
}

$result = array(
	'msg' => $resultado
);
echo json_encode( $result );
?>