import {add_map, add_seats, add_guests, add_belong, add_elements} from "./elements.js"
import { addOb, addTag, create_col_group, getTag, onClickOutside, onKeyBordDown, onKeyBordUp, onMapAdd, onSelecteblsSwitch, show_total_score } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "../api/api.js"
import hiveSwitch from "../hiveSwitch.js"

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
document.getElementsByTagName('title')[0].append(map_name)

var map_id = ''
api.map.get(map_name).then(map => {add_map(map); map_id = map.id })
.then(() => api.seat.get_all(map_id))
.then(seats => add_seats(seats))
.then(() => add_belong())
.then(() => api.guest.get_all(map_id))
.then(guests => add_guests(guests))
.then(()=>{
    document.getElementById('add_button').addEventListener('click', onMapAdd)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.getElementById('show_score_button').addEventListener('click', show_total_score)
    document.getElementById('add_col_button').addEventListener('click', create_col_group)
    document.getElementById('add_elements_button').addEventListener('click', addOb)
    document.getElementById('add_tags_button').addEventListener('click', addTag)
    document.getElementById('show_tags_button').addEventListener('click', getTag)
    add_elements()
    zoom('mainBord')
})
var hiveSwitchOptions = {
    element_id: 'selecteblsSwitch', 
    active: 'cells', 
    keys: ['x', 'ס']
} 
var editSwitchSwitchOptions = {
    element_id: 'editSwitch', 
    active: 'no_edit', 
    keys: ['x', 'ס']
} 
hiveSwitch(editSwitchSwitchOptions, (active)=>{
    var edit_eles = document.getElementById('edit_menu')
    switch (active) {
        case 'edit':
            edit_eles.style.display = 'block'
            break;
        case 'no_edit':
            edit_eles.style.display = 'none'
            break;
    }
})
hiveSwitch(hiveSwitchOptions, onSelecteblsSwitch)