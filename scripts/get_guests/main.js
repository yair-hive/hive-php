import hiveSwitch from "../hiveSwitch.js"
import popUp from "../popUp.js"
import { resizeAllInputs } from "../scripts.js"
import { add_guests_table, groups_list, groups_list_script } from "./elements.js"
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

add_guests_table(map_name, table)
.then(()=>{
    var guest_groups_pop_up = new popUp('בחורים', groups_list())
    guest_groups_pop_up.onOpen = groups_list_script
    hiveSwitch(groupsSwitchOptions, onGroupsSwitch)
    hiveSwitch(belongSwitchOptions, onBelongSwitch)
    document.getElementById("groups_list_button").addEventListener('click', ()=> {
        guest_groups_pop_up.open()
    })
    resizeAllInputs()
})