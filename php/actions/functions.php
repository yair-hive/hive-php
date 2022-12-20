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
function db_post_multi($query_string){
    global $connection;
    if(mysqli_multi_query($connection, $query_string)){
        do {
            if($result = mysqli_store_result($connection)){
                mysqli_free_result($result);
            }
        } while(mysqli_next_result($connection));
        
        if(mysqli_error($connection)) {
            $respons['msg'] = 'db error';
            $respons['data'] = mysqli_error($connection);
            print_r(json_encode($respons));
        }else{
            $respons['msg'] = 'ok';
            print_r(json_encode($respons));
        }
    }
    mysqli_close($connection);
}
function db_post_multi_f($query_string){
    global $connection;
    if(mysqli_multi_query($connection, $query_string)){
        do {
            if($result = mysqli_store_result($connection)){
                mysqli_free_result($result);
            }
        } while(mysqli_next_result($connection));
        
        if(mysqli_error($connection)) {
            return false;
        }else{
            return true;
        }
    }
    mysqli_close($connection);
}
function db_get($query_string, $breake = false){
    global $connection; 
    if($result = mysqli_query($connection, $query_string)){
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