import { openPopUp } from "../elements.js"
import api from '../api/api.js'
import popUp from "../popUp.js"
var maps_list = document.getElementById('maps_list')

function add_create_map_form(){
    return `<form id='create_map_form'>
        <label for="map_name"> שם המפה </label>
        <br />
        <input type='text' name='map_name'>  
        <br />
        <label for="rows_number"> מספר שורות </label>
        <br />
        <input type='text' name='rows_number'>
        <br />
        <label for="columns_number"> מספר טורים </label>
        <br />
        <input type='text' name='columns_number'> 
        <br /> 
    <form>
    <div id='create_map' class='hive-button'> צור </div>`
}
var create_map_pop_up = new popUp('צור מפה', add_create_map_form())
create_map_pop_up.onOpen = function(pop_up){
    document.getElementById('create_map').addEventListener('click', ()=>{
        api.map.create()
        pop_up.close()
    })
}
document.getElementById('add_map').addEventListener('click', create_map_pop_up.open)
api.map.get_all()
.then((respons)=>{
    if(respons.msg != 'ok'){
        openPopUp('שגיאה', respons.msg)
        return false
    }else{
        return respons.data
    }   
})
.then((maps)=>{
    if(maps){
        for(let map of maps){
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.setAttribute('href', `edit_map.html?map_name=${map}`)
            a.textContent = map
            li.append(a)
            maps_list.append(li)
        }
    }
})