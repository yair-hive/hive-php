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
header("Access-Control-Allow-Credentials: true");
session_start();

$NEW_POST = json_decode(file_get_contents('php://input'), true);

$mysql_conf = parse_ini_file('../mysql_conf.ini');
$connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);

if(array_key_exists('action', $_POST)){
    // if($_POST['action'] == 'test'){
    //     try {
    //         throw new Exception('op');
    //         // $query_string = "SELECT * FROM pop";
    //         // if(!$result = mysqli_query($connection, $query_string)){
    //         //     $res['msg'] = mysqli_error($connection);
    //         //     print_r(json_encode($res));
    //         // }
    //     } catch (Exception $e) {
    //         print_r($e->getMessage());
    //     }
    // }
    if($_POST['action'] == 'test'){
        try {
            $query_string = "SELECT * FROM pop";
            if(!$result = mysqli_query($connection, $query_string)){
                $res['msg'] = mysqli_error($connection);
                print_r(json_encode($res));
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }
}
include_once 'actions/functions.php';
include_once 'actions/map_actions.php';
include_once 'actions/seat_actions.php';
include_once 'actions/guest_actions.php';
include_once 'actions/user_actions.php';
include_once 'actions/map_col_actions.php';
include_once 'actions/tag_actions.php';
include_once 'actions/map_element_actions.php';

$actions['map'] = $map_actions;
$actions['seat'] = $seat_actions;
$actions['guest'] = $guest_actions;
$actions['user'] = $user_actions;
$actions['tag'] = $tag_actions;
$actions['map_element'] = $map_element_actions;
$actions['seat_groups'] = $map_col_actions;
 
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
            try {
                $data = $actions[$category][$action]();
                if($data){
                    $respons['data'] = $data;
                }else{
                    $respons['data'] = [];
                }
                $respons['msg'] = 'ok';
                print_r(json_encode($respons));
                $action_name = $action . ' ' . $category;
                if (!preg_match("/^get/", $action_name, $match)){
                    create_action_log($action_name);
                }
            } catch (Exception $e) {
                $respons['msg'] = $e->getMessage();
                print_r(json_encode($respons));
            }
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
