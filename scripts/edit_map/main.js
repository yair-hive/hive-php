import {add_map, add_seats, add_guests, add_belong, add_elements} from "./elements.js"
import { onClickOutside, onEditSwitch, onKeyBordDown, onKeyBordUp, onMapAdd, onSelecteblsSwitch, onShowSwitch } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "../api/api.js"
import hiveSwitch from "../hiveSwitch.js"
import scrolling_list from "./scrolling_list.js"

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