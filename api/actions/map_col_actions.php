<?php

function getSeatsGroupId($group_name, $project_id){
    global $connection;
    $query_string = "SELECT id FROM seats_groups WHERE group_name = '{$group_name}' AND belong = '{$project_id}'";
    $result = mysqli_query($connection, $query_string);
    $result = mysqli_fetch_assoc($result);
    if($result){
        return $result['id'];
    }else{
        return false;
    }
}
function createDefaultSeatGroup($group_name, $project_id){
    $name = $group_name;
    $score = 0;
    $belong = $project_id;
    global $connection;
    $query_string = "INSERT INTO seats_groups(group_name, score, belong) VALUES('{$name}', '{$score}', '{$belong}')";
    mysqli_query($connection, $query_string);
}
$map_col_actions['add_col'] = function(){
    global $connection;
    $seat = $_POST['seat'];
    $group_name = $_POST['group'];
    $project = $_POST['project'];
    $project_id = get_project_id($project);
    $group_id = getSeatsGroupId($group_name, $project_id);
    if($group_id){
        $query_string = "SELECT * FROM seat_groups_belong WHERE seat = '{$seat}' AND group_id = '{$group_id}' AND group_type = 'col' AND belong = '{$project_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) == 0){
            $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'col', '{$project_id}')";
            db_post($query_string);
        }else{
            $respons['msg'] = 'allrdy axist';
            print_r(json_encode($respons));
        }
    }else{
        createDefaultSeatGroup($group_name, $project_id);
        $group_id = getSeatsGroupId($group_name, $project_id);
        $query_string = "SELECT * FROM seat_groups_belong WHERE seat = '{$seat}' AND group_id = '{$group_id}' AND group_type = 'col' AND belong = '{$project_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) == 0){
            $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'col', '{$project_id}')";
            db_post($query_string);
        }else{
            $respons['msg'] = 'allrdy axist';
            print_r(json_encode($respons));
        }
    }
};
$map_col_actions['get_groups_cols'] = function(){
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name);  
    $query_string = "SELECT group_name FROM seats_groups WHERE belong = '{$map_id}'";
    return db_get($query_string);
};
$map_col_actions['get_seats_cols'] = function(){
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name);  
    $group_name = $_POST['group_name'];
    $group_id = getSeatsGroupId($group_name, $map_id);
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'col'";
    return db_get($query_string);
};
$map_col_actions['get_seats_by_cols'] = function(){
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name);  
    $query_string = "SELECT * FROM seats_groups WHERE belong = '{$map_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $group){
        $group_id = $group['id'];
        $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'col'";
        $seats = db_get($query_string);
        $new_seats = [];
        foreach($seats as $seat){
            $new_seats[] = $seat['seat'];
        }
        $new_results[] = $new_seats;
    }
    return $new_results;
};