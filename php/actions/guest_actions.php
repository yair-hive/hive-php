<?php

function getAllGroups($map_id){
    global $connection;         
    $query_string = "SELECT * FROM guests_groups WHERE belong='{$map_id}'";
    if($result = mysqli_query($connection, $query_string)){
        $results = [];
        while($row = mysqli_fetch_assoc($result)){
            $results[] = $row;
        }
        return $results;
    }

};
function getGroupScore($map_id, $group_name){
    $groups = getAllGroups($map_id);
    foreach($groups as $group){
        if($group['group_name'] == $group_name){
            return $group['score'];
        }
    }
    return null;
}
function getGroupId($map_id, $group_name){
    global $connection; 
    $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$map_id}'";
    $result = mysqli_query($connection, $query_string);
    $result = mysqli_fetch_assoc($result);
    if($result){
        return $result['id'];
    }else{
        return false;
    }
}
function createDefaultGroup($map_id, $group_name){
    global $connection; 
    $color = '#2b4e81';
    $score = 0;
    $query_string = "INSERT INTO guests_groups(group_name, color, score, belong) VALUES('{$group_name}', '{$color}', '{$score}', '{$map_id}')";
    mysqli_query($connection, $query_string);
}

$guest_actions['create'] = function(){
    if(allowed('writing')){
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $guest_group = $_POST['guest_group']; 
        $map_id = $_POST['map_id'];  
        if(!empty($first_name) && !empty($last_name) && !empty($guest_group)){
            global $connection;     
            $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$map_id}'";
            if($result = mysqli_query($connection, $query_string)){
                if(mysqli_num_rows($result) == 0){
                    $guest_group_id = getGroupId($map_id, $guest_group);
                    if($guest_group_id){
                        $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$map_id}')";
                        db_post($query_string);
                    }else{
                        createDefaultGroup($map_id, $guest_group);
                        $guest_group_id = getGroupId($map_id, $guest_group);
                        $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$map_id}')";
                        db_post($query_string);
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
        global $connection;        
        $map_id = $_POST['map_id'];  
        $query_string = "SELECT * FROM guests WHERE belong='{$map_id}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['get_all_and_ditails'] = function(){
    global $connection; 
    if(allowed("reading")){
        global $connection;        
        $map_id = $_POST['map_id'];  
        $query_string = "SELECT * FROM guests WHERE belong='{$map_id}'";
        $result = mysqli_query($connection, $query_string);
        $results = [];
        while($row = mysqli_fetch_assoc($result)){
            $query_string = "SELECT seat FROM belong WHERE guest = '{$row['id']}'";
            $belong_result = mysqli_query($connection, $query_string);
            while($belong_row = mysqli_fetch_assoc($belong_result)){
                $query_string = "SELECT * FROM seats WHERE id = '{$belong_row['seat']}'";
                $seat_result = mysqli_query($connection, $query_string);
                while($seat_row = mysqli_fetch_assoc($seat_result)){
                    $query_string = "SELECT group_id FROM seat_groups_belong WHERE seat = '{$seat_row['id']}'";
                    $tag_result = mysqli_query($connection, $query_string);
                    $tags = [];
                    while($tag_row = mysqli_fetch_assoc($tag_result)){
                        $tags[] = $tag_row; 
                    }
                    $seat_row['tags'] = $tags;
                    $row['seat'] = $seat_row;
                }
            }
            $query_string = "SELECT request FROM guests_requests WHERE guest = '{$row['id']}'";
            $request_result = mysqli_query($connection, $query_string);
            $requets = [];
            while($requet_row = mysqli_fetch_assoc($request_result)){
                $requets[] = $requet_row['request'];
            }
            $row['requets'] = $requets;
            $results[] = $row;
        }
        $respons['msg'] = 'ok';
        $respons['data'] = $results;
        print_r(json_encode($respons));
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['get_belong'] = function(){
    if(allowed("reading")){
        $guest_id = $_POST['guest_id'];
        $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }    
};
$guest_actions['add'] = function(){
    if(allowed('writing')){
        global $connection;     
        $map_id = $_POST['map_id'];
        $seat_id = $_POST['seat_id'];
        $guest_id = $_POST['guest_id'];
        $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) != 0){
            $query_string = "DELETE FROM belong WHERE seat='{$seat_id}'";
            mysqli_query($connection, $query_string);
        }
        $query_string = "SELECT * FROM belong WHERE guest='{$guest_id}'";
        $result = mysqli_query($connection, $query_string);
        if(mysqli_num_rows($result) != 0){
            $respons['msg'] = 'belong';
            print_r(json_encode($respons));
        }else{
            $query_string = "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest_id }', '{$seat_id}', '{$map_id}')";
            db_post($query_string);
        }
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['update_belong'] = function(){
    if(allowed('writing')){
        global $connection;     
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
        db_post($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['check_belong'] = function(){
    if(allowed("reading")){
        if(!empty($_POST['guest_id'])){
            $guest_id = $_POST['guest_id'];
            global $connection;  
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
            global $connection;   
            $query_string = "DELETE FROM guests WHERE id='{$guest_id}'";
            if($result = mysqli_query($connection, $query_string)){
                $query_string = "DELETE FROM belong WHERE guest='{$guest_id}'";
                db_post($query_string);
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
$guest_actions['update'] = function(){
    if(allowed('writing')){
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $guest_group = $_POST['guest_group'];
        $guest_id = $_POST['guest_id'];
        $map_id = $_POST['map_id'];  
        if(!empty($first_name) && !empty($last_name) && !empty($guest_group)){
            global $connection; 
            $guest_group_id = getGroupId($map_id, $guest_group);
            if($guest_group_id){
                $query_string = "UPDATE guests SET first_name = '{$first_name}', last_name = '{$last_name}', guest_group = '{$guest_group_id}', belong = '{$map_id}' WHERE id= '{$guest_id}'";
                db_post($query_string);
            }else{
                createDefaultGroup($map_id, $guest_group);
                $guest_group_id = getGroupId($map_id, $guest_group);
                $query_string = "UPDATE guests SET first_name = '{$first_name}', last_name = '{$last_name}', guest_group = '{$guest_group_id}', belong = '{$map_id}' WHERE id= '{$guest_id}'";
                db_post($query_string);
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
$guest_actions['get_all_groups'] = function(){
    if(allowed("reading")){
        global $connection;        
        $map_id = $_POST['map_id'];  
        $query_string = "SELECT * FROM guests_groups WHERE belong='{$map_id}'";
        db_get($query_string);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};
$guest_actions['delete_group'] = function(){
    if(allowed('writing')){
        if(!empty($_POST['group_id'])){
            $group_id = $_POST['group_id'];
            global $connection;   
            $query_string = "DELETE FROM guests_groups WHERE id='{$group_id}'";
            if($result = mysqli_query($connection, $query_string)){
                $respons['msg'] = 'ok';
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
$guest_actions['update_group_color'] = function(){
    if(allowed('writing')){
        if(!empty($_POST['group_id']) && !empty($_POST['color'])){
            $group_id = $_POST['group_id'];
            $color = $_POST['color'];
            global $connection;
            $query_string = "UPDATE guests_groups SET color = '{$color}' WHERE id = '{$group_id}'";
            if($result = mysqli_query($connection, $query_string)){
                $respons['msg'] = 'ok';
                print_r(json_encode($respons));
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
$guest_actions['update_group_score'] = function(){
    if(allowed('writing')){
        if(!empty($_POST['group_id']) && !empty($_POST['score'])){
            $group_id = $_POST['group_id'];
            $score = $_POST['score'];
            global $connection;
            $query_string = "UPDATE guests_groups SET score = '{$score}' WHERE id = '{$group_id}'";
            if($result = mysqli_query($connection, $query_string)){
                $respons['msg'] = 'ok';
                print_r(json_encode($respons));
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
$guest_actions['update_guest_score'] = function(){
    $guest_id = $_POST['guest_id'];
    $score = $_POST['score'];
    $query_string = "UPDATE guests SET score = '{$score}' WHERE id = '{$guest_id}'";
    db_post($query_string);
};
