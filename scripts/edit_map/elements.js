import { onSeatName } from "./eventListeners.js"
import "../lib/jquery.min.js"
import { respondToVisibility } from "./tooles.js"
import api from "../api/api.js"
import MBloader from "../MBloader.js"

const loader = new MBloader()
loader.add()

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
    map_ele.setAttribute('edit', 'no')
    map_ele.classList.add('map')
    map_ele.setAttribute('rows', map.rows_number)
    map_ele.setAttribute('cols', map.columns_number)
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
    loader.start()
    const map_ele = map(map_data)
    for(var rowsCounter = 1; rowsCounter <= map_data.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map_data.columns_number; colsCounter++){
            map_ele.appendChild(cell(rowsCounter, colsCounter))
        }
    }
    document.getElementById('map_container').append(map_ele)
    loader.stop()
}
export const add_seats = (seats)=>{
    loader.start()
    if(seats.length == 0) loader.stop()
    for(let seat_data of seats){
        cellContainer(seat_data, seat(seat_data))
    }
    loader.stop()
}
export const add_belong = ()=>{
    loader.start()
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
                loader.stop()
            }
        })
    })
}
export const add_guests = (guests)=>{
    loader.start()
    var map_ele = document.getElementById('map')
    var map_id = map_ele.getAttribute('map_id')
    api.guest.get_all_groups(map_id)
    .then((groups)=>{
        var groups_press = JSON.stringify(groups)
        var guests_press = JSON.stringify(guests)
        map_ele.setAttribute('guests', guests_press)
        map_ele.setAttribute('groups', groups_press)
        var name_boxs = document.querySelectorAll('.name_box')
        var l = guests.length
        var i = 1
        if(l == 0){
            loader.stop()
        }
        for(var c = 0; c < l; c++){
            var guest_group = guests[c].guest_group
            for(let group of groups){
                if(group.group_name == guest_group){
                    guests[c].color = group.color
                }
            }
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
                    if(corrent.color){
                        name_box.style.backgroundColor = corrent.color
                    }            
                }
                if(i == l){
                    respondToVisibility(name_box, loader.stop)
                }
            }
        }) 
        loader.stop()
    })
}
export function add_elements(){
    var map = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_ob(map)
    .then(res => {
        for(let ob of res){
            ob.from_row = Number(ob.from_row)
            ob.from_col = Number(ob.from_col)
            ob.to_col = Number(ob.to_col)
            ob.to_row = Number(ob.to_row)
            var row, col
            for(row = ob.from_row; row <= ob.to_row; row++){
                for(col = ob.from_col; col <= ob.to_col; col++){
                    var cell = document.querySelector('.cell_cont[row="'+row+'"][col="'+col+'"]')
                    if(cell) cell.remove()
                }
            }
            row++
            var next_cell = document.querySelector('.cell_cont[row="'+row+'"][col="'+col+'"]')
            var to_col = Number(ob.to_col) + 1
            var to_row = Number(ob.to_row) + 1
            var ob_ele = document.createElement('div')
            ob_ele.classList.add('ob_ele')
            var ob_name_ele = document.createElement('div')
            ob_name_ele.textContent = ob.ob_name
            ob_ele.append(ob_name_ele)
            ob_ele.style.gridColumnStart = ob.from_col
            ob_ele.style.gridRowStart = ob.from_row
            ob_ele.style.gridColumnEnd = to_col.toString()
            ob_ele.style.gridRowEnd = to_row.toString()
            ob_ele.style.backgroundColor = 'rgb(0, 0, 0, 0)'
            ob_ele.classList.add('selectable')
            ob_ele.classList.add('ele')
            document.getElementById('map').insertBefore(ob_ele, next_cell)
            var per = ob_ele.getBoundingClientRect()
            if(per.height > per.width) ob_name_ele.style.transform = 'rotate(90deg)';
        }
    })
}