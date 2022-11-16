<?php

$seat_actions['create'] = function(){
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
    $map_name = $_POST['map_name'];
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $results['id'];    
    $row_num = $_POST['row'];
    $col_num = $_POST['col'];
    $query_string = "INSERT INTO seats(belong, row_num, col_num) VALUES('{$map_id}', '{$row_num}', '{$col_num}')";
    if(!$result = mysqli_query($connection, $query_string)){
        $respons['msg'] = 'db error';
        print_r(json_encode($respons));
    }else{
        $respons['msg'] = 'all good';
        print_r(json_encode($respons));
    }
};
$seat_actions['get_all'] = function(){
    $map_name = $_POST['map_name'];
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    if($result = mysqli_query($connection, $query_string)){
        $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    $map_id = $map_results['id'];
    $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
    if($seats_result = mysqli_query($connection, $query_string)){
        $seats_results = mysqli_fetch_all($seats_result, MYSQLI_ASSOC);
    }
    $arr_con = count($seats_results);
    for($i = 0; $i < $arr_con; $i++){
        $seat_id = $seats_results[$i]['id'];
        $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result)){
                $belong_result = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $seats_results[$i]['guest_id'] = $belong_result['guest'];
            }                    
        }
    }
    $seats_results_json = json_encode($seats_results);
    print_r($seats_results_json);
};
$seat_actions['add_number'] = function(){
    echo $_POST['seat_number'];
    $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
    $seat_id = $_POST['seat_id'];
    $seat_number = $_POST['seat_number'];
    $query_string = "UPDATE seats SET seat_number = '{$seat_number}' WHERE seats.id = '{$seat_id}';";
    if(!mysqli_query($connection, $query_string)){
        echo 'sql error';
    }else{
        echo 'all good';
    }
};