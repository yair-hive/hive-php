<?php

//זמני בלבד
$permissions_list[] = 'super';
$permissions_list[] = 'reading';
$permissions_list[] = 'writing';

$user_actions['login'] = function(){
    global $connection;              
    if(!empty($NEW_POST['user_name'])){
        $user_name = $NEW_POST['user_name']; 
        $password = $NEW_POST['password'];
        $query_string = "SELECT * FROM users WHERE user_name='{$user_name}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                $user_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
                if(password_verify($password, $user_results['password'])){
                    $permissions = [];
                    $user_id = $user_results['id'];
                    $query_string = "SELECT permission FROM permissions WHERE user='{$user_id}'";
                    if($result = mysqli_query($connection, $query_string)){
                        if(mysqli_num_rows($result) != 0){
                            while($row = mysqli_fetch_assoc($result)){
                                $permissions[] = $row['permission'];
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
    global $connection;  
    $query_string = "SELECT * FROM users";
    if($result = mysqli_query($connection, $query_string)){
        $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $new_results_array = array();
        foreach($results as $row){
            $user_id = $row['id'];
            $permissions = [];
            $query_string = "SELECT permission FROM permissions WHERE user='{$user_id}'";
            if($result = mysqli_query($connection, $query_string)){
                if(mysqli_num_rows($result) != 0){
                    while($new_row = mysqli_fetch_assoc($result)){
                        $permissions[] = $new_row['permission'];
                    }
                    $row['permissions'] = $permissions;
                }else{
                    $row['permissions'] = false;
                }
            }else{
                $row['permissions'] = false;
            }
            $new_results_array[] = $row;
        }
        $json_results = json_encode($new_results_array);
        print_r($json_results);
    }
};
$user_actions['logout'] = function(){
    $_SESSION['user_name'] = '';
    $_SESSION['permissions'] = '';
    $respons['msg'] = 'all ok';
    print_r(json_encode($respons));
};
$user_actions['sginup'] = function(){
    global $connection;  
    if(!empty($_POST['user_name']) && !empty($_POST['password'])){
        $user_name = $_POST['user_name'];
        $password = $_POST['password'];
        $password = password_hash($password, PASSWORD_DEFAULT);
        $query_string = "INSERT INTO users(user_name, password) VALUES('{$user_name}', '{$password}')";
        db_post($query_string);
    }else{
        $respons['msg'] = $_POST;
        print_r(json_encode($respons));
    }
};
$user_actions['add_permission'] = function(){  
    global $connection;
    if(allowed("super")){               
        if(!empty($_POST['user_id']) && !empty($_POST['permission'])){
            $user_id = $_POST['user_id'];
            $permission = $_POST['permission'];        
            $query_string = "INSERT INTO permissions(user, permission) VALUES('{$user_id}', '{$permission}')";
            db_post($query_string);
        }
    }else{
        $respons['msg'] = 'faild';
        print_r(json_encode($respons));
    }
};
$user_actions['get_permissions_list'] = function(){
    global $permissions_list;
    print_r(json_encode($permissions_list));
};
$user_actions['get_permission'] = function(){
    global $connection;    
    if(!empty($_POST['user_id'])){
        $user_id = $_POST['user_id'];
        $permissions = [];
        $query_string = "SELECT permission FROM permissions WHERE user='{$user_id}'";
        if($result = mysqli_query($connection, $query_string)){
            if(mysqli_num_rows($result) != 0){
                while($row = mysqli_fetch_assoc($result)){
                    $permissions[] = $row['permission'];
                }
                print_r(json_encode($permissions));
            }else{
                $respons['msg'] = false;
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