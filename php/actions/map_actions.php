<?php
function removeRow($map_id){
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_rows = $results[0]['rows_number'];
    $map_rows--;
    $query_string = "UPDATE maps SET rows_number = '{$map_rows}' WHERE id='{$map_id}'";
    return db_post_f($query_string);
}
function removeCol($map_id){
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_cols = $results[0]['columns_number'];
    $map_cols--;
    $query_string = "UPDATE maps SET columns_number = '{$map_cols}' WHERE id='{$map_id}'";
    return db_post_f($query_string);
}
function addRow($map_id){
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_rows = $results[0]['rows_number'];
    $map_rows++;
    $query_string = "UPDATE maps SET rows_number = '{$map_rows}' WHERE id='{$map_id}'";
    return db_post_f($query_string);
}
function addCol($map_id){
    $query_string = "SELECT * FROM maps WHERE id = '{$map_id}'";
    $results = db_get_f($query_string);
    $map_cols = $results[0]['columns_number'];
    $map_cols++;
    $query_string = "UPDATE maps SET columns_number = '{$map_cols}' WHERE id='{$map_id}'";
    return db_post_f($query_string);
}
function seatMoveRowUp($row, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $seats = db_get_f($query_string);
    $query_string = '';
    foreach($seats as $seat){
        $row_num = $seat['row_num'];
        $seat_id = $seat['id'];
        if($row_num > $row){
            $row_num--;
            $query_string .= "UPDATE seats SET row_num = '{$row_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
function seatMoveColUp($col, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $seats = db_get_f($query_string);
    $query_string = '';
    foreach($seats as $seat){
        $col_num = $seat['col_num'];
        $seat_id = $seat['id'];
        if($col_num > $col){
            $col_num--;
            $query_string .= "UPDATE seats SET col_num = '{$col_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
function seatMoveRowDown($row, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $seats = db_get_f($query_string);
    $query_string = '';
    foreach($seats as $seat){
        $row_num = $seat['row_num'];
        $seat_id = $seat['id'];
        if($row_num > $row){
            $row_num++;
            $query_string .= "UPDATE seats SET row_num = '{$row_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
function seatMoveColDown($col, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}'";
    $seats = db_get_f($query_string);
    $query_string = '';
    foreach($seats as $seat){
        $col_num = $seat['col_num'];
        $seat_id = $seat['id'];
        if($col_num > $col){
            $col_num++;
            $query_string .= "UPDATE seats SET col_num = '{$col_num}' WHERE id = '{$seat_id}';";
        }
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
function deleteSeat($seat_id){
    $query_string = '';
    $query_string .= "DELETE FROM seats WHERE id = '{$seat_id}';";
    $query_string .= "DELETE FROM belong WHERE seat = '{$seat_id}';";
    $query_string .= "DELETE FROM seat_groups_belong WHERE seat = '{$seat_id}';";
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
function seatDeleteByCol($col, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}' AND col_num = '{$col}'";
    $results = db_get_f($query_string);
    $query_string = '';
    foreach($results as $seat){
        $seat_id = $seat['id'];
        deleteSeat($seat_id);
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
    true;
}
function seatDeleteByRow($row, $map_id){
    $query_string = "SELECT * FROM seats WHERE belong = '{$map_id}' AND row_num = '{$row}'";
    $results = db_get_f($query_string);
    $query_string = '';
    foreach($results as $seat){
        $seat_id = $seat['id'];
        deleteSeat($seat_id);
    }
    if(!empty($query_string)){
        db_post_multi_f($query_string);
    }
}
$map_actions['create'] = function () {
    global $NEW_POST;
    check_parameters(['map_name', 'rows_number', 'columns_number'], $NEW_POST);
    $map_name = $NEW_POST['map_name'];
    $rows_number = $NEW_POST['rows_number'];
    $columns_number = $NEW_POST['columns_number'];              
    $query_string = "INSERT INTO maps(map_name, rows_number, columns_number) VALUES('{$map_name}', '{$rows_number}', '{$columns_number}')";
    db_post($query_string);
};
$map_actions['get_all'] = function(){   
    $query_string = "SELECT map_name FROM maps";
    db_get($query_string, true);
};
$map_actions['get'] = function () {
    check_parameters(['map_name']);
    $map_name = $_POST['map_name'];     
    $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
    db_get($query_string);
};
$map_actions['delete_row'] = function(){
    check_parameters(['map_id, row']);
    $map_id = $_POST['map_id'];
    $row = $_POST['row'];
    removeRow($map_id); 
    seatDeleteByRow($row, $map_id);
    seatMoveRowUp($row, $map_id);
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
};
$map_actions['add_row'] = function(){
    check_parameters(['map_id, row']);
    $map_id = $_POST['map_id'];
    $row = $_POST['row'];
    addRow($map_id); 
    seatMoveRowDown($row, $map_id);
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
};
$map_actions['delete_col'] = function(){
    check_parameters(['map_id, col']);
    $map_id = $_POST['map_id'];
    $col = $_POST['col'];
    removeCol($map_id); 
    seatDeleteByCol($col, $map_id);
    seatMoveColUp($col, $map_id);
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
};
$map_actions['add_col'] = function () {
    check_parameters(['map_id, col']);
    $map_id = $_POST['map_id'];
    $col = $_POST['col'];
    addCol($map_id); 
    seatMoveColDown($col, $map_id);
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
};