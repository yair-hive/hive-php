<?php

//זמני בלבד
$permissions_list[] = 'super';
$permissions_list[] = 'reading';
$permissions_list[] = 'writing';

$user_actions['login'] = function(){
    global $NEW_POST;
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
                    $_SESSION['user_name'] = $NEW_POST['user_name'];
                    $_SESSION['permissions'] = $permissions;
                }else{
                    throw new Exception('login faild');
                }
            }else{
                throw new Exception('no user');
            }
        }else{
            throw new Exception('db error');
        }
    }else{
        throw new Exception('parameter misseng');
    }
};
$user_actions['get'] = function(){
    if(!empty($_SESSION['user_name'])){
        return $_SESSION['user_name'];
    }else{
        throw new Exception('parameter misseng');
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
    global $NEW_POST; 
    if(!empty($NEW_POST['user_name']) && !empty($NEW_POST['password'])){
        $user_name = $NEW_POST['user_name'];
        $password = $NEW_POST['password'];
        $password = password_hash($password, PASSWORD_DEFAULT);
        $query_string = "INSERT INTO users(user_name, password) VALUES('{$user_name}', '{$password}')";
        db_post($query_string);
    }else{
        $respons['msg'] = $NEW_POST;
        print_r(json_encode($respons));
    }
};
$user_actions['add_permission'] = function(){  
    global $connection;              
    check_parameters(['user_id', 'permission']);
    $user_id = $_POST['user_id'];
    $permission = $_POST['permission'];        
    $query_string = "INSERT INTO permissions(user, permission) VALUES('{$user_id}', '{$permission}')";
    db_post($query_string);
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
$user_actions['create_group'] = function(){
    $group_name = $_POST['group_name'];
    $query_string = "SELECT * FROM users_groups WHERE group_name = '{$group_name}'";
    check_exists($query_string);
    $query_string = "INSERT INTO users_groups(group_name) VALUES('{$group_name}')";
    db_post($query_string);
};
$user_actions['add_permission_to_group'] = function(){
    $action_name = $_POST['action_name'];
    $group_id = $_POST['group_id'];
    $query_string = "SELECT * FROM user_group_permissions WHERE action_name = '{$action_name}' AND group_id = '{$group_id }'";
    check_exists($query_string);
    $query_string = "INSERT INTO user_group_permissions(action_name, group_id) VALUES ('{$action_name}', '{$group_id}')";
    db_post($query_string);
};
$user_actions['add_user_to_group'] = function(){
    $user_id = $_POST['user_id'];
    $group_id = $_POST['group_id'];
    $query_string = "SELECT * FROM user_group_belong WHERE user_id = '{$user_id}' AND group_id = '{$group_id}'";
    check_exists($query_string);
    $query_string = "INSERT INTO user_group_belong(user_id, group_id) VALUES('{$user_id}', '{$group_id}')";
    db_post($query_string);
};