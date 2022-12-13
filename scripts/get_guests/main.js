import hiveSwitch from "../hiveElements/HiveSwitch.js"
import popUp from "../hiveElements/PopUp.js"
import { resizeAllInputs } from "../scripts.js"
import { add_guests_table, add_map_id } from "./elements.js"
import { add_guest_form, add_guest_form_script, groups_list, groups_list_script, import_guest_form, import_guest_form_script } from "./popUps.js"
import { onExportTable, onKeyBordDown } from "./eventListeners.js"
import { addBelongSwitch, addGroupsSwitch, addTagsSwitch } from "./switchs.js"

document.addEventListener('keydown', onKeyBordDown)

document.getElementById('export').addEventListener('click', onExportTable)

addBelongSwitch()

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
.then(addTagsSwitch)
.then(add_guests_table)
.then(resizeAllInputs)