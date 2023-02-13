<?php

$seat_actions['create'] = function () {
    check_parameters(['map_name', 'row', 'col']);
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name); 
    $row_num = $_POST['row'];
    $col_num = $_POST['col'];
    $query_string = "INSERT INTO seats(belong, row_num, col_num) VALUES('{$map_id}', '{$row_num}', '{$col_num}')";
    db_post($query_string);
};
$seat_actions['get_all'] = function () {
    check_parameters(['map_name']);    
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name); 
    $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
};
$seat_actions['get_all_and_all'] = function(){ 
    check_parameters(['map_name']); 
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name); 
    $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
    global $connection; 
    $results = [];
    $seats_result = mysqli_query($connection, $query_string);
    while($seats_row = mysqli_fetch_assoc($seats_result)){
        $query_string = "SELECT guest FROM belong WHERE seat = '{$seats_row['id']}'";
        $belong_result = mysqli_query($connection, $query_string);
        while($belong_row = mysqli_fetch_assoc($belong_result)){
            $query_string = "SELECT * FROM guests WHERE id = '{$belong_row['guest']}'";
            $guest_result = mysqli_query($connection, $query_string);
            while($guest_row = mysqli_fetch_assoc($guest_result)){
                $seats_row['guest'] = $guest_row;
            }
        }
        $results[] = $seats_row;
    }
    return $results;
};
$seat_actions['get_belong'] = function () {
    check_parameters(['map_name']);
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name); 
    $query_string = "SELECT * FROM belong WHERE map_belong='{$map_id}'";
    // $results = db_get($query_string);
    // $new_results = [];
    // foreach($results as $row){
    //     $new_results[$row['seat']] = $row;
    // }
    // return $new_results;
    return db_get($query_string);
};
$seat_actions['get_number'] = function(){
    check_parameters(['seat_id']);
    $seat_id = $_POST['seat_id'];
    $query_string = "SELECT * FROM seats WHERE id='{$seat_id}'";
    return db_get($query_string);
};
$seat_actions['add_number'] = function () {
    check_parameters(['seat_id', 'seat_number']);
    $seat_id = $_POST['seat_id'];
    $seat_number = $_POST['seat_number'];
    $query_string = "UPDATE seats SET seat_number = '{$seat_number}' WHERE seats.id = '{$seat_id}';";
    db_post($query_string);
};
$seat_actions['delete_belong'] = function () {
    check_parameters(['seat_id']);
    $seat_id = $_POST['seat_id'];
    $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
    db_post($query_string);
};
$seat_actions['create_multiple'] = function () {
    check_parameters(['map_name', 'data']);
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name);    
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $seat){
        $query_string .= "INSERT INTO seats(belong, row_num, col_num) VALUES('{$map_id}', '{$seat->row}', '{$seat->col}');";
    }       
    return db_post_multi($query_string);
};
$seat_actions['add_multiple_numbers'] = function () {
    check_parameters(['data']);  
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $seat){
        $query_string .= "UPDATE seats SET seat_number = '{$seat->number}' WHERE id = '{$seat->id}';";
    }       
    return db_post_multi($query_string);
};
$seat_actions['delete'] = function () {
    check_parameters(['seat_id']);
    $seat_id = $_POST['seat_id'];
    $query_string = "DELETE FROM seats WHERE id='{$seat_id}'";
    db_post($query_string);
    $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
    db_post($query_string);
    $query_string = "DELETE FROM seat_groups_belong WHERE seat='{$seat_id}'";
    db_post($query_string);
};