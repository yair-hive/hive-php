<?php
$tag_actions['add_request'] = function(){
    global $NEW_POST;
    global $connection;
    $guest_id = $NEW_POST['guest_id'];
    $request_id = $NEW_POST['tag_id'];
    $project_name = $NEW_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}' AND request = '{$request_id}'";
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) == 0){
        $query_string = "INSERT INTO guests_requests(guest, request, belong) VALUES('{$guest_id}', '{$request_id}', '{$project_id}')";
        db_post($query_string);
    }
};
$tag_actions['delete_request'] = function(){
    global $NEW_POST;
    check_parameters(['request_id'], $NEW_POST);
    $request_id = $NEW_POST['request_id'];
    $query_string = "DELETE FROM guests_requests WHERE id = '{$request_id}'";
    db_post($query_string);
};
$tag_actions['get_requests'] = function(){
    global $NEW_POST;
    check_parameters(['map_name'], $NEW_POST);    
    $map_name = $NEW_POST['map_name'];
    $map_id = get_map_id($map_name); 
    $query_string = "SELECT * FROM guests_requests WHERE belong = '{$map_id}'";
    return db_get($query_string);
};