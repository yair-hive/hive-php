import hiveSwitch from "../hiveElements/HiveSwitch.js"
import popUp from "../hiveElements/PopUp.js"
import { resizeAllInputs } from "../scripts.js"
import { addGroupsSwitch, addTagsSwitch, add_guests_table, add_guest_form, add_guest_form_script, add_map_id, groups_list, groups_list_script, import_guest_form, import_guest_form_script } from "./elements.js"
import { onExportTable, onBelongSwitch, onKeyBordDown, onGroupsSwitch, onTagsSwitch } from "./eventListeners.js"

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
var tagsSwitchOptions = {
    element_id: 'tagsSwitch', 
    active: 'all', 
    keys: ['b', 'נ']
} 
document.addEventListener('keydown', onKeyBordDown)

document.getElementById('export').addEventListener('click', onExportTable)

hiveSwitch(belongSwitchOptions, onBelongSwitch)

var add_guests_pop_up = new popUp('הוסף בחור', add_guest_form())
add_guests_pop_up.onOpen = add_guest_form_script
document.getElementById('add_guests_button').addEventListener('click', add_guests_pop_up.open)
var import_guests_pop_up = new popUp('ייבא בחורים', import_guest_form())
import_guests_pop_up.onOpen = import_guest_form_script
document.getElementById('import_guests_button').addEventListener('click', import_guests_pop_up.open)
var guest_groups_pop_up = new popUp('בחורים', groups_list())
guest_groups_pop_up.onOpen = groups_list_script
document.getElementById("groups_list_button").addEventListener('click', guest_groups_pop_up.open)
add_map_id()
.then(addGroupsSwitch)
.then(()=>{hiveSwitch(groupsSwitchOptions, onGroupsSwitch)})
.then(addTagsSwitch)
.then(()=>{hiveSwitch(tagsSwitchOptions, onTagsSwitch)})
.then(add_guests_table)
.then(resizeAllInputs)