<?php
$guest_groups['get_all'] = function(){
    check_parameters(['project_name']);       
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "SELECT * FROM guests_groups WHERE project='{$project_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
};
$guest_groups['delete'] = function(){
    check_parameters(['group_id']);
    $group_id = $_POST['group_id'];  
    $query_string = "DELETE FROM guests_groups WHERE id='{$group_id}'";
    db_post($query_string);
};
$guest_groups['update'] = function(){
    $filds['name'] = function(){
        check_parameters(['group_id', 'name']);
        $group_id = $_POST['group_id'];
        $name = $_POST['name'];
        $query_string = "UPDATE guests_groups SET name = '{$name}' WHERE id = '{$group_id}'";
        db_post($query_string);
    };
    $filds['color'] = function(){
        check_parameters(['group_id', 'color']);
        $group_id = $_POST['group_id'];
        $color = $_POST['color'];
        $query_string = "UPDATE guests_groups SET color = '{$color}' WHERE id = '{$group_id}'";
        db_post($query_string);
    };
    $filds['score'] = function(){
        check_parameters(['group_id', 'score']);
        $group_id = $_POST['group_id'];
        $score = $_POST['score'];
        $query_string = "UPDATE guests_groups SET score = '{$score}' WHERE id = '{$group_id}'";
        db_post($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};