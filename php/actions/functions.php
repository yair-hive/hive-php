<?php
function allowed($permission){
    if(!empty($_SESSION['permissions'])){
        return in_array($permission, $_SESSION['permissions']);
    }else{
        return false;
    }
}
function db_post($query_string){
    global $connection;
    if(mysqli_query($connection, $query_string)){
        $respons['msg'] = 'ok';
        print_r(json_encode($respons));
    }else{
        $respons['msg'] = 'db error';
        print_r(json_encode($respons));
    }
}
function db_get($query_string, $breake = false){
    global $connection; 
    if($result = mysqli_query($connection, $query_string)){
        $arr_con = mysqli_num_rows($result);            
        $results = [];
        while($row = mysqli_fetch_assoc($result)){
            $results[] = $row;
        }
        $respons['msg'] = 'ok';
        $respons['data'] = $results;
        if($breake){
            $new_results = [];
            foreach($results as $result){
                foreach($result as $item){
                    $new_results[] = $item;
                }
            }
            $respons['msg'] = 'ok';
            $respons['data'] = $new_results;
        }
        $json_results = json_encode($respons);
        print_r($json_results);
    }else{
        $respons['msg'] = 'db error';
        print_r(json_encode($respons));
    }
}