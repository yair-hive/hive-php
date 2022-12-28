<?php
function createDefaultGroup($map_id, $group_name){
    global $connection; 
    $color = '#2b4e81';
    $score = 0;
    $query_string = "INSERT INTO guests_groups(group_name, color, score, belong) VALUES('{$group_name}', '{$color}', '{$score}', '{$map_id}')";
    mysqli_query($connection, $query_string);
}
function getGroupId($map_id, $group_name){
    $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$map_id}'";
    $result = db_get_one($query_string);
    print_r($result);
    if($result){
        return $result['id'];
    }else{
        createDefaultGroup($map_id, $group_name);
        $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$map_id}'";
        $result = db_get_one($query_string);
        return $result['id'];
    }
}
$guest_actions['create'] = function () {
    global $NEW_POST;
    check_parameters(['first_name', 'last_name', 'guest_group'], $NEW_POST);
    $first_name = $NEW_POST['first_name'];
    $last_name = $NEW_POST['last_name'];
    $guest_group = $NEW_POST['guest_group']; 
    $map_id = $NEW_POST['map_id']; 
    $guest_group_id = getGroupId($map_id, $guest_group);
    $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$map_id}'";
    check_exists($query_string);               
    $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$map_id}')";
    db_post($query_string);
};
$guest_actions['get_all'] = function () {
    global $NEW_POST;
    check_parameters(['map_id'], $NEW_POST);
    $map_id = $NEW_POST['map_id'];  
    $query_string = "SELECT * FROM guests WHERE belong='{$map_id}'";
    return db_get($query_string);
};
$guest_actions['get_all_and_ditails'] = function () {
    global $NEW_POST;
    check_parameters(['map_id'], $NEW_POST);
    $map_id = $NEW_POST['map_id']; 
    $guests_query = "SELECT * FROM guests WHERE belong='{$map_id}'";
    $belongs_query = "SELECT * FROM belong WHERE map_belong = '{$map_id}'";
    $seats_query = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $tags_query = "SELECT * FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'tag'";
    $requests_query = "SELECT * FROM guests_requests WHERE belong = '{$map_id}'";
    $guests_results = db_get($guests_query);
    $belongs_results = db_get($belongs_query);
    $seats_results = db_get($seats_query);
    $tags_results = db_get($tags_query);
    $requests_results = db_get($requests_query);
    $new_belongs_results = [];
    foreach($belongs_results as $belong){
        $new_belongs_results[$belong['guest']] = $belong;
    }
    $new_seats_results = [];
    foreach($seats_results as $seat){
        $new_seats_results[$seat['id']] = $seat;
    }
    $new_tags_results = [];
    foreach($tags_results as $tag){
        $new_tags_results[$tag['seat']] = [];
    }
    foreach($tags_results as $tag){
        $new_tags_results[$tag['seat']][] = $tag;
    }
    $new_requests_results = [];
    foreach($requests_results as $request){
        $new_requests_results[$request['guest']] = [];
    }
    foreach($requests_results as $request){
        $new_requests_results[$request['guest']][] = $request['request'];
    }
    $new_guests_results = [];
    foreach($guests_results as $guest){
        $guest_id = $guest['id'];
        if(array_key_exists($guest_id, $new_belongs_results)){
            $seat_id = $new_belongs_results[$guest_id]['seat'];
            $seat = $new_seats_results[$seat_id];
            if(array_key_exists($seat_id, $new_tags_results)){
                $seat['tags'] = $new_tags_results[$seat_id];
            }
            $guest['seat'] = $seat;
        }
        if(array_key_exists($guest_id, $new_requests_results)){
            $guest['requets'] = $new_requests_results[$guest_id];
        }
        $new_guests_results[] = $guest;
    }
    return $new_guests_results;
};
$guest_actions['get_belong'] = function(){
    check_parameters(['guest_id']);
    $guest_id = $_POST['guest_id'];
    $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
    return db_get($query_string); 
};
$guest_actions['add'] = function () {
    check_parameters(['map_id', 'seat_id', 'guest_id']);  
    $map_id = $_POST['map_id'];
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
    db_post($query_string);
    $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
    check_exists($query_string);
    $query_string = "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$map_id}')";
    db_post($query_string);
};
$guest_actions['update_belong'] = function () {
    check_parameters(['map_id', 'seat_id', 'guest_id']);
    $map_id = $_POST['map_id'];
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "";
    $query_string .= "DELETE FROM belong WHERE guest='{$guest_id}';";
    $query_string .= "DELETE FROM belong WHERE seat='{$seat_id}';";
    $query_string .= "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$map_id}');";
    db_post_multi($query_string);
};
$guest_actions['update_belong_multiple'] = function(){  
    check_parameters(['map_id']);
    $map_id = $_POST['map_id'];
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $row){
        $guest = $row->guest;
        $seat = $row->seat;
        $query_string .= "DELETE FROM belong WHERE guest='{$guest}';";
        $query_string .= "DELETE FROM belong WHERE seat='{$seat}';";
        $query_string .= "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest}', '{$seat}', '{$map_id}');";
    }
    db_post_multi($query_string);
};
$guest_actions['delete'] = function () {
    check_parameters(['guest_id']);
    $guest_id = $_POST['guest_id']; 
    $query_string = "DELETE FROM guests WHERE id='{$guest_id}'";
    db_post($query_string);
    $query_string = "DELETE FROM belong WHERE guest='{$guest_id}'";
    db_post($query_string);
};
$guest_actions['update'] = function () {
    check_parameters(['first_name', 'last_name', 'guest_group', 'guest_id', 'map_id']);
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $guest_group = $_POST['guest_group'];
    $guest_id = $_POST['guest_id'];
    $map_id = $_POST['map_id'];  
    $guest_group_id = getGroupId($map_id, $guest_group);
    $query_string = "UPDATE guests SET first_name = '{$first_name}', last_name = '{$last_name}', guest_group = '{$guest_group_id}', belong = '{$map_id}' WHERE id= '{$guest_id}'";
    db_post($query_string);
};
$guest_actions['get_all_groups'] = function () {
    check_parameters(['map_id']);       
    $map_id = $_POST['map_id'];  
    $query_string = "SELECT * FROM guests_groups WHERE belong='{$map_id}'";
    return db_get($query_string);
};
$guest_actions['delete_group'] = function () {
    check_parameters(['group_id']);
    $group_id = $_POST['group_id'];  
    $query_string = "DELETE FROM guests_groups WHERE id='{$group_id}'";
    db_post($query_string);
};
$guest_actions['update_group_color'] = function () {
    check_parameters(['group_id', 'color']);
    $group_id = $_POST['group_id'];
    $color = $_POST['color'];
    $query_string = "UPDATE guests_groups SET color = '{$color}' WHERE id = '{$group_id}'";
    db_post($query_string);
};
$guest_actions['update_group_score'] = function () {
    check_parameters(['group_id', 'score']);
    $group_id = $_POST['group_id'];
    $score = $_POST['score'];
    $query_string = "UPDATE guests_groups SET score = '{$score}' WHERE id = '{$group_id}'";
    db_post($query_string);

};
$guest_actions['update_guest_score'] = function(){
    check_parameters(['guest_id', 'score']);
    $guest_id = $_POST['guest_id'];
    $score = $_POST['score'];
    $query_string = "UPDATE guests SET score = '{$score}' WHERE id = '{$guest_id}'";
    db_post($query_string);
};
