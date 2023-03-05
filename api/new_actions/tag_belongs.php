<?php

$tag_belongs['create'] = function(){
    check_parameters(['seats', 'tag_name', 'map_name', 'project_name']);
    $seats = json_decode($_POST['seats']);
    $tag_name = $_POST['tag_name'];
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);   
    $tag_id = get_tag_id($tag_name, $project_name);
    $query_string = "";
    foreach($seats as $seat){
        $query_string .= "INSERT INTO tag_belongs(seat, tag, map) VALUES('{$seat}', '{$tag_id}', '{$map_id}');";
    }       
    return db_post_multi($query_string);
};
$tag_belongs['get_all'] = function(){
    check_parameters(['map_name', 'project_name']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);  
    $query_string = "SELECT * FROM tag_belongs WHERE map = '{$map_id}'";
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