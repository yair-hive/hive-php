<?php
$user_actions['login'] = function(){
    global $mysql_conf;
    $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);               
    if(!empty($_POST['user_name'])){
        $user_name = $_POST['user_name']; 
        $password = $_POST['password'];
        $query_string = "SELECT * FROM users WHERE user_name='{$user_name}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $user_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                if(password_verify($password, $user_results['password'])){
                    $permissions = [];
                    $user_id = $user_results['id'];
                    $query_string = "SELECT * FROM permissions WHERE user='{$user_id}'";
                    if($result = mysqli_query($connection, $query_string)){
                        if(mysqli_num_rows($result) != 0){
                            $permissions_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                            foreach($permissions_results as $permission){
                                $permissions[] = $permission;
                            }
                        }
                    }
                    $_SESSION['user_name'] = $_POST['user_name'];
                    $_SESSION['permissions'] = $permissions;
                    $respons['msg'] = 'all ok';
                    print_r(json_encode($respons));
                }else{
                    $respons['msg'] = 'login faild';
                    print_r(json_encode($respons));
                }
            }else{
                $respons['msg'] = 'no user';
                print_r(json_encode($respons));
            }
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'parameter misseng';
        print_r(json_encode($respons));
    }
};
$user_actions['get'] = function(){
    if(!empty($_SESSION['user_name'])){
        $respons['msg'] = 'all ok';
        $respons['user_name'] = $_SESSION['user_name'];
        print_r(json_encode($respons));
    }else{
        $respons['msg'] = 'parameter misseng';
        print_r(json_encode($respons));
    }
};
$user_actions['get_all'] = function(){
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
    $query_string = "SELECT user_name FROM users";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $new_results_array = array();
        foreach($results as $row){
            $new_results_array[] = $row['user_name'];
        }
        $json_results = json_encode($new_results_array);
        print_r($json_results);
    }
};
$user_actions['logout'] = function(){
    $_SESSION['user_name'] = '';
    $respons['msg'] = 'all ok';
    print_r(json_encode($respons));
};
$user_actions['sginup'] = function(){
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
    if(!empty($_POST['user_name']) && !empty($_POST['password'])){
        $user_name = $_POST['user_name'];
        $password = $_POST['password'];
        $password = password_hash($password, PASSWORD_DEFAULT);
        $query_string = "INSERT INTO users(user_name, password) VALUES('{$user_name}', '{$password}')";
        if(mysqli_query($connection, $query_string)){
            $respons['msg'] = 'all ok';
            print_r(json_encode($respons));
        }else{
            $respons['msg'] = 'db error';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = $_POST;
        print_r(json_encode($respons));
    }
};
$user_actions['add_permission'] = function(){
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);               
    if(!empty($_POST['user_name']) && !empty($_POST['permission'])){
        $user_name = $_POST['user_name'];
        $permission = $_POST['permission'];
        $query_string = "SELECT * FROM users WHERE user_name='{$user_name}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $user_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $user_id = $user_results['id'];
            }
        }
        $allwod = false;
        if(!empty($_SESSION['permissions'])){
            foreach($_SESSION['permissions'] as $corrent){
                if($corrent == "super"){
                    $allwod = true;
                }
            } 
        }
        if($allwod){
            $query_string = "INSERT INTO permissions(user, permission) VALUES('{$user_id}', '{$permission}')";
            if(mysqli_query($connection, $query_string)){
                $respons['msg'] = 'all ok';
                print_r(json_encode($respons));
            }else{
                $respons['msg'] = 'db error';
                print_r(json_encode($respons));
            }
        }else{
            $respons['msg'] = 'faild';
            print_r(json_encode($respons));
        }
    }
};