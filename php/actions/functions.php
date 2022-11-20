<?php
function allowed($permission){
    if(!empty($_SESSION['permissions'])){
        return in_array($permission, $_SESSION['permissions']);
    }else{
        return false;
    }
}