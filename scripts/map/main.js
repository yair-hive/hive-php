import {add_map, add_seats, add_guests, add_belong} from "./elements.js"
import { changeSelectables, onClickOutside, onKeyBordDown, onKeyBordUp, onMapAdd } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "../api/api.js"
import { hiveSwitch } from "../elements.js"

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
document.getElementsByTagName('title')[0].append(map_name)
var map_id = ''
var map_data
api.map.get(map_name).then(map => {add_map(map); map_id = map.id; map_data = map })
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
    zoom('mainBord')
    var map = document.getElementById('map')
    var length = map.children.length
    var as_point = map_data.columns_numbe % 1 == 0.5
    console.log(as_point)
    var mid = Math.round(map_data.columns_number / 2)
    var score
    for(let i = 0; i < length; i++){
        var col = map.children[i].getAttribute('col')
        if(as_point){
            if(col < mid) score = col
            if(col == mid) score = col 
        }
        console.log(map.children[i].children[0])
        map.children[i].children[0].innerHTML = score
    }
})
var hiveSwitchOptions = {
    element_id: 'selecteblsSwitch', 
    active: 'select_cells', 
    keys: ['x', 'ס']
} 
hiveSwitch(hiveSwitchOptions, (active)=>{
    switch(active){
        case 'select seats':
            changeSelectables('seat', 'cell')
            break;
        case 'select cells':
            changeSelectables('cell', 'seat')
            break;
    }
})