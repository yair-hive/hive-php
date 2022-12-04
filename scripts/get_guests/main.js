import hiveSwitch from "../hiveSwitch.js"
import { add_guests_table } from "./elements.js"
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
    hiveSwitch(groupsSwitchOptions, onGroupsSwitch)
    hiveSwitch(belongSwitchOptions, onBelongSwitch)
})