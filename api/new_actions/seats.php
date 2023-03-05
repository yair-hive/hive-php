<?php
$seats['create'] = function(){
    check_parameters(['map_name', 'project_name', 'data']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);
    $map_id = get_map_id($map_name, $project_name);      
    $data = json_decode($_POST['data']);
    $query_string = "";
    foreach($data as $seat){
        $query_string .= "INSERT INTO seats(belong, row_num, col_num, map, project) VALUES('{$map_id}', '{$seat->row}', '{$seat->col}', '{$map_id}', '{$project_id}');";
    }       
    return db_post_multi($query_string);
};
$seats['get'] = function(){
    check_parameters(['map_name', 'project_name']);
    $map_name = $_POST['map_name'];
    $project_name = $_POST['project_name'];
    $map_id = get_map_id($map_name, $project_name);      
    $query_string = "SELECT * FROM seats WHERE map = '{$map_id}'";
    return db_get($query_string);
};
$seats['get_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);
    $query_string = "SELECT * FROM seats WHERE project = '{$project_id}'";
    return db_get($query_string);
};
$seats['delete'] = function(){
    check_parameters(['seats_ids']);
    $seats_ids = json_decode($_POST['seats_ids']);
    $query_string = "";
    foreach($seats_ids as $id){
        $query_string .= "DELETE FROM seats WHERE id='{$id}';";
        $query_string .= "DELETE FROM belong WHERE seat='{$id}';";
        $query_string .= "DELETE FROM seat_groups_belong WHERE seat='{$id}';";
    }
    db_post_multi($query_string);
};
$seats['update'] = function(){
    $filds['numbers'] = function(){
        check_parameters(['seats_numbers']);  
        $data = json_decode($_POST['seats_numbers']);
        $query_string = "";
        foreach($data as $seat){
            $query_string .= "UPDATE seats SET seat_number = '{$seat->number}' WHERE id = '{$seat->id}';";
        }       
        return db_post_multi($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};