import { onSeatName } from "./eventListeners.js"
import "../lib/jquery.min.js"
import { zoom } from "./tooles.js"

const mainBord = document.getElementById('mainBord')

export function cell(row, col){
    var cellContainer = document.createElement('div')
    var cell = document.createElement('div')
    cellContainer.classList.add('cell_cont')
    cellContainer.setAttribute('row', row)
    cellContainer.setAttribute('col', col)
    cell.classList.add('cell')
    cell.classList.add('selectable')
    cellContainer.append(cell)
    return cellContainer
}
export function map(rows_number, columns_number){
    const map_ele = document.createElement('div')
    map_ele.setAttribute('id', 'map')
    map_ele.setAttribute('selectables', 'cell')
    map_ele.setAttribute('isZoomed', 'false')
    map_ele.setAttribute('edit', 'no')
    map_ele.classList.add('map')
    map_ele.style.setProperty('--map-rows', rows_number)
    map_ele.style.setProperty('--map-cols', columns_number)
    zoom('mainBord')
    return map_ele
}
export function seat(seat_data, guest){
    var groups = JSON.parse(mainBord.getAttribute('groups'))
    var seat_ele = document.createElement('div')
    seat_ele.setAttribute('seat_id', seat_data.id)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
    if(guest) {
        guest.group_data = groups[guest.guest_group]
        guest.full_name = guest.last_name  + " " + guest.first_name
        name_box.setAttribute('guest_id', guest.id)
        name_box.setAttribute('guest_name', guest.full_name)
        name_box.setAttribute('guest_group', guest.group_data.group_name)
        name_box.textContent = guest.full_name
        if(guest.full_name.length > 15) name_box.style.fontSize = '11px';
        name_box.style.backgroundColor = guest.group_data.color
    }
    num_box.classList.add('num_box')
    name_box.classList.add('name_box')
    seat_ele.classList.add('seat')
    $(name_box).attr('seat_id', seat_data.id)
    $(num_box).attr('seat_id', seat_data.id)
    $(num_box).text(seat_data.seat_number)
    seat_ele.append(num_box)
    seat_ele.append(name_box)
    name_box.addEventListener('click', onSeatName)
    return seat_ele
}
export function rowSelector(num, type){
    var selector_cont = document.createElement('div')
    selector_cont.classList.add('selector_cont')
    var selector = document.createElement('div')
    selector.classList.add('row_selector')
    selector.textContent = num
    selector.setAttribute('num', num)
    selector.setAttribute('type', type)
    selector.classList.add('hive-button')
    selector_cont.append(selector)
    selector.addEventListener('click', (event)=>{ 
        var map = document.getElementById('map')
        document.querySelectorAll('.row_selector').forEach(e => e.classList.remove('active'))      
        event.target.classList.add('active')
        document.querySelectorAll('.sle').forEach(e => e.classList.remove('sle'))
        var num = event.target.getAttribute('num')
        var type = event.target.getAttribute('type')
        map.setAttribute('p_selectables', map.getAttribute('selectables'))
        map.setAttribute('selectables', type)
        map.setAttribute('to_delete', num)
        document.querySelectorAll(`[${type} = '${num}']`).forEach((e)=>{
            e.classList.add('sle')
        })
    })
    if(num == 0) selector_cont.style.opacity = 0
    return selector_cont
}
export function cellContainer(seat, seat_ele){
    var cellContainer = document.querySelector(`.cell_cont[row ="${seat.row_num}"][col = "${seat.col_num}"]`)
    cellContainer.replaceChildren(seat_ele)
}