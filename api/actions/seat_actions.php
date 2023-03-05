<?php

$seat_actions['create'] = function () {
    check_parameters(['map_name', 'row', 'col', 'project']);
    $map_name = $_POST['map_name'];
    $project = $_POST['project'];
    $map_id = get_map_id($map_name); 
    $project_id = get_project_id($project); 
    $row_num = $_POST['row'];
    $col_num = $_POST['col'];
    $query_string = "INSERT INTO seats(belong, row_num, col_num, project) VALUES('{$map_id}', '{$row_num}', '{$col_num}', '{$project_id}')";
    db_post($query_string);
};
$seat_actions['get_all'] = function () {
    check_parameters(['map_name', 'project_name']);    
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);  
    $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
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
$seat_actions['delete_belong'] = function () {
    check_parameters(['seat_id']);
    $seat_id = $_POST['seat_id'];
    $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
    db_post($query_string);
};
$seat_actions['create_multiple'] = function () {
    check_parameters(['map_name', 'project', 'data']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project'];
    $map_id = get_map_id($map_name, $project_name);      
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $seat){
        $query_string .= "INSERT INTO seats(belong, row_num, col_num, project) VALUES('{$map_id}', '{$seat->row}', '{$seat->col}', '{$map_id}');";
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
$seat_actions['delete_multiple'] = function(){
    check_parameters(['seats_ids']);
    $seats_ids = json_decode($_POST['seats_ids']);
    $query_string = "";
    foreach($seats_ids as $id){
        $query_string .= "DELETE FROM seats WHERE id='{$id}';";
        $query_string .= "DELETE FROM belong WHERE seat='{$id}';";
        $query_string .= "DELETE FROM seat_groups_belong WHERE seat='{$id}';";
    }
    db_post_multi($query_string);
};