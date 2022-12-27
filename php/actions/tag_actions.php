<?php
$tags_actions['add_request'] = function(){
    global $NEW_POST;
    global $connection;
    $guest_id = $NEW_POST['guest_id'];
    $request_id = $NEW_POST['tag_id'];
    $map_id = $NEW_POST['map_id'];
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}' AND request = '{$request_id}'";
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) == 0){
        $query_string = "INSERT INTO guests_requests(guest, request, belong) VALUES('{$guest_id}', '{$request_id}', '{$map_id}')";
        db_post($query_string);
    }
};
$tags_actions['get_requests'] = function(){
    global $NEW_POST;
    $guest_id = $NEW_POST['guest_id'];
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}'";
    return db_get($query_string);
};
$tags_actions['delete_tag'] = function(){
    global $NEW_POST;
    global $connection;
    $tag_id = $NEW_POST['tag_id'];
    $query_string_tag = "DELETE FROM tags WHERE id = '{$tag_id}'";
    mysqli_query($connection, $query_string_tag);
    $query_string_requests = "DELETE FROM guests_requests WHERE request = '{$tag_id}'";
    mysqli_query($connection, $query_string_requests);
    $query_string_belongs = "DELETE FROM seat_groups_belong WHERE group_id = '{$tag_id}'";
    mysqli_query($connection, $query_string_belongs);
};
$tags_actions['get_all_tags'] = function(){
    global $NEW_POST;
    $map_id = $NEW_POST['map_id'];
    $query_string = "SELECT * FROM tags WHERE belong = '{$map_id}'";
    return db_get($query_string);
};