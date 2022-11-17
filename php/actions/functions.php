<?php
function allowed($permission){
    $allwod = false;
    if(!empty($_SESSION['permissions'])){
        foreach($_SESSION['permissions'] as $corrent){
            if($corrent == $permission){
                $allwod = true;
            }
        } 
    }
    return $allwod;
}