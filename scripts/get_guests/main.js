import { sortTable, sortTableNumber } from "../scripts.js"
import { resizeAllInputs } from "../scripts.js"
import { add_map_id, add_requests, add_seat_number, add_table, add_tags, add_tags_id } from "./elements.js"
import { onClickOutside, onExportTable, onKeyBordDown } from "./eventListeners.js"
import { addBelongSwitch, addGroupsSwitch, addTagsSwitch } from "./switchs.js"
import pop_ups from "./popUps.js"
import MBloader from "../hiveElements/MBloader.js"

addBelongSwitch()

var loader = new MBloader()
loader.add()

document.addEventListener('keydown', onKeyBordDown)
document.addEventListener('mousedown', onClickOutside)
document.getElementById('export').addEventListener('click', onExportTable)
document.getElementById("status").addEventListener('click', ()=>{sortTableNumber(0)})
document.getElementById("first").addEventListener('click', ()=>{sortTable(2)}) 
document.getElementById("last").addEventListener('click', ()=>{sortTable(3)})
document.getElementById("group").addEventListener('click', ()=>{sortTable(5)})
document.getElementById("score").addEventListener('click', ()=>{sortTableNumber(5)})
document.getElementById('add_guests_button').addEventListener('click', pop_ups.add_guests.open)
document.getElementById('import_guests_button').addEventListener('click', pop_ups.import_guests.open)
document.getElementById("groups_list_button").addEventListener('click', pop_ups.guest_groups.open)

// loader.start()
add_map_id()
.then(addGroupsSwitch)
.then(addTagsSwitch)
.then(add_tags_id)
.then(add_table)
// .then(add_seat_number)
// .then(add_tags)
// .then(add_requests)
.then(resizeAllInputs)
.then(loader.stop)