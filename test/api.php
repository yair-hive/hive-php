<?php
    if(!empty($_POST['action'])){
        $m['msg'] = 'all ok';
        $m_j = json_encode($m);
        print_r($m_j);
        print_r($_POST);
    }else{
        $m['msg'] = 'error';
        $m_j = json_encode($m);
        print_r($m_j);
        print_r($_POST);
    }
?>