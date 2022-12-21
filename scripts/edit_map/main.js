import {add_map, add_seats, add_guests, add_belong, add_elements, add_tags, add_groups, add_guests_names } from "./elements.js"
import { onClickOutside, onGuestList, onKeyBordDown, onKeyBordUp, onMapAdd, onScheduling } from "./eventListeners.js"
import hiveSwitch from "../hiveElements/HiveSwitch.js"
import { editSwitchOptions, hiveSwitchOptions, showSwitchOptions, onSelecteblsSwitch, onShowSwitch, onEditSwitch } from "./switchs.js"
import MBloader from "../hiveElements/MBloader.js"
import pop_ups from "./pop_ups.js"

const parsedUrl = new URL(window.location.href)
const loader = new MBloader()
loader.add()
var map_name = parsedUrl.searchParams.get("map_name")

if(map_name){
    loader.start()
    document.getElementsByTagName('title')[0].append(map_name)
    add_map(map_name)
    .then(add_groups)
    .then(add_seats)
    // .then(add_belong)
    // .then(add_guests)
    .then(add_guests_names)
    .then(add_elements)
    .then(add_tags)
    .then(loader.stop)
    .then(()=>{
        document.getElementById('add_button').addEventListener('click', onMapAdd)
        document.addEventListener('mousedown', onClickOutside)
        document.addEventListener("keydown", onKeyBordDown)
        document.addEventListener("keyup", onKeyBordUp)
        document.getElementById('guest_list_input').addEventListener('input', onGuestList)
        document.getElementById('scheduling_button').addEventListener('click', onScheduling)
        document.getElementById('tags_list_button').addEventListener('click', pop_ups.tags.open)
    })
    hiveSwitch(showSwitchOptions, onShowSwitch)
    hiveSwitch(editSwitchOptions, onEditSwitch)
    hiveSwitch(hiveSwitchOptions, onSelecteblsSwitch)
}else{
    var menu = document.getElementById('mneu')
    menu.innerHTML = ''
}