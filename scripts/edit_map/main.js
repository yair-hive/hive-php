import {add_map, add_seats, add_guests, add_belong, add_elements, tags_list, tags_list_script} from "./elements.js"
import { onClickOutside, onEditSwitch, onGuestList, onKeyBordDown, onKeyBordUp, onMapAdd, onSelecteblsSwitch, onShowSwitch, on_show_tags } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "../api/api.js"
import hiveSwitch from "../hiveSwitch.js"
import popUp from "../popUp.js"
import { resizeAllInputs } from "../scripts.js"

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
    var tags_pop_up = new popUp('תגיות', tags_list())
    tags_pop_up.onClose = on_show_tags
    tags_pop_up.onOpen = function(){
        tags_list_script()
        .then(()=>{
            resizeAllInputs()
        })
    }
    document.getElementById('add_button').addEventListener('click', onMapAdd)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.getElementById('guest_list_input').addEventListener('input', onGuestList)
    document.getElementById('tags_list_button').addEventListener('click', ()=>{
        tags_pop_up.open()
    })
    add_elements()
    zoom('mainBord')
})
var hiveSwitchOptions = {
    element_id: 'selecteblsSwitch', 
    active: 'cells', 
    keys: ['q', '/']
} 
var editSwitchOptions = {
    element_id: 'editSwitch', 
    active: 'no_edit', 
    keys: ['x', 'ס']
} 
var showSwitchOptions = {
    element_id: 'showSwitch', 
    active: 'tags', 
    keys: ['y', 'ט']
} 
hiveSwitch(showSwitchOptions, onShowSwitch)
hiveSwitch(editSwitchOptions, onEditSwitch)
hiveSwitch(hiveSwitchOptions, onSelecteblsSwitch)