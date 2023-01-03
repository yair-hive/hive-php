import "../lib/jquery.min.js"
import api from "../api/api.js"
import { cell, cellContainer, map, rowSelector, seat } from "./core_elements.js"

export function add_col(col){
    col = Number(col)
    const map = document.getElementById('map')
    const rows = Number(map.getAttribute('rows'))
    const cols = Number(map.getAttribute('cols')) +2
    var next_col = col +2
    document.querySelectorAll('.cell_cont').forEach(e =>{
        var e_col = Number(e.getAttribute('col'))
        if(e_col > col) e.setAttribute('col', e_col+1)
    })
    for(let i = 1; i <= rows; i++){
        var cell_cont = cell(i, col+1)
        var next_cell = document.querySelector(`.cell_cont[row ="${i}"][col = "${next_col}"]`)
        map.insertBefore(cell_cont, next_cell)
    }
    var next_selector_cont = document.querySelector(`.row_selector[type = "row"][num = "1"]`).parentNode
    var new_row_selector = rowSelector(cols, 'col')
    new_row_selector.classList.add('active')
    console.log(new_row_selector)
    map.insertBefore(new_row_selector, next_selector_cont)
    map.style.setProperty('--map-cols', cols)
    map.setAttribute('cols', (cols -1))
}
export function add_row(row){
    row = Number(row)
    const map = document.getElementById('map')
    const rows = Number(map.getAttribute('rows')) +2
    const cols = Number(map.getAttribute('cols')) 
    var next_row = row +2
    document.querySelectorAll('.cell_cont').forEach(e =>{
        var e_row = Number(e.getAttribute('row'))
        if(e_row > row) e.setAttribute('row', e_row+1)
    })
    var next_cell = document.querySelector(`.cell_cont[row = "${next_row}"][col = "1"]`)
    for(let i = 1; i <= cols; i++){
        var cell_cont = cell(row+1, i)
        map.insertBefore(cell_cont, next_cell)
    }
    var next_selector_cont = document.querySelector(`.cell_cont[row = "${rows-1}"][col = "1"]`)
    var new_row_selector = rowSelector(rows-1, 'row')
    new_row_selector.classList.add('active')
    map.insertBefore(new_row_selector, next_selector_cont)
    map.style.setProperty('--map-rows', rows)
    map.setAttribute('rows', (rows -1))
}
export function addRowsSelector(){
    const mainBord = document.getElementById('mainBord')
    const map = document.getElementById('map')
    const rows = map.getAttribute('rows')
    const cols = map.getAttribute('cols')
    const rows_selectors = document.createElement('div')
    rows_selectors.classList.add('rows_selectors')
    const cols_selectors = document.createElement('div')
    cols_selectors.classList.add('cols_selectors')
    for(let r = 0; r <= rows; r++){
        rows_selectors.append(rowSelector(r, 'row'))
    }
    for(let c = 0; c <= cols; c++){
        cols_selectors.append(rowSelector(c, 'col'))
    }
    mainBord.append(cols_selectors)
    mainBord.append(rows_selectors)
}
export const add_map = (map_name)=>{
    return new Promise((resolve) => {
        api.map.get(map_name).then(map_data => {
            const map_ele = map(map_data)
            for(var rowsCounter = 0; rowsCounter <= map_data.rows_number; rowsCounter++){
                if(rowsCounter != 0){
                    for(var colsCounter = 0; colsCounter <= map_data.columns_number; colsCounter++){
                        if(colsCounter != 0){
                            map_ele.appendChild(cell(rowsCounter, colsCounter))
                        }else{
                            map_ele.appendChild(rowSelector(rowsCounter, 'row'))
                        }
                    }
                }else{
                    for(var colsCounter = 0; colsCounter <= map_data.columns_number; colsCounter++){
                        map_ele.appendChild(rowSelector(colsCounter, 'col'))
                    }
                }
            }
            resolve()
            document.getElementById('map_container').append(map_ele)
        })
    })
}
export const add_groups = ()=>{
    return new Promise((resolve) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        api.guest.get_all_groups(map_id)
        .then((groups)=>{
            var groups_to_press = {}
            for(let group of groups){
                groups_to_press[group.id] = group
            }
            map_ele.setAttribute('groups', JSON.stringify(groups_to_press))
        })
        .then(resolve)
    })
}
export const add_seats = ()=>{
    return new Promise((resolve) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        api.seat.get_all_and_all(map_id)
        .then(seats => {
            if(seats.length == 0) resolve()
            for(let seat_data of seats){
                cellContainer(seat_data, seat(seat_data))
            }
            resolve()
        })
    })
}
export const add_guests = ()=>{
    return new Promise(async (resolve) => {
        var map_ele = document.getElementById('map')
        var map_id = map_ele.getAttribute('map_id')
        var guests = await api.guest.get_all_and_ditails({map_id: map_id})
        var groups = JSON.parse(map_ele.getAttribute('groups'))
        guests.map(guest => {
            if(groups[guest.guest_group]) guest.score = Number(guest.score) + Number(groups[guest.guest_group].score)
            return guest
        })
        var guests_press = JSON.stringify(guests)
        map_ele.setAttribute('guests', guests_press)
        resolve()
    })
}
export function add_elements(){
    return new Promise((resolve) => {
        var map_ele = document.getElementById('map')
        var map = document.getElementById('map').getAttribute('map_id')
        api.map_elements.get(map)
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
                var to_col = Number(ob.to_col) +1
                var to_row = Number(ob.to_row) +1
                if(map_ele.getAttribute('edit') == 'yes'){
                    to_col++
                    to_row++
                    ob.from_col = Number(ob.from_col) +1
                    ob.from_row = Number(ob.from_row) +1

                }
                var ob_ele = document.createElement('div')
                ob_ele.setAttribute('from_col', ob.from_col)
                ob_ele.setAttribute('from_row', ob.from_row)
                ob_ele.setAttribute('to_col', to_col.toString())
                ob_ele.setAttribute('to_row', to_row.toString())
                ob_ele.classList.add('ob_ele')
                ob_ele.setAttribute('ob_id', ob.id)
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
        const map = document.getElementById('map')
        const map_id = map.getAttribute('map_id')
        var res = await api.tags.get_tags({map_id: map_id})
        var belongs = await api.tags.get_all_belongs(map_id)
        var map_tags = {}
        res.map(tag => {
            map_tags[tag.id] = tag
        })
        map.setAttribute('tags', JSON.stringify(map_tags))

        for(let belong of belongs){
            var seat_ele = document.querySelector('.seat[seat_id = "'+belong.seat+'"]')
            var seat_tags = seat_ele.getAttribute('tags')
            if(seat_tags){
                var seat_tags_press = JSON.parse(seat_tags)
            }else{
                var seat_tags_press = []
            }
            seat_tags_press.push(map_tags[belong.group_id])
            seat_ele.setAttribute('tags', JSON.stringify(seat_tags_press))
        }
        resolve()
    })
}
