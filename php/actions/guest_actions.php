<?php

$guest_actions['create'] = function(){
    $allwod = false;
    if(!empty($_SESSION['permissions'])){
        foreach($_SESSION['permissions'] as $corrent){
            if($corrent == "writing"){
                $allwod = true;
            }
        } 
    }
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $guest_group = $_POST['guest_group']; 
    $map_name = $_POST['map_name'];
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);     
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $results['id'];      
    if(!empty($first_name) && !empty($last_name) && !empty($guest_group)){
        global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
        $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$map_id}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) == 0){
                $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group}', '{$map_id}')";
                if(mysqli_query($connection, $query_string)){
                    $respons['msg'] = 'all ok';
                    print_r(json_encode($respons));
                }else{
                    $respons['msg'] = 'db error';
                    print_r(json_encode($respons));
                }
            }else{
                $respons['msg'] = 'allrdy axist';
                print_r(json_encode($respons));
            }
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'faild empty';
        print_r(json_encode($respons));
    }
};
$guest_actions['get_all'] = function(){
    $allwod = false;
    if(!empty($_SESSION['permissions'])){
        foreach($_SESSION['permissions'] as $corrent){
            if($corrent == "read"){
                $allwod = true;
            }
        } 
    }
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);     
    $map_name = $_POST['map_name'];
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);     
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $results['id'];  
    $query_string = "SELECT * FROM guests WHERE belong='{$map_id}'";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $guests_list = array();
        foreach($results as $guest){
            $guest_array['first_name'] = $guest['first_name'];
            $guest_array['last_name'] = $guest['last_name'];
            $guest_array['id'] = $guest['id'];
            $guest_array['group'] = $guest['guest_group'];
            $guests_list[] = $guest_array;
        }
        $guests_list_json = json_encode($guests_list);
        print_r($guests_list_json);
    }else{
        echo 'sql error';
    }
};
$guest_actions['add'] = function(){
    $allwod = false;
    if(!empty($_SESSION['permissions'])){
        foreach($_SESSION['permissions'] as $corrent){
            if($corrent == "writing"){
                $allwod = true;
            }
        } 
    }
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
    $map_name = $_POST['map_name'];  
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $map_results['id'];
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) != 0){
        $query_string = "DELETE FROM belong WHERE guest='{$guest_id}'";
        mysqli_query($connection, $query_string);
    }
    $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) != 0){
        $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
        mysqli_query($connection, $query_string);
    }
    $query_string = "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$map_id}')";
    if(!mysqli_query($connection, $query_string)){
        echo 'sql error';
    }else{
        echo 'all good';
    }
};
$guest_actions['check_belong'] = function(){
    if(!empty($_POST['guest_id'])){
        $guest_id = $_POST['guest_id'];
        global $mysql_conf;
        $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
        $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $respons['msg'] = 'true';
                print_r(json_encode($respons));
            }else{
                $respons['msg'] = 'false';
                print_r(json_encode($respons));
            }
        }
    }   
};
