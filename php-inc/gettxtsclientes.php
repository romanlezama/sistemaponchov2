<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM txtsclientes";
$result = $conn->query($sql);

$clientes = array();

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    // array_push($clientes, array(
    //   'idCliente' => $row["idCliente"], 
    //   'txtAccepted' => $row["txtAccepted"])
    // );
    $clientes[ $row["txtAccepted"] ] = $row["idCliente"];
  }
}
echo json_encode($clientes)
?>