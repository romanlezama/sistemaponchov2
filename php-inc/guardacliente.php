<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
$nombreCliente = $_POST['nombreCliente'];

$query = 'INSERT INTO clientes (nombreCliente) VALUES ("'.$nombreCliente.'");';

if ($conn->query( $query ) === TRUE){
	echo json_encode( array(
		'msg' => 'Creados correctamente'
	) );
} else{
	echo json_encode( array(
		'error' => 'Ocurrio un error al guardar la informacion'
	) );
}
?>