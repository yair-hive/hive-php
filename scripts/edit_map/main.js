import {add_map, add_seats, add_elements, add_tags } from "./elements.js"
import { onClickOutside, onGuestList, onKeyBordDown, onKeyBordUp, onMapAdd, onMapDelete, onScheduling } from "./eventListeners.js"
import hiveSwitch from "../hiveElements/HiveSwitch.js"
import { editSwitchOptions, hiveSwitchOptions, showSwitchOptions, onSelecteblsSwitch, onShowSwitch, onEditSwitch, loader } from "./switchs.js"
import pop_ups from "./pop_ups.js"
import { add_belongs_data, add_elements_data, add_groups_data, add_guests_data, add_map_data, add_seats_data, add_tags_belongs_data, add_tags_data } from "./map_data.js"

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
document.getElementsByTagName('title')[0].append(map_name)

if(map_name){

    loader.start()

    await add_map_data(map_name)
    await add_groups_data()
    await add_guests_data()
    await add_belongs_data()
    await add_seats_data()
    await add_elements_data()
    await add_tags_data()
    await add_tags_belongs_data()

    add_map()
    add_seats()
    add_elements()
    add_tags()

    loader.stop()

    document.getElementById('add_button').addEventListener('click', onMapAdd)
    document.getElementById('delete_button').addEventListener('click', onMapDelete)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener("keydown", onKeyBordDown)
    document.addEventListener("keyup", onKeyBordUp)
    document.getElementById('guest_list_input').addEventListener('input', onGuestList)
    document.getElementById('scheduling_button').addEventListener('click', onScheduling)
    document.getElementById('tags_list_button').addEventListener('click', pop_ups.tags.open)

    hiveSwitch(showSwitchOptions, onShowSwitch)
    hiveSwitch(editSwitchOptions, onEditSwitch)
    hiveSwitch(hiveSwitchOptions, onSelecteblsSwitch)
}else{
    var menu = document.getElementById('mneu')
    menu.innerHTML = ''
}