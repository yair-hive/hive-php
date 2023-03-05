<?php 
 
$http_origin = $_SERVER['HTTP_ORIGIN'];
header("Access-Control-Allow-Origin: $http_origin");
header("Access-Control-Allow-Credentials: true");
session_start();

$mysql_conf = parse_ini_file('../mysql_conf.ini');
$connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);

include_once 'new_actions/functions.php';
include_once 'new_actions/maps.php';
include_once 'new_actions/seats.php';
include_once 'new_actions/guests.php';
include_once 'new_actions/tags.php';
include_once 'new_actions/map_elements.php';
include_once 'new_actions/projects.php';
include_once 'new_actions/guest_groups.php';
include_once 'new_actions/seat_belongs.php';
include_once 'new_actions/seats_groups.php';
include_once 'new_actions/tag_belongs.php';
include_once 'new_actions/requests_belongs.php';

$actions['maps'] = $maps;
$actions['seats'] = $seats;
$actions['guests'] = $guests;
$actions['tags'] = $tags;
$actions['map_elements'] = $map_elements;
$actions['projects'] = $projects;
$actions['guest_groups'] = $guest_groups;
$actions['seat_belongs'] = $seat_belongs;
$actions['tag_belongs'] = $tag_belongs;
$actions['requests_belongs'] = $requests_belongs;
$actions['seats_groups'] = $seats_groups;

try{
    if(empty($_POST['category']) || empty($_POST['action'])){
        throw new Exception('parameter misseng');
    }
    $category = $_POST['category'];
    $action = $_POST['action'];
    if(!array_key_exists($category, $actions)){
        throw new Exception('category dont exists');;
    }
    if(!array_key_exists($action, $actions[$category])){
        throw new Exception('action dont exists');
    }
    $respons['data'] = $actions[$category][$action]();
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
}catch(Exception $e){
    $respons['msg'] = $e->getMessage();
    print_r(json_encode($respons));
    header($_SERVER["SERVER_PROTOCOL"] . " 500");
}