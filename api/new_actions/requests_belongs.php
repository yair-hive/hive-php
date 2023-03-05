<?php

$requests_belongs['create'] = function(){
    check_parameters(['guest_id', 'tag_id', 'project_name']);
    $guest_id = $_POST['guest_id'];
    $request_id = $_POST['tag_id'];
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}' AND request = '{$request_id}'";
    check_exists($query_string);
    $query_string = "INSERT INTO guests_requests(guest, request, project) VALUES('{$guest_id}', '{$request_id}', '{$project_id}')";
    db_post($query_string);
};
$requests_belongs['delete'] = function(){
    check_parameters(['request_id']);
    $request_id = $_POST['request_id'];
    $query_string = "DELETE FROM guests_requests WHERE id = '{$request_id}'";
    db_post($query_string);
};
$requests_belongs['get_all'] = function(){
    check_parameters(['project_name']); 
    $project_name = $_POST['project_name'];   
    $project_id = get_project_id($project_name);
    $query_string = "SELECT * FROM guests_requests WHERE project = '{$project_id}'";
    return db_get($query_string);
};