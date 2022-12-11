<?php
function getTagId($group_name){
    global $connection;
    $query_string = "SELECT id FROM tags WHERE tag_name = '{$group_name}'";
    $result = mysqli_query($connection, $query_string);
    $result = mysqli_fetch_assoc($result);
    if($result){
        return $result['id'];
    }else{
        return false;
    }
};
function getTagName($group_id){
    global $connection;
    $query_string = "SELECT tag_name FROM tags WHERE id = '{$group_id}'";
    $result = mysqli_query($connection, $query_string);
    $result = mysqli_fetch_assoc($result);
    if($result){
        return $result['tag_name'];
    }else{
        return false;
    }
};
function createDefaultTag($tag_name, $map){
    $name = $tag_name;
    $color = '#2b4e81';
    $score = 0;
    $belong = $map;
    global $connection;
    $query_string = "INSERT INTO tags(tag_name, color, score, belong) VALUES('{$name}', '{$color}', '{$score}', '{$belong}')";
    mysqli_query($connection, $query_string);
}
$seat_groups['create'] = function(){
    $name = $_POST['name'];
    $score = $_POST['score'];
    $query_string = "INSERT INTO seats_groups(group_name, score) VALUES('{$name}', '{$score}')";
    db_post($query_string);
};
$seat_groups['get_id'] = function(){
    $name = $_POST['name'];
    $query_string = "SELECT id FROM seats_groups WHERE group_name = '{$name}'";
    db_get($query_string);
};
$seat_groups['get_name'] = function(){
    $id = $_POST['id'];
    $query_string = "SELECT group_name FROM seats_groups WHERE id = '{$id}'";
    db_get($query_string);
};
$seat_groups['add_col'] = function(){
    $seat = $_POST['seat'];
    $group_name = $_POST['group'];
    $map = $_POST['map'];
    $group_id = getTagId($group_name);
    if($group_id){
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'col', '{$map}')";
        db_post($query_string);
    }else{
        createDefaultTag($group_name, $map);
        $group_id = getTagId($group_name);
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'col', '{$map}')";
        db_post($query_string);
    }
};
$seat_groups['get_groups_cols'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT group_name FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'col'";
    db_get($query_string);
};
$seat_groups['get_seats_cols'] = function(){
    $map_id = $_POST['map_id'];
    $group_name = $_POST['group_name'];
    $group_id = getTagId($group_name);
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'col'";
    db_get($query_string);
};
$seat_groups['add_ob'] = function(){
    $map = $_POST["map"];
    $name = $_POST["name"];
    $from_row = $_POST["from_row"];
    $from_col = $_POST["from_col"];
    $to_row = $_POST["to_row"];
    $to_col = $_POST["to_col"];
    $query_string = "INSERT INTO map_obs(ob_name, from_row, from_col, to_row, to_col, belong) VALUES('{$name}', '{$from_row}', '{$from_col}', '{$to_row}', '{$to_col}', '{$map}')";
    db_post($query_string);
};
$seat_groups['get_ob'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT * FROM map_obs WHERE belong = '{$map_id}'";
    db_get($query_string);
};
$seat_groups['add_tag'] = function(){
    $seat = $_POST['seat'];
    $group_name = $_POST['group'];
    $map = $_POST['map'];
    $group_id = getTagId($group_name);
    if($group_id){
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'tag', '{$map}')";
        db_post($query_string);
    }else{
        createDefaultTag($group_name, $map);
        $group_id = getTagId($group_name);
        $query_string = "INSERT INTO seat_groups_belong(seat, group_id, group_type, belong) VALUES('{$seat}', '{$group_id}', 'tag', '{$map}')";
        db_post($query_string);
    }
};
$seat_groups['get_groups_tags'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT group_id FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_type = 'tag'";
    global $connection;
    $result = mysqli_query($connection, $query_string);
    $results = [];
    while($row = mysqli_fetch_assoc($result)){
        $results[] = $row;
    }
    $tag_names = [];
    foreach($results as $id){
        $tagName = getTagName($id['group_id']);
        if($tagName){
            $tag_names[] = $tagName;
        }
    }
    $res = [];
    $res['msg'] = 'ok';
    $res['data'] = $tag_names;
    print_r(json_encode($res));
};
$seat_groups['get_seats_tags'] = function(){
    $map_id = $_POST['map_id'];
    $group_name = $_POST['group_name'];
    $group_id = getTagId($group_name);
    $query_string = "SELECT seat FROM seat_groups_belong WHERE belong = '{$map_id}' AND group_id = '{$group_id}' AND group_type = 'tag'";
    db_get($query_string);
};
$seat_groups['create_tag'] = function(){
    print_r($_POST);
    $name = $_POST['name'];
    $color = $_POST['color'];
    $score = $_POST['score'];
    $belong = $_POST['belong'];
    global $connection;
    $query_string = "SELECT * FROM tags WHERE tag_name='{$name}'";
    if($result = mysqli_query($connection, $query_string)){
        if(mysqli_num_rows($result) == 0){
            $query_string = "SELECT * FROM tags WHERE color = '{$color}'";
            if($result = mysqli_query($connection, $query_string)){
                if(mysqli_num_rows($result) == 0){
                    $query_string = "INSERT INTO tags(tag_name, color, score, belong) VALUES('{$name}', '{$color}', '{$score}', '{$belong}')";
                    if(mysqli_query($connection, $query_string)){
                        $respons['msg'] = 'ok';
                        print_r(json_encode($respons));
                    }
                }else{
                    $respons['msg'] = 'color allrdy axist';
                    print_r(json_encode($respons));
                }
            }
        }else{
            $respons['msg'] = 'name allrdy axist';
            print_r(json_encode($respons));
        }
    }
};
$seat_groups['update_tag'] = function(){
    $color = $_POST['color'];
    $id = $_POST['id'];
    global $connection;
    $query_string = "UPDATE tags SET color = '{$color}' WHERE  id = '{$id}'";
    if(mysqli_query($connection, $query_string)){
        $respons['msg'] = 'ok';
        print_r(json_encode($respons));
    }
};
$seat_groups['get_all_tags'] = function(){
    $map_id = $_POST['map_id'];
    $query_string = "SELECT * FROM tags WHERE belong = '{$map_id}'";
    db_get($query_string);
};