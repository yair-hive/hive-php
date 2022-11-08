import { get_map, get_seats, get_guests_names } from "./api.js"
import {add_map, add_seat, add_guest_details} from "./elements.js"
import { onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats } from "./eventListeners.js"
import { create_selection } from "./scripts.js"

export const selection = create_selection()

const load_content = async function(){
    const parsedUrl = new URL(window.location.href)
    const map_name = parsedUrl.searchParams.get("map_name")
    $('title').append(map_name)
    var map = await get_map(map_name)
    add_map(map)
    var seats = await get_seats(map_name)
    for(let seat of seats){
        add_seat(seat)
    }
    var guests_list = await get_guests_names()
    selection.resolveSelectables()
    add_guest_details(guests_list, map_name)
    document.getElementById('add_seats').setAttribute('map_id', map.id)
    document.getElementById('add_seat_number').setAttribute('map_id', map.id)
    document.getElementById('select_seats').addEventListener('click', onClick_select_seats)
    document.getElementById('select_cells').addEventListener('click', onClick_select_cells)
    document.getElementById('add_seats').addEventListener('click', onClick_add_seats)
    document.getElementById('add_seat_number').addEventListener('click', onClick_add_seat_number)
    document.addEventListener('mousedown', onClick_outside)
}
load_content()


