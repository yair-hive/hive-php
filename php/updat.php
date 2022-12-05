<?php

$mysql_conf = parse_ini_file('../mysql_conf.ini');

$conn = new mysqli($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'] ,$mysql_conf['DB_PASS']);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "CREATE DATABASE hive";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully  <br />";
} else {
  echo "Error creating database: " . $conn->error;
}
$conn->close();

$connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
$files = 
['seats.sql',
'maps.sql',
'guests.sql',
'belong.sql',
'permissions.sql',
'guests_groups.sql',
'seats_groups.sql',
'seat_groups_belong.sql',
'users.sql',];

function update($filename, $link){
    $tempLine = '';
    // Read in the full file
    $lines = file("mysql/".$filename);
    // Loop through each line
    foreach ($lines as $line) {

        // Skip it if it's a comment
        if (substr($line, 0, 2) == '--' || $line == '')
            continue;

        // Add this line to the current segment
        $tempLine .= $line;
        // If its semicolon at the end, so that is the end of one query
        if (substr(trim($line), -1, 1) == ';')  {
            // Perform the query
            mysqli_query($link, $tempLine) or print("Error in " . $tempLine .":". mysqli_error());
            // Reset temp variable to empty
            $tempLine = '';
        }
    }
    echo $filename." imported successfully <br />";
}

foreach($files as $filename){
    update($filename, $connection);
}
header("Location: http://localhost/hive-php/html/maps.html");
?>