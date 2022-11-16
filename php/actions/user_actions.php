<?php
$user_actions['login'] = function(){
    global $mysql_conf;
    $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);               
    if(!empty($_POST['user_name'])){
        $user_name = $_POST['user_name']; 
        $password = $_POST['password'];
        $query_string = "SELECT * FROM users WHERE user_name='{$user_name}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $user_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                if(password_verify($password, $user_results['password'])){                    
                    $_SESSION['user_name'] = $_POST['user_name'];
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