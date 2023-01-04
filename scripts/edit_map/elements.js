import "../lib/jquery.min.js"
import { cell, cellContainer, map, rowSelector, seat } from "./core_elements.js"

const mainBord = document.getElementById('mainBord')

export function add_col(col){
    col = Number(col)
    const rows = Number(mainBord.getAttribute('rows'))
    const cols = Number(mainBord.getAttribute('cols')) +2
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
    const rows = Number(mainBord.getAttribute('rows')) +2
    const cols = Number(mainBord.getAttribute('cols')) 
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
export function add_map(){
    const rows = mainBord.getAttribute('rows')
    const cols = mainBord.getAttribute('cols')
    const map_ele = map(rows, cols)
    for(var rowsCounter = 0; rowsCounter <= rows; rowsCounter++){
        if(rowsCounter != 0){
            for(var colsCounter = 0; colsCounter <= cols; colsCounter++){
                if(colsCounter != 0){
                    map_ele.appendChild(cell(rowsCounter, colsCounter))
                }else{
                    map_ele.appendChild(rowSelector(rowsCounter, 'row'))
                }
            }
        }else{
            for(var colsCounter = 0; colsCounter <= cols; colsCounter++){
                map_ele.appendChild(rowSelector(colsCounter, 'col'))
            }
        }
    }
    document.getElementById('map_container').append(map_ele)
}
export function add_seats(){
    var new_belongs = {}
    var new_guests = {}
    var seats = JSON.parse(mainBord.getAttribute('seats'))
    var belongs = JSON.parse(mainBord.getAttribute('seats_belongs'))
    var guests = JSON.parse(mainBord.getAttribute('guests'))
    belongs.map(bel => new_belongs[bel.seat] = bel)
    guests.map(guest => new_guests[guest.id] = guest)
    for(let seat_data of seats){
        var guest = null
        if(new_belongs[seat_data.id]){
            var guest_id = new_belongs[seat_data.id].guest
            guest = new_guests[guest_id]
        }
        cellContainer(seat_data, seat(seat_data, guest))
    }
}
export function add_elements(){
    var res = JSON.parse(mainBord.getAttribute('map_elements'))
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
}
export function add_tags(){
    var map_tags = JSON.parse(mainBord.getAttribute('tags'))
    var belongs = JSON.parse(mainBord.getAttribute('tags_belongs'))
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
}
