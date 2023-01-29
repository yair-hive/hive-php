<?php

$map_element_actions['add'] = function(){
    $map = $_POST["map"];
    $name = $_POST["name"];
    $from_row = $_POST["from_row"];
    $from_col = $_POST["from_col"];
    $to_row = $_POST["to_row"];
    $to_col = $_POST["to_col"];
    $query_string = "INSERT INTO map_obs(ob_name, from_row, from_col, to_row, to_col, belong) VALUES('{$name}', '{$from_row}', '{$from_col}', '{$to_row}', '{$to_col}', '{$map}')";
    db_post($query_string);
};
$map_element_actions['get'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT * FROM map_obs WHERE belong = '{$map_id}'";
    return db_get($query_string);
};
$map_element_actions['delete'] = function(){
    $ob_id = $_POST['ob_id'];
    $query_string = "DELETE FROM map_obs WHERE id = '{$ob_id}'";
    db_post($query_string);
};