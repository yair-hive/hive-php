<?php
function db_post($query_string){
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
}
function db_get($query_string, $breake = false){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    $results = [];
    while($row = mysqli_fetch_assoc($result)){
        $results[] = $row;
    }
    return $results;
    if($breake){
        $new_results = [];
        foreach($results as $result){
            foreach($result as $item){
                $new_results[] = $item;
            }
        }
        return $new_results;
    }
}
function db_get_one($query_string){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    return mysqli_fetch_assoc($result);
}
function check_exists($query_string){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    if(mysqli_num_rows($result) != 0){
        throw new Exception('exists');
    }      
}
function check_not_exists_f($query_string){
    global $connection;
    $result = mysqli_query($connection, $query_string);
    return mysqli_num_rows($result) == 0; 
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
function create_action_log($action_name){
    $user_name = $_SESSION['user_name'];
    $query_string = "INSERT INTO actions_log(action_name, user_name) VALUES('{$action_name}', '{$user_name}')";
    db_post($query_string);
}