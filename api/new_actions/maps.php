<?php
$maps['create'] = function(){
    check_parameters(['map_name', 'rows', 'cols', 'project_name']);
    $map_name = $_POST['map_name'];
    $rows_number = $_POST['rows'];
    $columns_number = $_POST['cols']; 
    $project_id = get_project_id($_POST['project_name']);
    $query_string = "SELECT * FROM maps WHERE map_name = '{$map_name}' AND project = '{$project_id}'";
    check_exists($query_string);             
    $query_string = "INSERT INTO maps(map_name, rows_number, columns_number, project) VALUES('{$map_name}', '{$rows_number}', '{$columns_number}', '{$project_id}')";
    db_post($query_string);
};
$maps['get_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['project_name']; 
    $project_id = get_project_id($project_name);    
    $query_string = "SELECT * FROM maps WHERE project='{$project_id}'";
    return db_get($query_string);
};
$maps['get'] = function(){
    check_parameters(['map_name', 'project_name']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name']; 
    $map_id = get_map_id($map_name, $project_name);    
    $query_string = "SELECT * FROM maps WHERE id='{$map_id}'";
    return db_get_one($query_string);
};
$maps['update'] = function(){
    $filds['cols_to'] = function(){
        check_parameters(['map_name', 'project_name', 'to']);
        $map_name = $_POST['map_name'];
        $project_name = $_POST['project_name'];
        $to = $_POST['to']; 
        $map_id = get_map_id($map_name, $project_name);    
        $query_string = "UPDATE maps SET cols_to = '{$to}' WHERE id = '{$map_id}'";
        return db_post($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};