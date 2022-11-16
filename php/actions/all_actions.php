<?php

$all_actions['get_guest_seat_num'] = function(){
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
    $map_name = $_POST['map_name'];  
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $map_results['id'];
    $query_string = "SELECT * FROM belong WHERE map_belong = '{$map_id}'";
    if($result = mysqli_query($connection, $query_string)){
        $belong_results = mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
    $query_string = "SELECT * FROM guests";
    if($result = mysqli_query($connection, $query_string)){
        $guests_results = mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
    $query_string = "SELECT * FROM seats";
    if($result = mysqli_query($connection, $query_string)){
        $seats_results = mysqli_fetch_all($result, MYSQLI_ASSOC);

    }
    foreach($belong_results as $i => $bel){
        foreach($guests_results as $guest){                    
            if($guest['id'] == $bel['guest']){
                $belong_results[$i]['guest_first_name'] = $guest['first_name'];
                $belong_results[$i]['guest_last_name'] = $guest['last_name'];
                $belong_results[$i]['guest_group'] = $guest['guest_group'];
            }
        }
    }
    foreach($belong_results as $i => $bel){
        foreach($seats_results as $seat){
            if($seat['id'] == $bel['seat']){
                $belong_results[$i]['seat_num'] = $seat['seat_number'];
            }
        }
    }
    $list_json = json_encode($belong_results);
    print_r($list_json);
};
$all_actions['login'] = function(){
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);             
    if(!empty($_POST['user_name'])){
        $user_name = $_POST['user_name']; 
        $query_string = "SELECT * FROM users WHERE user_name='{$user_name}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $user_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                if($_POST['password'] == $user_results['password']){
                    $_SESSION['user_name'] = $_POST['user_name'];
                    $respons['msg'] = 'all ok';
                    print_r(json_encode($respons));
                }else{
                    $respons['msg'] = 'login faild';
                    print_r(json_encode($respons));
                }
            }else{
                $respons['msg'] = 'no user';
                print_r(json_encode($respons));
            }
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'parameter misseng';
        print_r(json_encode($respons));
    }
};
$all_actions['get_user'] = function(){
    if(!empty($_SESSION['user_name'])){
        $respons['msg'] = 'all ok';
        $respons['user_name'] = $_SESSION['user_name'];
        print_r(json_encode($respons));
    }else{
        $respons['msg'] = 'parameter misseng';
        print_r(json_encode($respons));
    }
};
$all_actions['logout'] = function(){
    $_SESSION['user_name'] = '';
    $respons['msg'] = 'all ok';
    print_r(json_encode($respons));
};
$all_actions['sginup'] = function(){
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
    if(!empty($_POST['user_name']) && !empty($_POST['password'])){
        $user_name = $_POST['user_name'];
        $password = $_POST['password'];
        $query_string = "INSERT INTO users(user_name, password) VALUES('{$user_name}', '{$password}')";
        if(mysqli_query($connection, $query_string)){
            $respons['msg'] = 'all ok';
            print_r(json_encode($respons));
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = $_POST;
        print_r(json_encode($respons));
    }
};