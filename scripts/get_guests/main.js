import hiveSwitch from "../hiveSwitch.js"
import popUp from "../popUp.js"
import { resizeAllInputs } from "../scripts.js"
import { add_guests_table, add_guest_form, add_guest_form_script, groups_list, groups_list_script, import_guest_form, import_guest_form_script } from "./elements.js"
import { onExportTable, onBelongSwitch, onKeyBordDown, onGroupsSwitch } from "./eventListeners.js"

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
var table = document.getElementById('names_table') 

var belongSwitchOptions = {
    element_id: 'belongSwitch', 
    active: 'ShowAll', 
    keys: ['x', 'ס']
} 
var groupsSwitchOptions = {
    element_id: 'groupsSwitch', 
    active: 'all', 
    keys: ['q', '/']
} 
document.addEventListener('keydown', onKeyBordDown)

document.getElementById('export').addEventListener('click', onExportTable)

var add_guests_pop_up = new popUp('הוסף בחור', add_guest_form())
add_guests_pop_up.onOpen = add_guest_form_script
document.getElementById('add_guests_button').addEventListener('click', add_guests_pop_up.open)
var import_guests_pop_up = new popUp('ייבא בחורים', import_guest_form())
import_guests_pop_up.onOpen = import_guest_form_script
document.getElementById('import_guests_button').addEventListener('click', import_guests_pop_up.open)
var guest_groups_pop_up = new popUp('בחורים', groups_list())
guest_groups_pop_up.onOpen = groups_list_script
document.getElementById("groups_list_button").addEventListener('click', guest_groups_pop_up.open)

add_guests_table(map_name, table)
.then(()=>{
    hiveSwitch(groupsSwitchOptions, onGroupsSwitch)
    hiveSwitch(belongSwitchOptions, onBelongSwitch)
    resizeAllInputs()
})