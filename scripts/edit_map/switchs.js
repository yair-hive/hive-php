import { create_selection, DragToScroll } from "./tooles.js"
import { add_guests, } from "./elements.js"
import api from "../api/api.js"
import MBloader from "../hiveElements/MBloader.js"
import { on_show_score, on_show_tags } from "./eventListeners.js"

const loader = new MBloader()
const selection = create_selection()
const dragToScroll = DragToScroll()

export var hiveSwitchOptions = {
    element_id: 'selecteblsSwitch', 
    active: 'cells', 
    keys: ['q', '/']
} 
export var editSwitchOptions = {
    element_id: 'editSwitch', 
    active: 'no_edit', 
    keys: ['x', 'ס']
} 
export var showSwitchOptions = {
    element_id: 'showSwitch', 
    active: 'tags', 
    keys: ['y', 'ט']
} 

function changeSelectables(selectable){
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    document.querySelectorAll('.selectable').forEach(e => e.classList.remove("selectable"))
    document.querySelectorAll('.'+selectable).forEach(e => e.classList.add('selectable'))
    selection.resolveSelectables()
}

export function onEditSwitch(active){
    var map = document.getElementById('map')
    var edit_menu = document.getElementById('edit_menu')
    var map_menu = document.getElementById('map_menu')
    switch (active) {
        case 'edit':
            edit_menu.style.display = 'flex'
            map_menu.style.display = 'none'
            map.setAttribute('edit', 'yes')
            dragToScroll.disable()   
            selection.enable()
            map.setAttribute('isZoomed', 'true')
            on_show_tags()
            document.querySelectorAll('.name_box').forEach(box =>{
                box.style.backgroundColor = 'rgba(146, 136, 209, 0.8)'
                box.style.fontSize = '15px'
            })
            break;
        case 'no edit':
            edit_menu.style.display = 'none'
            map_menu.style.display = 'flex'
            map.setAttribute('edit', 'no')
            var map_id = document.getElementById('map').getAttribute('map_id')
            document.querySelectorAll('.name_box').forEach(e => e.textContent = '')
            api.guest.get_all(map_id)
            .then(guests => add_guests(guests))
            break;
    }
}
export function onSelecteblsSwitch(active){
    var map = document.getElementById('map')
    switch(active){
        case 'seats':
            changeSelectables('seat')
            map.setAttribute('selectables', 'seat')
            break;
        case 'cells':
            changeSelectables('cell')
            map.setAttribute('selectables', 'cell')
            break;
        case 'elements':
            map.setAttribute('selectables', 'element')
            changeSelectables('cell')
            document.querySelectorAll('.map_ob').forEach(e => {
                e.classList.add('selectable')
            })
            break;
        case 'tags':
            changeSelectables('seat')
            map.setAttribute('selectables', 'tag')
            break;
    }
}
export function onShowSwitch(active){
    switch (active) {
        case 'tags':
            loader.start()
            on_show_tags()
            .then(loader.stop)
            break;
        case 'score':
            on_show_score()
            break;
    }
}