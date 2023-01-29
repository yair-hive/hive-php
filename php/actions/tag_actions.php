<?php
function getTagId($group_name, $map_id){
    global $connection;
    $query_string = "SELECT id FROM tags WHERE tag_name = '{$group_name}' AND belong = '{$map_id}'";
    $result = mysqli_query($connection, $query_string);
    $result = mysqli_fetch_assoc($result);
    if($result){
        return $result['id'];
    }else{
        return false;
    }
};
function createDefaultTag($tag_name, $map){
    $name = $tag_name;
    $color = '#2b4e81';
    $score = 0;
    $belong = $map;
    global $connection;
    $query_string = "INSERT INTO tags(tag_name, color, score, belong) VALUES('{$name}', '{$color}', '{$score}', '{$belong}')";
    mysqli_query($connection, $query_string);
}
$tag_actions['add_tag'] = function(){
    $seat = $_POST['seat'];
    $group_name = $_POST['group'];
    $map = $_POST['map'];
    $group_id = getTagId($group_name, $map);
    if($group_id){
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'tag', '{$map}')";
        db_post($query_string);
    }else{
        createDefaultTag($group_name, $map);
        $group_id = getTagId($group_name, $map);
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'tag', '{$map}')";
        db_post($query_string);
    }
};
$tag_actions['get_all_belongs'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT * FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'tag'";
    return db_get($query_string);
};
$tag_actions['update_tag_color'] = function () {
    check_parameters(['color', 'id']);
    $color = $_POST['color'];
    $id = $_POST['id'];
    $query_string = "UPDATE tags SET color = '{$color}' WHERE  id = '{$id}'";
    db_post($query_string);
};
$tag_actions['update_tag_name'] = function(){
    $name = $_POST['name'];
    $id = $_POST['id'];
    $query_string = "UPDATE tags SET tag_name = '{$name}' WHERE  id = '{$id}'";
    db_post($query_string);
};
$tag_actions['add_request'] = function(){
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
$tag_actions['get_requests'] = function(){
    global $NEW_POST;
    $guest_id = $NEW_POST['guest_id'];
    $query_string = "SELECT * FROM guests_requests WHERE guest = '{$guest_id}'";
    return db_get($query_string);
};
$tag_actions['delete_tag'] = function(){
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
$tag_actions['get_all_tags'] = function(){
    global $NEW_POST;
    $map_id = $NEW_POST['map_id'];
    $query_string = "SELECT * FROM tags WHERE belong = '{$map_id}'";
    return db_get($query_string);
};

//TODO mybey depracted
$tag_actions['get_belong'] = function(){
    $map_id = $_POST['map_id'];
    $group_name = $_POST['group_name'];
    $group_id = getTagId($group_name, $map_id);
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'tag'";
    return db_get($query_string);
};