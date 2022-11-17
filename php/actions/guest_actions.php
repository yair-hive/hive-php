<?php

$guest_actions['create'] = function(){
    if(allowed('writing')){
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $guest_group = $_POST['guest_group']; 
        $map_id = $_POST['map_id'];  
        if(!empty($first_name) && !empty($last_name) && !empty($guest_group)){
            global $mysql_conf;
        $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
            $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$map_id}'";
            if($result = mysqli_query($connection, $query_string)){
                if(mysqli_num_rows($result) == 0){
                    $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group}', '{$map_id}')";
                    if(mysqli_query($connection, $query_string)){
                        $respons['msg'] = 'all ok';
                        print_r(json_encode($respons));
                    }else{
                        $respons['msg'] = 'db error';
                        print_r(json_encode($respons));
                    }
                }else{
                    $respons['msg'] = 'allrdy axist';
                    print_r(json_encode($respons));
                }
            }else{
                $respons['msg'] = 'db error';
                print_r(json_encode($respons));
            }
        }else{
            $respons['msg'] = 'faild empty';
            print_r(json_encode($respons));
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['get_all'] = function(){
    if(allowed("reading")){
        global $mysql_conf;
        $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);     
        $map_id = $_POST['map_id'];  
        $query_string = "SELECT * FROM guests WHERE belong='{$map_id}'";
        if($result = mysqli_query($connection, $query_string)){
            $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
            $guests_list = array();
            foreach($results as $guest){
                $guest_array['first_name'] = $guest['first_name'];
                $guest_array['last_name'] = $guest['last_name'];
                $guest_array['id'] = $guest['id'];
                $guest_array['group'] = $guest['guest_group'];
                $guests_list[] = $guest_array;
            }
            $guests_list_json = json_encode($guests_list);
            print_r($guests_list_json);
        }else{
            echo 'sql error';
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['add'] = function(){
    if(allowed('writing')){
        global $mysql_conf;
        $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
        $map_id = $_POST['map_id'];
        $seat_id = $_POST['seat_id'];
        $guest_id = $_POST['guest_id'];
        $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) != 0){
            $query_string = "DELETE FROM belong WHERE guest='{$guest_id}'";
            mysqli_query($connection, $query_string);
        }
        $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) != 0){
            $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
            mysqli_query($connection, $query_string);
        }
        $query_string = "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$map_id}')";
        if(!mysqli_query($connection, $query_string)){
            echo 'sql error';
        }else{
            echo 'all good';
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['check_belong'] = function(){
    if(allowed("reading")){
        if(!empty($_POST['guest_id'])){
            $guest_id = $_POST['guest_id'];
            global $mysql_conf;
            $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
            $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
            if($result = mysqli_query($connection, $query_string)){
                if(mysqli_num_rows($result) != 0){
                    $respons['msg'] = 'true';
                    print_r(json_encode($respons));
                }else{
                    $respons['msg'] = 'false';
                    print_r(json_encode($respons));
                }
            }
        }  
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    } 
};
$guest_actions['delete'] = function(){
    if(allowed('writing')){
        if(!empty($_POST['guest_id'])){
            $guest_id = $_POST['guest_id'];
            global $mysql_conf;
            $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
            $query_string = "DELETE FROM guests WHERE id='{$guest_id}'";
            if($result = mysqli_query($connection, $query_string)){
                $respons['msg'] = 'true';
                print_r(json_encode($respons));
            }else{
                $respons['msg'] = 'db error';
                print_r(json_encode($respons));
            }
        }   
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
