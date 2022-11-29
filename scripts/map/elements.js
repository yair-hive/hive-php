import { onSeatName } from "./eventListeners.js"
import "../lib/jquery.min.js"
import { respondToVisibility, startMBLoader, stopMBLoader } from "../scripts.js"
import api from "./api/api.js"

function cell(row, col){
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
function map(map){
    const map_ele = document.createElement('div')
    map_ele.setAttribute('map_name', map.map_name)
    map_ele.setAttribute('map_id', map.id)
    map_ele.setAttribute('id', 'map')
    map_ele.setAttribute('selectables', 'cell')
    map_ele.setAttribute('isZoomed', 'false')
    map_ele.classList.add('map')
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    return map_ele
}
function seat(seat_data){
    var seat_ele = document.createElement('div')
    seat_ele.setAttribute('seat_id', seat_data.id)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
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
function cellContainer(seat, seat_ele){
    var cellContainer = document.querySelector(`.cell_cont[row ="${seat.row_num}"][col = "${seat.col_num}"]`)
    cellContainer.replaceChildren(seat_ele)
}
export const add_map = (map_data)=>{
    const map_ele = map(map_data)
    for(var rowsCounter = 1; rowsCounter <= map_data.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map_data.columns_number; colsCounter++){
            map_ele.appendChild(cell(rowsCounter, colsCounter))
        }
    }
    document.getElementById('map_container').append(map_ele)
}
export const add_seats = (seats)=>{
    if(seats.length == 0) stopMBLoader()
    for(let seat_data of seats){
        cellContainer(seat_data, seat(seat_data))
    }
    stopMBLoader()
}
export const add_belong = ()=>{
    startMBLoader()
    var name_boxs =  document.querySelectorAll('.name_box')
    var l = name_boxs.length
    var i = 1
   name_boxs.forEach(element => {
        i++
        var seat_id = element.getAttribute('seat_id')
        api.seat.get_belong(seat_id)
        .then(belong => {
            if(belong[0]) element.setAttribute('guest_id', belong[0].guest)
            else return
        })
        .then(()=>{
            if(i == l){
                stopMBLoader()
            }
        })
    })
}
export const add_guests = (guests)=>{
    startMBLoader()
    var guests_press = JSON.stringify(guests)
    document.getElementById('map').setAttribute('guests', guests_press)
    var name_boxs = document.querySelectorAll('.name_box')
    var l = guests.length
    var i = 1
    if(l == 0){
        stopMBLoader()
    }
    name_boxs.forEach((name_box)=>{
        i++
        var guest_id = name_box.getAttribute('guest_id')
        for(var corrent of guests){
            if(corrent.id == guest_id){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(corrent.name.length > 15) name_box.style.fontSize = '11px';
                corrent.guest_group = corrent.guest_group.replace(" ","_"); 
                name_box.setAttribute('guest_name', corrent.name)
                name_box.setAttribute('guest_group', corrent.guest_group)
                name_box.textContent = corrent.name             
            }
            if(i == l){
                respondToVisibility(name_box, stopMBLoader)
            }
        }
    }) 
    stopMBLoader()
}