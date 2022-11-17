<?php

$seat_actions['create'] = function(){
    if(allowed('writing')){
        global $connection;    
        $map_id = $_POST['map_id'];    
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
    }
};
$seat_actions['get_all'] = function(){
    if(allowed("reading")){
        global $connection;        
        $map_id = $_POST['map_id'];
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
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$seat_actions['add_number'] = function(){
    if(allowed('writing')){
        echo $_POST['seat_number'];
        global $connection;        
        $seat_id = $_POST['seat_id'];
        $seat_number = $_POST['seat_number'];
        $query_string = "UPDATE seats SET seat_number = '{$seat_number}' WHERE seats.id = '{$seat_id}';";
        if(!mysqli_query($connection, $query_string)){
            echo 'sql error';
        }else{
            echo 'all good';
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};