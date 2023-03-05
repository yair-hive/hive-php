<?php
$seats_groups['create'] = function(){
    check_parameters(['group_name', 'from_row', 'from_col', 'to_row', 'to_col', 'map_name', 'project_name']);
    $group_name = $_POST['group_name'];
    $from_row = $_POST['from_row'];
    $from_col = $_POST['from_col'];
    $to_row = $_POST['to_row'];
    $to_col = $_POST['to_col'];
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);
    $query_string = "INSERT INTO seats_groups(name, from_row, from_col, to_row, to_col, map) VALUES('{$group_name}', '{$from_row}', '{$from_col}', '{$to_row}', '{$to_col}', '{$map_id}')";
    return db_post($query_string);
};
$seats_groups['get_all'] = function(){
    check_parameters(['map_name', 'project_name']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);
    $query_string = "SELECT * FROM seats_groups WHERE map = '{$map_id}'";
    return db_get($query_string);
};
$seats_groups['delete'] = function(){};
$seats_groups['update'] = function(){}; 