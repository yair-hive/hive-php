<?php
$seat_belongs['create'] = function(){
    check_parameters(['project_name', 'seat_id', 'guest_id']);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);   
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "";
    $query_string .= "DELETE FROM belong WHERE guest='{$guest_id}';";
    $query_string .= "DELETE FROM belong WHERE seat='{$seat_id}';";
    $query_string .= "INSERT INTO belong(guest, seat, project) VALUES('{$guest_id }', '{$seat_id}', '{$project_id}');";
    db_post_multi($query_string);
};
$seat_belongs['get_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);  
    $query_string = "SELECT * FROM belong WHERE project='{$project_id}'";
    return db_get($query_string);
};
$seat_belongs['check'] = function(){
    check_parameters(['guest_id']);  
    $guest_id = $_POST['guest_id'];
    $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
    if(check_not_exists_f($query_string)){
        return ['exist' => false];
    }else{
        return ['exist' => true];
    }

};
$seat_belongs['delete_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['projct_name'];
    $project_id = get_project_id($project_name);  
    $query_string = "DELETE FROM belong WHERE project='{$project_id}'";
    return db_get($query_string);
};