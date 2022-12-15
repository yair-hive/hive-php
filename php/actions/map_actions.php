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
    if(allowed("reading")){    
        $query_string = "SELECT map_name FROM maps";
        db_get($query_string, true);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$map_actions['get'] = function(){
    if(allowed("reading")){
        $map_name = $_POST['map_name'];
        global $connection;        
        $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};