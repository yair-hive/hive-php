<?php

$seat_actions['create'] = function(){
    if(allowed('writing')){  
        $map_id = $_POST['map_id'];    
        $row_num = $_POST['row'];
        $col_num = $_POST['col'];
        $query_string = "INSERT INTO seats(belong, row_num, col_num) VALUES('{$map_id}', '{$row_num}', '{$col_num}')";
        db_post($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$seat_actions['get_all'] = function(){
    if(allowed("reading")){     
        $map_id = $_POST['map_id'];
        $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$seat_actions['get_belong'] = function(){
    if(allowed("reading")){
        $seat_id = $_POST['seat_id'];
        $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$seat_actions['get_number'] = function(){
    if(allowed("reading")){
        $seat_id = $_POST['seat_id'];
        $query_string = "SELECT * FROM seats WHERE id='{$seat_id}'";
        db_get($query_string);
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
        db_post($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$seat_actions['delete_belong'] = function(){
    if(allowed('writing')){
        if(!empty($_POST['seat_id'])){
            $seat_id = $_POST['seat_id'];
            $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
            db_post($query_string);
        }   
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};