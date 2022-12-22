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
        createDefaultGroup($map_id, $group_name);
        $query_string = "SELECT * FROM guests_groups WHERE group_name = '{$group_name}' AND belong = '{$map_id}'";
        $result = mysqli_query($connection, $query_string);
        $result = mysqli_fetch_assoc($result);
        return $result['id'];
    }
}
function createDefaultGroup($map_id, $group_name){
    global $connection; 
    $color = '#2b4e81';
    $score = 0;
    $query_string = "INSERT INTO guests_groups(group_name, color, score, belong) VALUES('{$group_name}', '{$color}', '{$score}', '{$map_id}')";
    mysqli_query($connection, $query_string);
}
function guest_exists($first_name, $last_name, $guest_group, $map_id){
    global $connection;     
    $query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND belong='{$map_id}'";
    $result = mysqli_query($connection, $query_string);
    return (mysqli_num_rows($result) != 0);      
}
function guest_parameters(){
    return !empty($_POST['first_name']) && !empty($_POST['last_name']) && !empty($_POST['guest_group']) && !empty($_POST['map_id']);
}
$guest_actions['create'] = function(){
    if(allowed('writing')){
        if(!guest_parameters()){
            $respons['msg'] = 'חסר פרמטר';
            print_r(json_encode($respons));
            return;
        }
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $guest_group = $_POST['guest_group']; 
        $map_id = $_POST['map_id']; 
        $guest_group_id = getGroupId($map_id, $guest_group); 
        if(guest_exists($first_name, $last_name, $guest_group_id, $map_id)){
            $respons['msg'] = 'האורח כבר קיים';
            print_r(json_encode($respons));
            return;
        }                   
        $query_string = "INSERT INTO guests(first_name, last_name, guest_group, belong) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$map_id}')";
        db_post($query_string);
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
        $map_id = $_POST['map_id'];  
        $guests_query = "SELECT * FROM guests WHERE belong='{$map_id}'";
        $belongs_query = "SELECT * FROM belong WHERE map_belong = '{$map_id}'";
        $seats_query = "SELECT * FROM seats WHERE belong = '{$map_id}'";
        $tags_query = "SELECT * FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'tag'";
        $requests_query = "SELECT * FROM guests_requests WHERE belong = '{$map_id}'";
        $guests_results = db_get_f($guests_query);
        $belongs_results = db_get_f($belongs_query);
        $seats_results = db_get_f($seats_query);
        $tags_results = db_get_f($tags_query);
        $requests_results = db_get_f($requests_query);
        $new_belongs_results = [];
        foreach($belongs_results as $belong){
            $new_belongs_results[$belong['guest']] = $belong;
        }
        $new_seats_results = [];
        foreach($seats_results as $seat){
            $new_seats_results[$seat['id']] = $seat;
        }
        $new_tags_results = [];
        foreach($tags_results as $tag){
            $new_tags_results[$tag['seat']] = [];
        }
        foreach($tags_results as $tag){
            $new_tags_results[$tag['seat']][] = $tag;
        }
        $new_requests_results = [];
        foreach($requests_results as $request){
            $new_requests_results[$request['guest']] = [];
        }
        foreach($requests_results as $request){
            $new_requests_results[$request['guest']][] = $request['request'];
        }
        $new_guests_results = [];
        foreach($guests_results as $guest){
            $guest_id = $guest['id'];
            if(array_key_exists($guest_id, $new_belongs_results)){
                $seat_id = $new_belongs_results[$guest_id]['seat'];
                $seat = $new_seats_results[$seat_id];
                if(array_key_exists($seat_id, $new_tags_results)){
                    $seat['tags'] = $new_tags_results[$seat_id];
                }
                $guest['seat'] = $seat;
            }
            if(array_key_exists($guest_id, $new_requests_results)){
                $guest['requets'] = $new_requests_results[$guest_id];
            }
            $new_guests_results[] = $guest;
        }
        $respons['msg'] = 'ok';
        $respons['data'] = $new_guests_results;
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
$guest_actions['update_belong_multiple'] = function(){
    if(allowed('writing')){
        global $connection;     
        $map_id = $_POST['map_id'];
        $data = json_decode($_POST['data']);
        $query_string = "";
        foreach($data as $row){
            $guest = $row->guest;
            $seat = $row->seat;
            $query_string .= "DELETE FROM belong WHERE guest='{$guest}';";
            $query_string .= "DELETE FROM belong WHERE seat='{$seat}';";
            $query_string .= "INSERT INTO belong(guest, seat, map_belong) VALUES('{$guest}', '{$seat}', '{$map_id}');";
        }
        db_post_multi($query_string);
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
            $query_string = "UPDATE guests SET first_name = '{$first_name}', last_name = '{$last_name}', guest_group = '{$guest_group_id}', belong = '{$map_id}' WHERE id= '{$guest_id}'";
            db_post($query_string);
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
