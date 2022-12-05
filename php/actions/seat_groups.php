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
    $query_string = "INSERT INTO seat_groups_belong(seat, belong) VALUES('{$seat}', '{$group}')";
    db_post($query_string);
};