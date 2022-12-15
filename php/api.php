<?php 
$allowedOrigins = [
   'http://localhost',
   'http://localhost:3000' 
];
 
if(in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)){
    $http_origin = $_SERVER['HTTP_ORIGIN'];
}else{
    $http_origin = "*";
}
header("Access-Control-Allow-Origin: $http_origin");
session_start();

$NEW_POST = json_decode(file_get_contents('php://input'), true);

$mysql_conf = parse_ini_file('../mysql_conf.ini');
$connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);

include_once 'actions/functions.php';
include_once 'actions/map_actions.php';
include_once 'actions/seat_actions.php';
include_once 'actions/guest_actions.php';
include_once 'actions/user_actions.php';
include_once 'actions/seat_groups.php';
include_once 'actions/tag_actions.php';

$actions['map'] = $map_actions;
$actions['seat'] = $seat_actions;
$actions['guest'] = $guest_actions;
$actions['user'] = $user_actions;
$actions['tag'] = $tags_actions;
$actions['seat_groups'] = $seat_groups;
 
if(!empty($_POST['category']) && !empty($_POST['action']) || !empty($NEW_POST['category']) && !empty($NEW_POST['action'])){
    if(!empty($_POST['category']) && !empty($_POST['action'])){
        $category = $_POST['category'];
        $action = $_POST['action'];
    }
    if(!empty($NEW_POST['category']) && !empty($NEW_POST['action'])){
        $category = $NEW_POST['category'];
        $action = $NEW_POST['action'];
    }
    if(array_key_exists($category, $actions)){
        if(array_key_exists($action, $actions[$category])){
            $actions[$category][$action]();
        }else{
            $respons['msg'] = 'action dont exists';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'category dont exists';
        print_r(json_encode($respons));
    }
}else{
    $respons['msg'] = 'parameter misseng';
    print_r(json_encode($respons));
}
