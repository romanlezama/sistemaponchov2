<?php
include("db.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$str_info = $_POST['folios'];
$folios = json_decode($str_info);

$sql = "SELECT * FROM tickets WHERE folio in (".implode(', ', $folios).");";
$result = $conn->query($sql);
$clientes = array(
  'info_folios' => array(),
  'total_folios' => array()
);

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    // array_push($clientes, array(
    //   'idCliente' => $row["idCliente"], 
    //   'txtAccepted' => $row["txtAccepted"])
    // );
    $clientes['info_folios'][ $row['folio'] ] = $row;
    array_push($clientes['total_folios'], $row['folio']);
  }
}
echo json_encode($clientes);
?>