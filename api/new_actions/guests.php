<?php
$guests['create'] = function(){
    check_parameters(['guests', 'project_name']);
    $guests = $_POST['guests'];
    $data = json_decode($guests);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "";
    foreach($data as $guest){
        $first_name = $guest[0];
        $last_name = $guest[1];
        $guest_group = $guest[2];
        $guest_group_id = get_group_id($project_id, $guest_group);
        $s_query_string = "SELECT * FROM guests WHERE first_name='{$first_name}' AND last_name='{$last_name}' AND guest_group='{$guest_group}' AND project='{$project_id}'";
        if(check_not_exists_f($s_query_string)){
            $query_string .= "INSERT INTO guests(first_name, last_name, guest_group, project) VALUES('{$first_name}', '{$last_name}', '{$guest_group_id}', '{$project_id}');";
        }
    }
    db_post_multi($query_string);
};
$guests['get_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name);  
    $query_string = "SELECT * FROM guests WHERE project='{$project_id}'";
    return db_get($query_string);
};
$guests['delete'] = function(){
    check_parameters(['guest_id']);
    $guest_id = $_POST['guest_id']; 
    $query_string = "DELETE FROM guests WHERE id='{$guest_id}';";
    $query_string .= "DELETE FROM belong WHERE guest='{$guest_id}';";
    db_post_multi($query_string);
};
$guests['update'] = function(){
    $filds['first'] = function(){
        check_parameters(['guest_id', 'first_name']);
        $guest_id = $_POST['guest_id'];
        $first_name = $_POST['first_name'];
        $query_string = "UPDATE guests SET first_name = '{$first_name}' WHERE id = '{$guest_id}'";
        db_post($query_string);
    };
    $filds['last'] = function(){
        check_parameters(['guest_id', 'last_name']);
        $guest_id = $_POST['guest_id'];
        $last_name = $_POST['last_name'];
        $query_string = "UPDATE guests SET last_name = '{$last_name}' WHERE id = '{$guest_id}'";
        db_post($query_string);
    };
    $filds['group'] = function(){
        check_parameters(['guest_id', 'group_name', 'project_name']);
        $guest_id = $_POST['guest_id'];
        $group_name = $_POST['group_name'];
        $project_name = $_POST['project_name'];
        $project_id = get_project_id($project_name);  
        $group_id = get_group_id($project_id, $group_name);
        $query_string = "UPDATE guests SET guest_group = '{$group_id}' WHERE id = '{$guest_id}'";
        db_post($query_string);
    };
    $filds['score'] = function(){
        check_parameters(['guest_id', 'score']);
        $guest_id = $_POST['guest_id'];
        $score = $_POST['score'];
        $query_string = "UPDATE guests SET score = '{$score}' WHERE id = '{$guest_id}'";
        db_post($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};