import {add_map, add_seats, add_guests, add_belong} from "../elements.js"
import { onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp } from "../eventListeners.js"
import { startLoader, stopLoader, zoom } from "../scripts.js"
import { map } from "../api/map.js"
import { seat } from "../api/seat.js"
import { guest } from "../api/guest.js"
import "../lib/jquery.min.js"
import { dragToScroll, selection } from "../main.js"
import add_match_menu from '../add_match_menu.js'

startLoader()
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
    document.getElementById('select_seats').addEventListener('click', onClick_select_seats)
    document.getElementById('select_cells').addEventListener('click', onClick_select_cells)
    document.getElementById('add_seats').addEventListener('click', onClick_add_seats)
    document.getElementById('add_seat_number').addEventListener('click', onClick_add_seat_number)
    document.addEventListener('mousedown', onClick_outside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.getElementById('mainBord').addEventListener('wheel', zoom)
    document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target)))
})