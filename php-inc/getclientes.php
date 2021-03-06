<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM clientes ORDER BY nombreCliente ASC";
$result = $conn->query($sql);

$clientes = array();

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $clientes[ str_replace("_", " ", $row["nombreCliente"]) ] = $row["id"];
  }
}
echo json_encode($clientes)
?>