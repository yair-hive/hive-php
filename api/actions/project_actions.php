<?php 
$project_actions['create'] = function(){
    check_parameters(['name']);
    $name = $_POST['name'];
    $query_string = "INSERT INTO projects (name) VALUES ('{$name}')";
    db_post($query_string);
};
$project_actions['get'] = function(){
    $query_string = "SELECT * FROM projects";
    return db_get($query_string);
};