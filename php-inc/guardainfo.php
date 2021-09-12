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
$bombas = $json_info->{'bombas'};
$clientes = $json_info->{'clientes'};
$fulldate_post = $json_info->{'full_date'};
$fulldate = date('Y-m-d', strtotime($fulldate_post));
$fechaCarga = date("Y-m-d");
#echo 'Fecha de Corte = '.$fulldate;
#echo '========= BOMBAS ==========';
$resultadoBombas = '';
$queryAll = '';
foreach ($bombas as $nameBomba => $value) {
	$queryAll .= 'INSERT INTO bombas (claveBomba, totalVenta, fechaCorte, fechaCarga) VALUES ("'.$nameBomba.'", '.$value.', "'.$fulldate.'", "'.$fechaCarga.'");';
}
#echo '========= CLIENTES ==========';
$resultado = '';
//$queryClientes = '';
foreach ($clientes as $idCliente => $value) {
	$queryAll .= 'INSERT INTO ventasclientes (idCliente, totalVenta, fechaVenta, fechaCarga) VALUES ('.$idCliente.', '.$value.', "'.$fulldate.'", "'.$fechaCarga.'");';
}
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