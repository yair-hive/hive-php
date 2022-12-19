import {add_map, add_seats, add_guests, add_belong, add_elements, tags_list, tags_list_script} from "./elements.js"
import { onClickOutside, onEditSwitch, onGuestList, onKeyBordDown, onKeyBordUp, onMapAdd, onScheduling, onSelecteblsSwitch, onShowSwitch, on_show_tags } from "./eventListeners.js"
import { zoom } from "./tooles.js"
import api from "../api/api.js"
import hiveSwitch from "../hiveElements/HiveSwitch.js"
import popUp from "../hiveElements/PopUp.js"
import { resizeAllInputs } from "../scripts.js"
import { editSwitchOptions, hiveSwitchOptions, showSwitchOptions } from "./switchs.js"
import MBloader from "../hiveElements/MBloader.js"

const parsedUrl = new URL(window.location.href)
const loader = new MBloader()
loader.add()
var map_name = parsedUrl.searchParams.get("map_name")

if(map_name){
    loader.start()
    document.getElementsByTagName('title')[0].append(map_name)
    add_map(map_name)
    .then(add_seats)
    .then(add_belong)
    .then(add_guests)
    .then(add_elements)
    .then(loader.stop)
    .then(()=>{
        var tags_pop_up = new popUp('תגיות', tags_list())
        tags_pop_up.onClose = on_show_tags
        tags_pop_up.onOpen = function(pop_up){
            tags_list_script(pop_up)
            .then(()=>{
                resizeAllInputs()
            })
        }
        document.getElementById('add_button').addEventListener('click', onMapAdd)
        document.addEventListener('mousedown', onClickOutside)
        document.addEventListener("keydown", onKeyBordDown)
        document.addEventListener("keyup", onKeyBordUp)
        document.getElementById('guest_list_input').addEventListener('input', onGuestList)
        document.getElementById('scheduling_button').addEventListener('click', onScheduling)
        document.getElementById('tags_list_button').addEventListener('click', ()=>{
            tags_pop_up.open()
        })
        zoom('mainBord')
    })
    hiveSwitch(showSwitchOptions, onShowSwitch)
    hiveSwitch(editSwitchOptions, onEditSwitch)
    hiveSwitch(hiveSwitchOptions, onSelecteblsSwitch)
}else{
    var menu = document.getElementById('mneu')
    menu.innerHTML = ''
}