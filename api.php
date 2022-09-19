<?php 
include_once 'mysql/mysql_conf.php';

function get_seat_as_array($seat_string){
    $respons = array();
    $row_ex = "/row-[0-9]+/";
    $col_ex = "/col-[0-9]+/";
    $num_ex = "/[0-9]+/";

    preg_match($row_ex, $seat_string, $match);
    preg_match($num_ex, $match[0], $row_num);
    $respons['row'] = $row_num[0];

    preg_match($col_ex, $seat_string, $match);
    preg_match($num_ex, $match[0], $col_num);
    $respons['col'] = $col_num[0];

    return $respons;
}

if(!empty($_POST['action'])){
    switch($_POST['action']){
        case 'get_all_maps':
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
            $query_string = "SELECT map_name FROM maps";
            if($result = mysqli_query($connection, $query_string)){
                $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
                $new_results_array = array();
                foreach($results as $row){
                    $new_results_array[] = "<a href='edit_map.php?map_name=".$row['map_name']."'>".$row['map_name']."</a>";
                }
                $results_to_string = implode(" </li><li> ", $new_results_array);
                echo "<ul><li>".$results_to_string."</li></ul>";
            }
            break;
        case 'create_map':
            $map_name = $_POST['map_name'];
            $rows_number = $_POST['rows_number'];
            $columns_number = $_POST['columns_number']; 
            if(!empty($map_name) && !empty($rows_number) && !empty($columns_number)){
                $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
                $query_string = "INSERT INTO maps(map_name, rows_number, columns_number) VALUES('{$map_name}', '{$rows_number}', '{$columns_number}')";
                if(mysqli_query($connection, $query_string)){
                    echo 'all good';
                }else{
                    echo 'db error';
                }
            }else{
                echo 'faild empty';
            }
            break;
        case 'get_map_and_details':
            $map_name = $_POST['map_name'];
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
            if($result = mysqli_query($connection, $query_string)){
                $results = mysqli_fetch_array($result, MYSQLI_ASSOC);
            }
            $map_id = $results['id'];
            $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
            if($seats_result = mysqli_query($connection, $query_string)){
                $seats_results = mysqli_fetch_all($seats_result, MYSQLI_ASSOC);
            }
            $arr_con = count($seats_results);
            for($i = 0; $i < $arr_con; $i++){
                $seat_id = $seats_results[$i]['id'];
                $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
                if($result = mysqli_query($connection, $query_string)){
                    if(mysqli_num_rows($result)){
                        $belong_result = mysqli_fetch_array($result, MYSQLI_ASSOC);
                        $seats_results[$i]['guest_id'] = $belong_result['guest'];
                    }                    
                }
            }
            $map_and_details['map'] = $results;
            $map_and_details['seats'] = $seats_results;
            $map_and_details_json = json_encode($map_and_details);
            print_r($map_and_details_json);
            break;
        case 'add_seats':
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
            if(!empty($_POST['seat_list'])){
                $seat_list = explode(' *|* ', $_POST['seat_list']);
                $seat_list_as_array = array();
                foreach($seat_list as $seat_class_list){
                    if(!empty($seat_class_list)){
                        $seat_list_as_array[] = get_seat_as_array($seat_class_list);
                    }
                }
                $belong = $_POST['map_id'];
                foreach($seat_list_as_array as $seat_array){
                    $row_num = $seat_array['row'];
                    $col_num = $seat_array['col'];
                    $query_string = "INSERT INTO seats(belong, row_num, col_num) VALUES('{$belong}', '{$row_num}', '{$col_num}')";
                    if(!mysqli_query($connection, $query_string)){
                        echo 'sql error';
                    }
                }
                echo 'all good';
            }else{
                echo '$_GET';
            }
            break;
        case 'add_guests':
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $guest_group = $_POST['guest_group'];
            
            if(!empty($first_name) && !empty($last_name) && !empty($guest_group)){
                $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
                $query_string = "INSERT INTO guests(first_name, last_name, guest_group) VALUES('{$first_name}', '{$last_name}', '{$guest_group}')";
                if(mysqli_query($connection, $query_string)){
                    echo 'all good';
                }else{
                    echo 'db error';
                }
            }else{
                echo 'faild empty';
            }
            break;
        case 'get_guests_names':
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $query_string = "SELECT * FROM guests";
            if($result = mysqli_query($connection, $query_string)){
                $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
                $guests_list = array();
                foreach($results as $guest){
                    $guest_array['name'] = $guest['last_name'].' '.$guest['first_name'];
                    $guest_array['id'] = $guest['id'];
                    $guest_array['group'] = $guest['guest_group'];
                    $guests_list[] = $guest_array;
                }
                $guests_list_json = json_encode($guests_list);
                print_r($guests_list_json);
            }else{
                echo 'sql error';
            }
            break;
        case 'create_belong':
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
            $seat_id = $_POST['seat_id'];
            $guest_id = $_POST['guest_id'];
            $query_string = "INSERT INTO belong(guest, seat) VALUES('{$guest_id }', '{$seat_id}')";
            if(!mysqli_query($connection, $query_string)){
                echo 'sql error';
            }else{
                echo 'all good';
            }
            break;
        case 'get_map_and_details_and_guests':
            $map_name = $_POST['map_name'];
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
            if($result = mysqli_query($connection, $query_string)){
                $results = mysqli_fetch_array($result, MYSQLI_ASSOC);
            }
            $map_id = $results['id'];
            $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
            if($seats_result = mysqli_query($connection, $query_string)){
                $seats_results = mysqli_fetch_all($seats_result, MYSQLI_ASSOC);
            }
            $arr_con = count($seats_results);
            for($i = 0; $i < $arr_con; $i++){
                $seat_id = $seats_results[$i]['id'];
                $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
                if($result = mysqli_query($connection, $query_string)){
                    if(mysqli_num_rows($result)){
                        $belong_result = mysqli_fetch_array($result, MYSQLI_ASSOC);
                        $seats_results[$i]['guest_id'] = $belong_result['guest'];
                    }                    
                }
            }
            $query_string = "SELECT * FROM guests";
            if($result = mysqli_query($connection, $query_string)){
                $results = mysqli_fetch_all($result, MYSQLI_ASSOC);
                $guests_list = array();
                foreach($results as $guest){
                    $guest_array['name'] = $guest['last_name'].' '.$guest['first_name'];
                    $guest_array['id'] = $guest['id'];
                    $guest_array['group'] = $guest['guest_group'];
                    $guests_list[] = $guest_array;
                }
            }else{
                echo 'sql error';
            }
            $map_and_details['map'] = $results;
            $map_and_details['seats'] = $seats_results;
            $map_and_details['guests'] = $guests_list;
            $map_and_details_json = json_encode($map_and_details);
            print_r($map_and_details_json);
            break;
        case 'add_seat_number':
            echo $_POST['seat_number'];
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $seat_id = $_POST['seat_id'];
            $seat_number = $_POST['seat_number'];
            $query_string = "UPDATE seats SET seat_number = '{$seat_number}' WHERE seats.id = '{$seat_id}';";
            if(!mysqli_query($connection, $query_string)){
                echo 'sql error';
            }else{
                echo 'all good';
            }
            break;
        case 'get_guest_seat_num':
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);
            $query_string = "SELECT * FROM belong";
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
            break;
        case 'get_map':
            $map_name = $_POST['map_name'];
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
            if($result = mysqli_query($connection, $query_string)){
                $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
            }
            $map_results_json = json_encode($map_results);
            print_r($map_results_json);
            break;
        case 'get_seats':
            $map_name = $_POST['map_name'];
            $connection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);   
            $query_string = "SELECT * FROM maps WHERE map_name='{$map_name}'";
            if($result = mysqli_query($connection, $query_string)){
                $map_results = mysqli_fetch_array($result, MYSQLI_ASSOC);
            }
            $map_id = $map_results['id'];
            $query_string = "SELECT * FROM seats WHERE belong='{$map_id}'";
            if($seats_result = mysqli_query($connection, $query_string)){
                $seats_results = mysqli_fetch_all($seats_result, MYSQLI_ASSOC);
            }
            $arr_con = count($seats_results);
            for($i = 0; $i < $arr_con; $i++){
                $seat_id = $seats_results[$i]['id'];
                $query_string = "SELECT * FROM belong WHERE seat='{$seat_id}'";
                if($result = mysqli_query($connection, $query_string)){
                    if(mysqli_num_rows($result)){
                        $belong_result = mysqli_fetch_array($result, MYSQLI_ASSOC);
                        $seats_results[$i]['guest_id'] = $belong_result['guest'];
                    }                    
                }
            }
            $seats_results_json = json_encode($seats_results);
            print_r($seats_results_json);
            break;
    }
}
