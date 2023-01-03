import { create_selection, DragToScroll } from "./tooles.js"
import { add_guests, } from "./elements.js"
import api from "../api/api.js"
import MBloader from "../hiveElements/MBloader.js"
import { on_show_score, on_show_tags } from "./eventListeners.js"

export const loader = new MBloader()
export const selection = create_selection()
export const dragToScroll = DragToScroll()
dragToScroll.enable()    
selection.disable()

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
    var map_rows = Number(map.getAttribute('rows'))
    var map_cols = Number(map.getAttribute('cols')) 
    switch (active) {
        case 'edit':
            document.querySelectorAll('.row_selector').forEach(e => e.classList.remove('active'))      
            document.querySelectorAll('.sle').forEach(e => e.classList.remove('sle'))
            document.querySelectorAll('.selector_cont').forEach(e => e.classList.add('active'))
            map.style.setProperty('--map-rows', (map_rows +1))
            map.style.setProperty('--map-cols', (map_cols +1))
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
            document.querySelectorAll('.ob_ele').forEach(e => {
                var from_col = e.getAttribute('from_col')
                var from_row = e.getAttribute('from_row')
                var to_col = e.getAttribute('to_col')
                var to_row = e.getAttribute('to_row')
                from_col = Number(from_col) +1
                from_row = Number(from_row) +1
                to_col = Number(to_col) +1
                to_row = Number(to_row) +1
                e.style.gridColumnStart = from_col.toString()
                e.style.gridRowStart = from_row.toString()
                e.style.gridColumnEnd = to_col.toString()
                e.style.gridRowEnd = to_row.toString()
            })
            break;
        case 'no edit':
            document.querySelectorAll('.row_selector').forEach(e => e.classList.remove('active'))      
            document.querySelectorAll('.sle').forEach(e => e.classList.remove('sle'))
            document.querySelectorAll('.ob_ele').forEach(e => {
                var from_col = e.getAttribute('from_col')
                var from_row = e.getAttribute('from_row')
                var to_col = e.getAttribute('to_col')
                var to_row = e.getAttribute('to_row')
                e.style.gridColumnStart = from_col
                e.style.gridRowStart = from_row
                e.style.gridColumnEnd = to_col
                e.style.gridRowEnd = to_row
            })
            document.querySelectorAll('.selector_cont').forEach(e => e.classList.remove('active'))
            map.style.setProperty('--map-rows', map_rows)
            map.style.setProperty('--map-cols', map_cols)
            edit_menu.style.display = 'none'
            map_menu.style.display = 'flex'
            map.setAttribute('edit', 'no')
            var map_id = document.getElementById('map').getAttribute('map_id')
            document.querySelectorAll('.name_box').forEach(e => e.textContent = '')
            api.guest.get_all({map_id: map_id})
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