<?php
$tags['get_all'] = function(){
    check_parameters(['project_name']);
    $project_name = $_POST['project_name'];
    $project_id = get_project_id($project_name); 
    $query_string = "SELECT * FROM tags WHERE project = '{$project_id}'";
    $results = db_get($query_string);
    $new_results = [];
    foreach($results as $row){
        $new_results[$row['id']] = $row;
    }
    return $new_results;
};
$tags['delete'] = function(){
    check_parameters(['tag_id']);
    $tag_id = $_POST['tag_id'];
    $query_string = "DELETE FROM tags WHERE id = '{$tag_id}';";
    $query_string .= "DELETE FROM guests_requests WHERE request = '{$tag_id}';";
    $query_string .= "DELETE FROM tag_belongs WHERE tag = '{$tag_id}';";
    db_post_multi($query_string);
};
$tags['update'] = function(){
    $filds['name'] = function(){
        check_parameters(['name', 'tag_id']);
        $name = $_POST['name'];
        $tag_id = $_POST['tag_id'];
        $query_string = "UPDATE tags SET name = '{$name}' WHERE  id = '{$tag_id}'";
        db_post($query_string);
    };
    $filds['color'] = function(){
        check_parameters(['color', 'tag_id']);
        $color = $_POST['color'];
        $tag_id = $_POST['tag_id'];
        $query_string = "UPDATE tags SET color = '{$color}' WHERE  id = '{$tag_id}'";
        db_post($query_string);
    };
    $filds['score'] = function(){
        check_parameters(['score', 'tag_id']);
        $score = $_POST['sscore'];
        $tag_id = $_POST['tag_id'];
        $query_string = "UPDATE tags SET score = '{$score}' WHERE  id = '{$tag_id}'";
        db_post($query_string);
    };
    check_parameters(['fild']);
    $fild = $_POST['fild'];
    if(!array_key_exists($fild, $filds)){
        throw new Exception('parameter missing: fild');
    }
    $filds[$fild]();
};