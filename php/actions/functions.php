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
    mysqli_query($connection, $query_string);
    $respons['msg'] = 'ok';
    print_r(json_encode($respons));
}
function db_post_f($query_string){
    global $connection;
    return mysqli_query($connection, $query_string);
}
function db_post_multi($query_string){
    global $connection;
    mysqli_multi_query($connection, $query_string);
    do {
        if($result = mysqli_store_result($connection)){
            mysqli_free_result($result);
        }
    } while(mysqli_next_result($connection));
    mysqli_close($connection);
}
function db_post_multi_f($query_string){
    global $connection;
    mysqli_multi_query($connection, $query_string);
    do {
        if($result = mysqli_store_result($connection)){
            mysqli_free_result($result);
        }
    } while(mysqli_next_result($connection));
    mysqli_close($connection);
}
function db_get($query_string, $breake = false){
    global $connection;
    $result = mysqli_query($connection, $query_string);
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
}
function db_get_f($query_string, $breake = false){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    $results = [];
    while($row = mysqli_fetch_assoc($result)){
        $results[] = $row;
    }
    $respons = $results;
    if($breake){
        $new_results = [];
        foreach($results as $result){
            foreach($result as $item){
                $new_results[] = $item;
            }
        }
        $respons = $new_results;
    }        
    return $respons;
}
function check_exists($query_string){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) != 0){
        throw new Exception('exists');
    }      
}
function check_parameters($parameters, $req = false){
    if (!$req) {$req = $_POST;}
    foreach($parameters as $param){
        if(!array_key_exists($param, $req)){
            throw new Exception('חסר פרמטר');
        }
        if(empty($req[$param])){
            throw new Exception('חסר פרמטר');
        }
    }
}