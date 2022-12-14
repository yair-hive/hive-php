<?php
$tags_actions['add_request'] = function(){
    global $NEW_POST;
    $guest_id = $NEW_POST['guest_id'];
    $request_id = $NEW_POST['tag_id'];
    $query_string = "INSERT INTO guests_requests(guest, request) VALUES('{$guest_id}', '{$request_id}')";
    db_post($query_string);
};
$tags_actions['get_requests'] = function(){
    global $NEW_POST;
    $guest_id = $NEW_POST['guest_id'];
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}'";
    db_get($query_string);
};