<?php
$map_actions['create'] = function(){
    if(allowed('writing')){
        global $NEW_POST;
        $map_name = $NEW_POST['map_name'];
        $rows_number = $NEW_POST['rows_number'];
        $columns_number = $NEW_POST['columns_number']; 
        if(!empty($map_name) && !empty($rows_number) && !empty($columns_number)){                
            $query_string = "INSERT INTO maps(map_name, rows_number, columns_number) VALUES('{$map_name}', '{$rows_number}', '{$columns_number}')";
            db_post($query_string);
        }else{
            $respons['msg'] = 'faild empty';
            print_r(json_encode($respons));;
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$map_actions['get_all'] = function(){
    // if(allowed("reading")){    
        $query_string = "SELECT map_name FROM maps";
        db_get($query_string, true);
    // }else{
    //     $respons['msg'] = 'dinaid';
    //     print_r(json_encode($respons));
    // }
};
$map_actions['get'] = function(){
    // if(allowed("reading")){
        $map_name = $_POST['map_name'];
        global $connection;        
        $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
        db_get($query_string);
    // }else{
    //     $respons['msg'] = 'dinaid';
    //     print_r(json_encode($respons));
    // }
};
$map_actions['delete_row'] = function(){
    $map_id = $_POST['map_id'];
    $row = $_POST['row'];
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_rows = $results[0]['rows_number'];
    $map_rows--;
    $query_string = "UPDATE maps SET rows_number = '{$map_rows}' WHERE id='{$map_id}'";
    db_post_f($query_string);
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $results = db_get_f($query_string);
    $new_results = [];
    $query_string = '';
    foreach($results as $seat){
        $row_num = $seat['row_num'];
        $seat_id = $seat['id'];
        if($row_num == $row){
            $query_string .= "DELETE FROM seats WHERE id = '{$seat_id}';";
            $query_string .= "DELETE FROM belong WHERE seat = '{$seat_id}';";
        }
        if($row_num > $row){
            $row_num--;
            $query_string .= "UPDATE seats SET row_num = '{$row_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi($query_string);
    }else{
        $respons['msg'] = 'ok';
        print_r(json_encode($respons));
    }
    print_r($_POST);
};
$map_actions['add_row'] = function(){
    $map_id = $_POST['map_id'];
    $row = $_POST['row'];
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_rows = $results[0]['rows_number'];
    $map_rows++;
    $query_string = "UPDATE maps SET rows_number = '{$map_rows}' WHERE id='{$map_id}'";
    db_post_f($query_string);
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $results = db_get_f($query_string);
    $new_results = [];
    $query_string = '';
    foreach($results as $seat){
        $row_num = $seat['row_num'];
        $seat_id = $seat['id'];
        if($row_num > $row){
            $row_num++;
            $query_string .= "UPDATE seats SET row_num = '{$row_num}' WHERE id = '{$seat_id}';";
        }
    }
    db_post_multi($query_string);
};
$map_actions['delete_col'] = function(){
    $map_id = $_POST['map_id'];
    $col = $_POST['col'];
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_cols = $results[0]['columns_number'];
    $map_cols--;
    $query_string = "UPDATE maps SET columns_number = '{$map_cols}' WHERE id='{$map_id}'";
    db_post_f($query_string);
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $results = db_get_f($query_string);
    $new_results = [];
    $query_string = '';
    settype($col, 'int');
    foreach($results as $seat){
        $col_num = $seat['col_num'];
        $seat_id = $seat['id'];
        if($col_num == $col){
            $query_string .= "DELETE FROM seats WHERE id = '{$seat_id}';";
            $query_string .= "DELETE FROM belong WHERE seat = '{$seat_id}';";
        }
        if($col_num > $col){
            $col_num--;
            $query_string .= "UPDATE seats SET col_num = '{$col_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi($query_string);
    }else{
        $respons['msg'] = 'ok';
        print_r(json_encode($respons));
    }
    print_r($_POST);
};
$map_actions['add_col'] = function(){
    $map_id = $_POST['map_id'];
    $col = $_POST['col'];
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_cols = $results[0]['columns_number'];
    $map_cols++;
    $query_string = "UPDATE maps SET columns_number = '{$map_cols}' WHERE id='{$map_id}'";
    db_post_f($query_string);
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $results = db_get_f($query_string);
    $new_results = [];
    $query_string = '';
    foreach($results as $seat){
        $col_num = $seat['col_num'];
        $seat_id = $seat['id'];
        if($col_num > $col){
            $col_num++;
            $query_string .= "UPDATE seats SET col_num = '{$col_num}' WHERE id = '{$seat_id}';";
        }
    }
    db_post_multi($query_string);
};