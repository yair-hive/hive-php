<?php
$seat_groups['create'] = function(){
    $name = $_POST['name'];
    $score = $_POST['score'];
    $query_string = "INSERT INTO seats_groups(group_name, score) VALUES('{$name}', '{$score}')";
    db_post($query_string);
};
$seat_groups['get_id'] = function(){
    $name = $_POST['name'];
    $query_string = "SELECT id FROM seats_groups WHERE group_name = '{$name}'";
    db_get($query_string);
};
$seat_groups['get_name'] = function(){
    $id = $_POST['id'];
    $query_string = "SELECT group_name FROM seats_groups WHERE id = '{$id}'";
    db_get($query_string);
};
$seat_groups['add_belong'] = function(){
    $seat = $_POST['seat'];
    $group = $_POST['group'];
    $map = $_POST['map'];
    $query_string = "INSERT INTO seat_groups_belong(seat, group_name, belong) VALUES('{$seat}', '{$group}', '{$map}')";
    db_post($query_string);
};
$seat_groups['get_groups'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT group_name FROM seat_groups_belong WHERE belong = '{$map_id}'";
    db_get($query_string);
};
$seat_groups['get_seats'] = function(){
    $map_id = $_POST['map_id'];
    $group_name = $_POST['group_name'];
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_name = '{$group_name}'";
    db_get($query_string);
};
$seat_groups['add_ob'] = function(){
    $map = $_POST["map"];
    $name = $_POST["name"];
    $from_row = $_POST["from_row"];
    $from_col = $_POST["from_col"];
    $to_row = $_POST["to_row"];
    $to_col = $_POST["to_col"];
    $query_string = "INSERT INTO map_obs(ob_name, from_row, from_col, to_row, to_col, belong) VALUES('{$name}', '{$from_row}', '{$from_col}', '{$to_row}', '{$to_col}', '{$map}')";
    db_post($query_string);
};