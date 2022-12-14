<?php
$tags_actions['add_request'] = function(){
    $guest_id = $_POST['guest'];
    $request_id = $_POST['request'];
    $map_id = $_POST['map'];
    $query_string = "INSERT INTO guests_requests(guest, request, belong) VALUES('{$guest_id}', '{$request_id}', '{$map_id}')";
    db_post($query_string);
};