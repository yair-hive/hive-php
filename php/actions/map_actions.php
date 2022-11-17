<?php
$map_actions['get_all'] = function(){
    if(allowed("reading")){
        global $connection;     
        $query_string = "SELECT map_name FROM maps";
        if($result = mysqli_query($connection, $query_string)){
            $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
            $new_results_array = array();
            foreach($results as $row){
                $new_results_array[] = $row['map_name'];
            }
            $json_results = json_encode($new_results_array);
            print_r($json_results);
        }
    }else{
        $respons['msg'] = $_SESSION;
        print_r(json_encode($respons));
    }
};
$map_actions['get'] = function(){
    if(allowed("reading")){
        $map_name = $_POST['map_name'];
        global $connection;        
        $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
        if($result = mysqli_query($connection, $query_string)){
            $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
            $map_results_json = json_encode($map_results);
            print_r($map_results_json);
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$map_actions['create'] = function(){
    if(allowed('writing')){
        $map_name = $_POST['map_name'];
        $rows_number = $_POST['rows_number'];
        $columns_number = $_POST['columns_number']; 
        if(!empty($map_name) && !empty($rows_number) && !empty($columns_number)){
        global $connection;     
            $query_string = "INSERT INTO maps(map_name, rows_number, columns_number) VALUES('{$map_name}', '{$rows_number}', '{$columns_number}')";
            if(mysqli_query($connection, $query_string)){
                echo 'all good';
            }else{
                echo 'db error';
            }
        }else{
            echo 'faild empty';
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};