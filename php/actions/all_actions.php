<?php

$all_actions['get_guest_seat_num'] = function(){
    if(allowed("reading")){
        global $mysql_conf;
        $connection = $connection = mysqli_connect($mysql_conf["DB_HOST"], $mysql_conf['DB_USER'], $mysql_conf['DB_PASS'], $mysql_conf['DB_NAME']);  
        $map_id = $_POST['map_id'];
        $query_string = "SELECT * FROM belong WHERE map_belong = '{$map_id}'";
        if($result = mysqli_query($connection, $query_string)){
            $belong_results = mysqli_fetch_all($result, MYSQLI_ASSOC);
        }
        $query_string = "SELECT * FROM guests";
        if($result = mysqli_query($connection, $query_string)){
            $guests_results = mysqli_fetch_all($result, MYSQLI_ASSOC);
        }
        $query_string = "SELECT * FROM seats";
        if($result = mysqli_query($connection, $query_string)){
            $seats_results = mysqli_fetch_all($result, MYSQLI_ASSOC);
    
        }
        foreach($belong_results as $i => $bel){
            foreach($guests_results as $guest){                    
                if($guest['id'] == $bel['guest']){
                    $belong_results[$i]['guest_first_name'] = $guest['first_name'];
                    $belong_results[$i]['guest_last_name'] = $guest['last_name'];
                    $belong_results[$i]['guest_group'] = $guest['guest_group'];
                }
            }
        }
        foreach($belong_results as $i => $bel){
            foreach($seats_results as $seat){
                if($seat['id'] == $bel['seat']){
                    $belong_results[$i]['seat_num'] = $seat['seat_number'];
                }
            }
        }
        $list_json = json_encode($belong_results);
        print_r($list_json);
    }else{
        $respons['msg'] = 'dinaid';
        print_r(json_encode($respons));
    }
};