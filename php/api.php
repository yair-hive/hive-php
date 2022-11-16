<?php 
header("Access-Control-Allow-Origin: *");
session_start();

$mysql_conf = parse_ini_file('../mysql_conf.ini');

include_once 'actions/map_actions.php';
include_once 'actions/seat_actions.php';
include_once 'actions/guest_actions.php';
include_once 'actions/all_actions.php';

$actions['map'] = $map_actions;
$actions['seat'] = $seat_actions;
$actions['guest'] = $guest_actions;
$actions['all'] = $all_actions;
 
if(!empty($_POST['category']) && !empty($_POST['action'])){
    $category = $_POST['category'];
    $action = $_POST['action'];
    if(array_key_exists($category, $actions)){
        if(array_key_exists($action, $actions[$_POST['category']])){
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
