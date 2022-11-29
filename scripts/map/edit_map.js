import {add_map, add_seats, add_guests, add_belong} from "./elements.js"
import { onClickOutside, onKeyBordDown, onKeyBordUp, onMapAdd, onSelectCells, onSelectSeats } from "./eventListeners.js"
import { startMBLoader, zoom } from "../scripts.js"
import { map } from "../api/map.js"
import { seat } from "../api/seat.js"
import { guest } from "../api/guest.js"
import "../lib/jquery.min.js"
import { addMBloader } from "../elements.js"

addMBloader()
startMBLoader()
const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
document.getElementsByTagName('title')[0].append(map_name)
var map_id = ''
map.get(map_name).then(map => {add_map(map); map_id = map.id })
.then(() => seat.get_all(map_id))
.then(seats => add_seats(seats))
.then(() => add_belong())
.then(() => guest.get_all(map_id))
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