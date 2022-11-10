import { get_map, get_seats, get_guests_names } from "./api.js"
import {add_map, add_seats, add_guest} from "./elements.js"
import { onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp } from "./eventListeners.js"
import { create_selection, DragToScroll} from "./scripts.js"
import add_match_menu from './add_match_menu.js'

export const selection = create_selection()
export const dragToScroll = new DragToScroll()

const parsedUrl = new URL(window.location.href)
const map_name = parsedUrl.searchParams.get("map_name")
$('title').append(map_name)
let map_data = {}
let guests_data = {}
get_map(map_name).then(map => {
    map_data = map
    add_map(map)
})
.then(() => get_seats(map_name))
.then(seats => add_seats(seats))
.then(() => get_guests_names())
.then((guests) => {add_guest(guests, map_name); guests_data = guests})
.then(()=>{
    selection.resolveSelectables()
    document.getElementById('select_seats').addEventListener('click', onClick_select_seats)
    document.getElementById('select_cells').addEventListener('click', onClick_select_cells)
    document.getElementById('add_seats').addEventListener('click', onClick_add_seats)
    document.getElementById('add_seat_number').addEventListener('click', onClick_add_seat_number)
    document.addEventListener('mousedown', onClick_outside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target)))
})


