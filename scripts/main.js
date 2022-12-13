import { addMBloader, addPopUp } from "./elements.js"
import api from './api/api.js'
import { add_maps_list_pop_up } from "./edit_map/elements.js"

addMBloader()
addPopUp()

var maps_list_pop_up = add_maps_list_pop_up()

var get_maps_button = document.getElementById('get_maps_button')

if(get_maps_button){
    get_maps_button.addEventListener('click', maps_list_pop_up.open)
}

api.user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})