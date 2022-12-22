import { onSeatName } from "./eventListeners.js"
import "../lib/jquery.min.js"
import { respondToVisibility } from "./tooles.js"
import api from "../api/api.js"
import { zoom } from "./tooles.js"

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
    zoom('mainBord')
    return map_ele
}
function seat(seat_data){
    var map_ele = document.getElementById('map')
    var groups = JSON.parse(map_ele.getAttribute('new_groups'))
    var seat_ele = document.createElement('div')
    seat_ele.setAttribute('seat_id', seat_data.id)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
    if(seat_data.guest) {
        seat_data.guest.group_data = groups[seat_data.guest.guest_group]
        seat_data.guest.full_name = seat_data.guest.first_name + " " + seat_data.guest.last_name
        name_box.setAttribute('guest_id', seat_data.guest.id)
        name_box.setAttribute('guest_name', seat_data.guest.full_name)
        name_box.setAttribute('guest_group', seat_data.guest.group_data.group_name)
        name_box.textContent = seat_data.guest.full_name
        if(seat_data.guest.full_name.length > 15) name_box.style.fontSize = '11px';
        name_box.style.backgroundColor = seat_data.guest.group_data.color
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
function cellContainer(seat, seat_ele){
    var cellContainer = document.querySelector(`.cell_cont[row ="${seat.row_num}"][col = "${seat.col_num}"]`)
    cellContainer.replaceChildren(seat_ele)
}
export const add_map = (map_name)=>{
    return new Promise((resolve) => {
        api.map.get(map_name).then(map_data => {
            const map_ele = map(map_data)
            for(var rowsCounter = 1; rowsCounter <= map_data.rows_number; rowsCounter++){
                for(var colsCounter = 1; colsCounter <= map_data.columns_number; colsCounter++){
                    map_ele.appendChild(cell(rowsCounter, colsCounter))
                }
            }
            resolve()
            document.getElementById('map_container').append(map_ele)
        })
    })
}
export const add_groups = ()=>{
    return new Promise((resolve, reject) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        api.guest.get_all_groups(map_id)
        .then((groups)=>{
            var groups_to_press = {}
            for(let group of groups){
                groups_to_press[group.id] = group
            }
            map_ele.setAttribute('new_groups', JSON.stringify(groups_to_press))
        })
        .then(resolve)
    })
}
export const add_seats = ()=>{
    return new Promise((resolve) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        api.seat.get_all_and_all(map_id)
        // .then(res => console.log(res))
        // api.seat.get_all(map_id)
        .then(seats => {
            if(seats.length == 0) resolve()
            for(let seat_data of seats){
                cellContainer(seat_data, seat(seat_data))
            }
            resolve()
        })
    })
}
export const add_belong = ()=>{
    return new Promise((resolve) => {
        var name_boxs =  document.querySelectorAll('.name_box')
        var l = name_boxs.length
        var i = 0
        name_boxs.forEach(element => {
            i++
            var seat_id = element.getAttribute('seat_id')
            if(i == l) resolve()
            api.seat.get_belong(seat_id)
            .then(belong => {
                if(belong[0]) element.setAttribute('guest_id', belong[0].guest)
                else return
            })
        })
    })
}
export const add_guests = ()=>{
    return new Promise((resolve) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        api.guest.get_all(map_id)
        .then((guests)=> {
            api.guest.get_all_groups(map_id)
            .then((groups)=>{
                var name_boxs = document.querySelectorAll('.name_box')
                var l = guests.length
                var i = 1
                if(l == 0) resolve()
                for(var c = 0; c < l; c++){
                    var guest_group = guests[c].guest_group
                    for(let group of groups){
                        if(group.id == guest_group){
                            guests[c].color = group.color
                            guests[c].group_id = guests[c].guest_group
                            guests[c].guest_group = group.group_name
                            guests[c].score = Number(guests[c].score) + Number(group.score)
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
                            respondToVisibility(name_box, resolve)
                        }
                    }
                }) 
                var groups_press = JSON.stringify(groups)
                var guests_press = JSON.stringify(guests)
                map_ele.setAttribute('guests', guests_press)
                map_ele.setAttribute('groups', groups_press)
                resolve()
            })
        })
    })
}
export const add_guests_names = ()=>{
    return new Promise(async (resolve) => {
        var groups_s = {}
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        var guests = await api.guest.get_all_and_ditails(map_id)
        var groups = await api.guest.get_all_groups(map_id)
        for(let group of groups){
            groups_s[group.id] = group
        }
        guests.map(guest => {
            guest.score = Number(guest.score) + Number(groups_s[guest.guest_group].score)
            return guest
        })
        var groups_press = JSON.stringify(groups)
        var guests_press = JSON.stringify(guests)
        // console.log(guests)
        map_ele.setAttribute('guests', guests_press)
        map_ele.setAttribute('groups', groups_press)
        resolve()
    })
}
export function add_elements(){
    return new Promise((resolve) => {
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
                ob_ele.classList.add('map_ob')
                ob_ele.classList.add('ele')
                document.getElementById('map').insertBefore(ob_ele, next_cell)
                var per = ob_ele.getBoundingClientRect()
                if(per.height > per.width) ob_name_ele.style.transform = 'rotate(90deg)';               
            }
            resolve()
        })
    })
}
export function add_tags(){
    return new Promise(async (resolve) => {
        var names = []
        var tags_data = []
        var map = document.getElementById('map')
        var map_id = map.getAttribute('map_id')
        var res = await api.tags.get_tags({map_id: map_id})
        var map_tags = {}
        res.map(tag => {
            map_tags[tag.id] = tag
        })
        map.setAttribute('tags', JSON.stringify(map_tags))
        var res = await api.seat_groups.get_groups_tags(map_id)
        for(let group_name of res){
            if(names.indexOf(group_name.tag_name) === -1){
                names.push(group_name.tag_name)
                tags_data.push(group_name)
            }
        }
        for(let tag of tags_data){
            var name = tag.tag_name
            var seats = await api.seat_groups.get_seats_tags(map_id, name)
            seats = seats.map(seat => seat.seat)
            for(let seat of seats){
                var seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                var seat_tags = seat_ele.getAttribute('tags')
                if(seat_tags){
                    var seat_tags_press = JSON.parse(seat_tags)
                }else{
                    var seat_tags_press = []
                }
                seat_tags_press.push(tag)
                seat_ele.setAttribute('tags', JSON.stringify(seat_tags_press))
            }
        }
        resolve()
    })
}
