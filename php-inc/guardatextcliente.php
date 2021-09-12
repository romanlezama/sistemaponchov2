<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
$textCliente = $_POST['textCliente'];
$idCliente = $_POST['idCliente'];

$query = 'INSERT INTO txtsclientes (idCliente, txtAccepted) VALUES ("'.$idCliente.'", "'.$textCliente.'");';

if ($conn->query( $query ) === TRUE){
	echo json_encode( array(
		'msg' => 'Ok'
	) );
} else{
	echo json_encode( array(
		'error' => 'Ocurrio un error al guardar la informacion'
	) );
}
?>