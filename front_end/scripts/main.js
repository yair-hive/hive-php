import { get_map, get_seats, get_guests_names } from "./api.js"
import {add_map, add_seats, add_guest_details} from "./elements.js"
import { onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp } from "./eventListeners.js"
import { create_selection, DragToScroll} from "./scripts.js"

export const selection = create_selection()
export const dragToScroll = new DragToScroll()

const parsedUrl = new URL(window.location.href)
const map_name = parsedUrl.searchParams.get("map_name")
$('title').append(map_name)
let map_data = {}
get_map(map_name).then(map => {
    map_data = map
    add_map(map)
})
.then(() => get_seats(map_name))
.then(seats => add_seats(seats))
.then(() => get_guests_names())
.then(guests_list => add_guest_details(guests_list, map_name))
.then(()=>{
    selection.resolveSelectables()
    document.getElementById('add_seats').setAttribute('map_id', map_data.id)
    document.getElementById('add_seat_number').setAttribute('map_id', map_data.id)
    document.getElementById('select_seats').addEventListener('click', onClick_select_seats)
    document.getElementById('select_cells').addEventListener('click', onClick_select_cells)
    document.getElementById('add_seats').addEventListener('click', onClick_add_seats)
    document.getElementById('add_seat_number').addEventListener('click', onClick_add_seat_number)
    document.addEventListener('mousedown', onClick_outside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
})


