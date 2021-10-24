<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

$query = 'UPDATE '.$_POST["tablaBD"].' SET ';
$listFields = [];
foreach($_POST as $param_name => $param_val){
	if(strpos($param_name, "__moneda") !== false){
		$val = floatval($param_val);
		$param_name=str_replace("__moneda", "", $param_name);
		array_push($listFields, $param_name .' = '. $val .'');
	}else{
		if($param_name != "id" && $param_name != "cmd" && $param_name != "tablaBD"){
			//echo $param_name .' == '.$param_val .' type= '. gettype($param_val) . ' || ';
			array_push($listFields, $param_name .' = "'. $param_val .'"');
		}
	}
}

$listToSet = implode(', ', $listFields);

$query .= $listToSet.' WHERE id='.$_POST['id'].';';
//echo $query;
//echo print_r($listFields);

if ($conn->query( $query ) === TRUE){
	echo json_encode( array(
		'msg' => 'Registro editado correctamente'
	) );
} else{
	echo json_encode( array(
		'error' => 'Ocurrio un error al editar el registro'
	) );
}
?>