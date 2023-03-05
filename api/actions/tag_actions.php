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
$tag_actions['add_multiple_tags'] = function () {
    $seats = json_decode($_POST['seats']);
    $tag_name = $_POST['group'];
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);
    $map_id = get_map_id($map_name, $project_name);   
    $tag_id = getTagId($tag_name, $project_id);
    if(!$tag_id){
        createDefaultTag($tag_name, $project_id);
        $tag_id = getTagId($tag_name, $project_id);
    }
    $query_string = "";
    foreach($seats as $seat){
        $query_string .= "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$tag_id}', 'tag', '{$map_id}');";
    }       
    return db_post_multi($query_string);
};
$tag_actions['get_all_belongs'] = function(){
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);  
    $query_string = "SELECT * FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'tag'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['seat']] = [];
    }
    foreach($results as $row){
        $new_results[$row['seat']][] = $row;
    }
    return $new_results;
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
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "SELECT * FROM tags WHERE belong = '{$project_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
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

//TODO mybey depracted
$tag_actions['get_belong'] = function(){
    $map_name = $_POST['map_name'];
    $map_id = get_map_id($map_name);  
    $group_name = $_POST['group_name'];
    $group_id = getTagId($group_name, $map_id);
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'tag'";
    return db_get($query_string);
};