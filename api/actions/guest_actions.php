<?php
function createDefaultGroup($project_id, $group_name){
    global $connection; 
    $color = '#2b4e81';
    $score = 0;
    $query_string = "INSERT INTO guests_groups(group_name, color, score, belong) VALUES('{$group_name}', '{$color}', '{$score}', '{$project_id}')";
    mysqli_query($connection, $query_string);
}
function getGroupId($project_id, $group_name){
    $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$project_id}'";
    $result = db_get_one($query_string);
    if($result){
        return $result['id'];
    }else{
        createDefaultGroup($project_id, $group_name);
        $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$project_id}'";
        $result = db_get_one($query_string);
        return $result['id'];
    }
}
$guest_actions['create'] = function () {
    global $NEW_POST;
    check_parameters(['first_name', 'last_name', 'guest_group', 'project'], $NEW_POST);
    $first_name = $NEW_POST['first_name'];
    $last_name = $NEW_POST['last_name'];
    $guest_group = $NEW_POST['guest_group']; 
    $project = $NEW_POST['project'];
    $project_id = get_project_id($project); 
    $guest_group_id = getGroupId($project_id, $guest_group);
    $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$project_id}'";
    check_exists($query_string);               
    $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$project_id}')";
    db_post($query_string);
};
$guest_actions['create_multi'] = function () {
    global $NEW_POST;
    check_parameters(['data', 'project'], $NEW_POST);
    $data = $NEW_POST['data'];
    $project = $NEW_POST['project'];
    $project_id = get_project_id($project); 
    $query_string = "";
    foreach($data as $guest){
        $first_name = $guest[0];
        $last_name = $guest[1];
        $guest_group = $guest[2];
        $guest_group_id = getGroupId($project_id, $guest_group);
        $s_query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$project_id}'";
        if(check_not_exists_f($s_query_string)){
            $query_string .= "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$project_id}');";
        }
    }
    db_post_multi($query_string);
};
$guest_actions['get_all'] = function () {
    global $NEW_POST;
    check_parameters(['project'], $NEW_POST);
    $project = $NEW_POST['project'];
    $project_id = get_project_id($project);  
    $query_string = "SELECT * FROM guests WHERE belong='{$project_id}'";
    return db_get($query_string);
};
$guest_actions['get_belongs'] = function(){
    check_parameters(['project']);
    $project = $_POST['project'];
    $project_id = get_project_id($project); 
    $query_string = "SELECT * FROM belong WHERE map_belong='{$project_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['guest']] = $row;
    }
    return $new_results;
};
$guest_actions['add'] = function () {
    check_parameters(['project', 'seat_id', 'guest_id']);  
    $project = $_POST['project'];
    $project_id = get_project_id($project);   
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
    db_post($query_string);
    $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
    check_exists($query_string);
    $query_string = "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$project_id}')";
    db_post($query_string);
};
$guest_actions['update_belong'] = function () {
    check_parameters(['project', 'seat_id', 'guest_id']);
    $project = $_POST['project'];
    $project_id = get_project_id($project);   
    $seat_id = $_POST['seat_id'];
    $guest_id = $_POST['guest_id'];
    $query_string = "";
    $query_string .= "DELETE FROM belong WHERE guest='{$guest_id}';";
    $query_string .= "DELETE FROM belong WHERE seat='{$seat_id}';";
    $query_string .= "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$project_id}');";
    db_post_multi($query_string);
};
$guest_actions['update_belong_multiple'] = function(){  
    check_parameters(['project']);
    $project = $_POST['project'];
    $project_id = get_project_id($project);   
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $row){
        $guest = $row->guest;
        $seat = $row->seat;
        $query_string .= "DELETE FROM belong WHERE guest='{$guest}';";
        $query_string .= "DELETE FROM belong WHERE seat='{$seat}';";
        $query_string .= "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest}', '{$seat}', '{$project_id}');";
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
    check_parameters(['first_name', 'last_name', 'guest_group', 'guest_id', 'project']);
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $guest_group = $_POST['guest_group'];
    $guest_id = $_POST['guest_id'];
    $project = $_POST['project'];
    $project_id = get_project_id($project);     
    $guest_group_id = getGroupId($project_id, $guest_group);
    $query_string = "UPDATE guests SET first_name = '{$first_name}', last_name = '{$last_name}', guest_group = '{$guest_group_id}', belong = '{$project_id}' WHERE id= '{$guest_id}'";
    db_post($query_string);
};
$guest_actions['get_all_groups'] = function () {
    check_parameters(['project']);       
    $project = $_POST['project'];
    $project_id = get_project_id($project); 
    $query_string = "SELECT * FROM guests_groups WHERE belong='{$project_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
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
$guest_actions['update_first_name'] = function(){
    check_parameters(['guest_id', 'first_name']);
    $guest_id = $_POST['guest_id'];
    $first_name = $_POST['first_name'];
    $query_string = "UPDATE guests SET first_name = '{$first_name}' WHERE id = '{$guest_id}'";
    db_post($query_string);
};
$guest_actions['update_last_name'] = function(){
    check_parameters(['guest_id', 'last_name']);
    $guest_id = $_POST['guest_id'];
    $last_name = $_POST['last_name'];
    $query_string = "UPDATE guests SET last_name = '{$last_name}' WHERE id = '{$guest_id}'";
    db_post($query_string);
};
$guest_actions['update_group_name'] = function(){
    check_parameters(['guest_id', 'group_name', 'project']);
    $guest_id = $_POST['guest_id'];
    $group_name = $_POST['group_name'];
    $project = $_POST['project'];
    $project_id = get_project_id($project);  
    $group_id = getGroupId($project_id, $group_name);
    print_r($group_id);
    $query_string = "UPDATE guests SET guest_group = '{$group_id}' WHERE id = '{$guest_id}'";
    db_post($query_string);
};
