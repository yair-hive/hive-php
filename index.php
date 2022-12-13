<?php
$query_string = 'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "hive"';
$mysql_conf = parse_ini_file('mysql_conf.ini');
$connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS']);
$result = mysqli_query($connection, $query_string);
if(mysqli_num_rows($result) != 0){
    header("Location: http://localhost/hive-php/html/edit_map.html");
}else{
    header("Location: http://localhost/hive-php/php/updat.php");
}