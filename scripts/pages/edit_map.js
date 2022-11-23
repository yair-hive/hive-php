import {add_map, add_seats, add_guests, add_belong} from "../elements.js"
import { onClick_outside, onKeyBordDown, onKeyBordUp, onMapAdd, onSelectCells, onSelectSeats } from "../eventListeners/editMap.js"
import { startMBLoader, zoom } from "../scripts.js"
import { map } from "../api/map.js"
import { seat } from "../api/seat.js"
import { guest } from "../api/guest.js"
import "../lib/jquery.min.js"
import { dragToScroll, selection } from "../main.js"
import add_match_menu from '../add_match_menu.js'

startMBLoader()
const parsedUrl = new URL(window.location.href)
selection.enable()
var map_name = parsedUrl.searchParams.get("map_name")
$('title').append(map_name)
var map_data = {}
var guests_data = {}
var map_id = ''
map.get(map_name).then(map => {add_map(map); map_data = map; map_id = map.id })
.then(() => seat.get_all(map_id))
.then(seats => {
    add_seats(seats)
})
.then(()=>{add_belong()})
.then(() => guest.get_all(map_id))
.then((guests) => {add_guests(guests); guests_data = guests})
.then(()=>{
    selection.resolveSelectables()
    document.getElementById('select_seats').addEventListener('click', onSelectSeats)
    document.getElementById('select_cells').addEventListener('click', onSelectCells)
    document.getElementById('add_button').addEventListener('click', onMapAdd)
    document.addEventListener('mousedown', onClick_outside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target)))
    zoom('mainBord')
})