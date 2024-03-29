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
    $filds['add_row'] = function(){
        check_parameters(['map_name', 'project_name', 'row']);
        $project_name = $_POST['project_name'];
        $map_name = $_POST['map_name'];
        $map_id = get_map_id($map_name, $project_name);     
        $row = $_POST['row'];
        $query_string = "";
        $query_string .= "UPDATE maps SET rows_number = rows_number + 1 WHERE id = '{$map_id}';";
        $query_string .= "UPDATE SEATS SET row_num = row_num + 1 WHERE row_num > '{$row}' AND map='{$map_id}';";
        return db_post_multi($query_string);
    };
    $filds['add_col'] = function(){
        check_parameters(['map_name', 'project_name', 'col']);
        $project_name = $_POST['project_name'];
        $map_name = $_POST['map_name'];
        $map_id = get_map_id($map_name, $project_name);     
        $col = $_POST['col'];
        $query_string = "";
        $query_string .= "UPDATE maps SET columns_number = columns_number + 1 WHERE id = '{$map_id}';";
        $query_string .= "UPDATE SEATS SET col_num = col_num + 1 WHERE col_num > '{$col}' AND map='{$map_id}';";
        return db_post_multi($query_string);
    };
    $filds['delete_row'] = function(){
        check_parameters(['map_name', 'project_name', 'row']);
        $project_name = $_POST['project_name'];
        $map_name = $_POST['map_name'];
        $map_id = get_map_id($map_name, $project_name);     
        $row = $_POST['row'];
        $query_string = "";
        $query_string .= "UPDATE maps SET rows_number = rows_number - 1 WHERE id = '{$map_id}';";
        $query_string .= "DELETE FROM seats WHERE row_num = '{$row}' AND map='{$map_id}';";
        $query_string .= "UPDATE SEATS SET row_num = row_num - 1 WHERE row_num > '{$row}' AND map='{$map_id}';";
        return db_post_multi($query_string);
    };
    $filds['delete_col'] = function(){
        check_parameters(['map_name', 'project_name', 'col']);
        $project_name = $_POST['project_name'];
        $map_name = $_POST['map_name'];
        $map_id = get_map_id($map_name, $project_name);     
        $col = $_POST['col'];
        $query_string = "";
        $query_string .= "UPDATE maps SET columns_number = columns_number - 1 WHERE id = '{$map_id}';";
        $query_string .= "DELETE FROM seats WHERE col_num = '{$col}' AND map='{$map_id}';";
        $query_string .= "UPDATE SEATS SET col_num = col_num - 1 WHERE col_num > '{$col}' AND map='{$map_id}';";
        return db_post_multi($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};