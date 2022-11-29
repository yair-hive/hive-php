import {add_map, add_seats, add_guests, add_belong} from "./elements.js"
import { onClickOutside, onKeyBordDown, onKeyBordUp, onMapAdd, onSelectCells, onSelectSeats } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "./api/api.js"

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
    document.getElementById('select_seats').addEventListener('click', onSelectSeats)
    document.getElementById('select_cells').addEventListener('click', onSelectCells)
    document.getElementById('add_button').addEventListener('click', onMapAdd)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    zoom('mainBord')
})