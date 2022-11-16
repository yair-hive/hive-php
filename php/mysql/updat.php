<?php
// Name of the data file
$filename = 'maps.sql';
// MySQL host
include_once 'mysql_conf.php';

// Create connection
$conn = new mysqli(DB_HOST ,DB_USER ,DB_PASS);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE hive";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully  <br />";
} else {
  echo "Error creating database: " . $conn->error;
}

$conn->close();

// Connect to MySQL server
$link = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   


$tempLine = '';
// Read in the full file
$lines = file($filename);
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
 echo "maps Tables imported successfully <br />";

// Name of the data file
$filename = 'seats.sql';
// MySQL host

// Connect to MySQL server
$link = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   


$tempLine = '';
// Read in the full file
$lines = file($filename);
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
 echo "seats Tables imported successfully <br />";

 // Name of the data file
$filename = 'guests.sql';
// MySQL host

// Connect to MySQL server
$link = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   


$tempLine = '';
// Read in the full file
$lines = file($filename);
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
 echo "guests Tables imported successfully <br />";

  // Name of the data file
$filename = 'belong.sql';
// MySQL host

// Connect to MySQL server
$link = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   


$tempLine = '';
// Read in the full file
$lines = file($filename);
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
 echo "belong Tables imported successfully <br />";

$filename = 'users.sql';
// MySQL host

// Connect to MySQL server
$link = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   


$tempLine = '';
// Read in the full file
$lines = file($filename);
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
 echo "users Tables imported successfully <br />";
?>