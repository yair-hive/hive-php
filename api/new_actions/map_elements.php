<?php
$map_elements['create'] = function(){
    check_parameters(['map_name', 'project_name', 'element_name', 'from_row', 'from_col', 'to_row', 'to_col']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name); 
    $element_name = $_POST["element_name"];
    $from_row = $_POST["from_row"];
    $from_col = $_POST["from_col"];
    $to_row = $_POST["to_row"];
    $to_col = $_POST["to_col"];
    $query_string = "INSERT INTO map_elements(name, from_row, from_col, to_row, to_col, map) VALUES('{$element_name}', '{$from_row}', '{$from_col}', '{$to_row}', '{$to_col}', '{$map_id}')";
    db_post($query_string);
};
$map_elements['get_all'] = function(){
    check_parameters(['map_name', 'project_name']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);  
    $query_string = "SELECT * FROM map_elements WHERE map = '{$map_id}'";
    return db_get($query_string);
};
$map_elements['delete'] = function(){
    check_parameters(['elements_ids']);
    $elemens_ids = json_decode($_POST['elements_ids']);
    $query_string = "";
    foreach($elemens_ids as $id){
        $query_string .= "DELETE FROM map_elements WHERE id = '{$id}'";
    }
    db_post_multi($query_string);
};