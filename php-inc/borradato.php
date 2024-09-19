<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
$tabla = $_POST['tabla'];
$id = $_POST['id'];

$query = 'DELETE FROM '.$tabla.' WHERE id='.$id.';';

if ($conn->query( $query ) === TRUE){
	echo json_encode( array(
		'msg' => 'Registro borrado correctamente'
	) );
} else{
	echo json_encode( array(
		'error' => 'Ocurrio un error al eliminar el registro',
		'msg' => 'Ocurrio un error al eliminar el registro '.$conn->error
	) );
}
$conn->close();
?>