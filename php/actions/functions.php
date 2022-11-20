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