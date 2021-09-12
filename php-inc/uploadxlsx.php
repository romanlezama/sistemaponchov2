<?php 
$uploadDir = 'C:\\xampp\\htdocs\\sistemaponchov2\\excel_files\\'; 
$testsUbuntu = false;
if($testsUbuntu){
    // Ubuntu
    passthru ( "/usr/bin/python /var/www/html/sistemaponchov2/lee_excel.py '20210818120500'" );
}
else{
    $response = array( 
        'status' => 'error', 
        'message' => 'Ocurrio un error al cargar el archivo, por favor intenta nuevamente.' 
    ); 
    $uploadStatus = 0;
    $newNameDocto = date("YmdHis");
    // If form is submitted 
    if( isset($_FILES['file']) ){ 
        // Upload file 
        $uploadedFile = ''; 
        if(!empty($_FILES["file"]["name"])){ 
             
            // File path config 
            $fileName = basename($_FILES["file"]["name"]); 
            $targetFilePath = $uploadDir . $fileName; 
            $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION); 
             
            // Allow certain file formats 
            $allowTypes = array('xlsx'); 
            if(in_array($fileType, $allowTypes)){ 
                // Upload file to the server 
                $newName = $uploadDir . $newNameDocto . '.' . $fileType;
                if(move_uploaded_file($_FILES["file"]["tmp_name"], $newName)){ 
                    #$uploadedFile = $fileName; 
                    $uploadStatus = 1; 
                }else{ 
                    $uploadStatus = 0; 
                    $response['message'] = 'Sorry, there was an error uploading your file.'; 
                } 
            }else{ 
                $uploadStatus = 0; 
                $response['message'] = 'Solo se aceptan documentos de tipo xlsx'; 
            } 
        } 
         
        if($uploadStatus == 1){ 
            $response['status'] = 'ok'; 
            $response['message'] = 'Archivo cargado con exito'; 
        } 
    } 
     
    // Return response 
    if($uploadStatus == 1){
        passthru ( "C:\\Users\\ajuar\\AppData\\Local\\Programs\\Python\\Python39\\python  C:\\xampp\\htdocs\\sistemaponchov2\\lee_excel.py \"".$newNameDocto."\"" );
    } else {
        echo json_encode($response);
    }
}
?>