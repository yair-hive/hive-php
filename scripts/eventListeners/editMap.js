import { dragToScroll, selection } from "../main.js"
import { add_guests, add_seats } from "../elements.js"
import add_match_menu from "../add_match_menu.js"
import { seat } from "../api/seat.js"
import { guest } from "../api/guest.js"
import { startMBLoader, stopMBLoader } from "../scripts.js"
import hiveObject from "../hiveObject.js"
import "../lib/jquery.min.js"

const changeSelectables = (selectable, notSelectable)=>{
    hiveObject.map.setSelectables(selectable+"s")
    var buttons = {
        seat:document.getElementById('select_seats'),
        cell:document.getElementById('select_cells')
    }
    buttons[selectable].style.backgroundColor = 'tomato'
    buttons[notSelectable].style.backgroundColor = 'gray'
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    document.querySelectorAll('.'+selectable).forEach(e => e.classList.add('selectable'))
    document.querySelectorAll('.'+notSelectable).forEach(e => e.classList.remove('selectable'))
    selection.resolveSelectables()
}
export const onSelectSeats = ()=>{
    changeSelectables('seat', 'cell')
}
export const onSelectCells = ()=>{
    changeSelectables('cell', 'seat')
}
export const onAddSeats = ()=>{
    startMBLoader()
    let guests_data = {}
    var selected = selection.getSelection()
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach((cell) => {
        var row = cell.getAttribute('row') 
        var col = cell.getAttribute('col')
        seat.create(map_id, row, col)
        .then(()=> {selection.clearSelection(); document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))})
        .then(()=> seat.get_all(map_id).then(seats => add_seats(seats)))
        .then(() => guest.get_all(map_id))
        .then((guests) => {add_guests(guests); guests_data = guests})
        .then(()=> document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target))))
    })
}
export const onAddNumber = ()=>{
    var selected = selection.getSelection()
    var most_l = 100000
    var most_t = 100000
    var most_b = 0
    var most_r = 0
    for(let s of selected){
        for(let class_n of s.classList){
            let r_str = '^col-[0-9]+'
            let reg_ex = new RegExp(r_str)
            if(reg_ex.test(class_n)){
                let r_str = '[0-9]+'
                let reg_ex = new RegExp(r_str)
                let col_num = class_n.match(reg_ex)
                var most_l = Number(most_l) 
                var most_r = Number(most_r)                  
                if(col_num < most_l){
                    most_l = col_num[0]
                }
                if(col_num > most_r){
                    most_r = col_num[0]
                }
            }
        }
    }
    for(let s of selected){
        for(let class_n of s.classList){
            let r_str = '^row-[0-9]+'
            let reg_ex = new RegExp(r_str)
            if(reg_ex.test(class_n)){
                let r_str = '[0-9]+'
                let reg_ex = new RegExp(r_str)
                let row_num = class_n.match(reg_ex)
                most_t = Number(most_t)
                most_b = Number(most_b)
                if(row_num < most_t){
                    most_t = row_num[0]
                }
                if(row_num > most_b){
                    most_b = row_num[0]
                }
            }
        }
    }
    var col_group_name = prompt('Please enter number')
    col_group_name = Number(col_group_name)
    for(let i = most_t; i <= most_b; i++){
        let seats = document.querySelectorAll('.row-'+i+'.selected')
        seats.forEach(function(seat_ele){
            var box = $(seat_ele).children('.num_box')
            box.text(col_group_name)
            var selected_seat_class = box.attr('seat_id')
            seat.create_number(selected_seat_class, col_group_name)     
            col_group_name = col_group_name +1
        })           
    }
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
}
export const onMapAdd = ()=>{
    if(hiveObject.map.selectables === 'cells'){
        onAddSeats()
    }
    if(hiveObject.map.selectables === 'seats'){
        onAddNumber()
    }
}
export const onClick_match_list_item = (event)=>{
    var map = document.getElementById('map').getAttribute('map_id')
    var guest_id = event.target.getAttribute('guest_id')
    var seat_id = event.target.getAttribute('seat')
    var name_box = document.querySelector(`.name_box[seat_id="${seat_id}"]`)
    var guest_ele = document.querySelector(`.match_list[guest_id="${guest_id}"]`)
    var guest_name = guest_ele.getAttribute('guest_name')
    var guest_group = guest_ele.getAttribute('guest_group')   
    document.getElementById('drop_down').remove()
    document.getElementById('name_box_input').remove()
    guest.create_belong(guest_id, seat_id, map)
    .then((res)=>{
        if(res.msg === 'belong'){
            if(confirm('המשתמש כבר משובץ האם אתה רוצה לשבץ מחדש?')){
                guest.update(guest_id, seat_id, map)
                .then(()=>{
                    var other_seat = document.querySelector(`.name_box[guest_name="${guest_name}"]`)
                    if(other_seat) {
                        other_seat.removeAttribute('guest_group')
                        other_seat.removeAttribute('guest_name')
                        other_seat.textContent = ''
                    }
                    name_box.setAttribute('guest_name', guest_name)
                    name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                    name_box.textContent = guest_name 
                })
            }
        }else{
            name_box.setAttribute('guest_name', guest_name)
            name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
            name_box.textContent = guest_name 
        }
    })
}
export const onClick_outside = (event)=>{
    if(event.keyCode != 13){
        if(!event.target.classList.contains('name_box')){
            if(!event.target.classList.contains('drop_down')){
                if(!event.target.classList.contains('match_list')){
                    if(document.getElementById('drop_down')) document.getElementById('drop_down').remove()
                    if(document.getElementById('name_box_input')) document.getElementById('name_box_input').remove()
                }
            }
        }
        if(!event.ctrlKey && !event.metaKey){
            if(selection.getSelection().length !== 0){
                if(!event.target.classList.contains('hive-button')){
                    if(hiveObject.map.selectables === 'cells'){
                        if(!event.target.classList.contains('cell')){
                            selection.clearSelection()
                            document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
                        }
                    }
                    if(hiveObject.map.selectables === 'seats'){
                        if(!event.target.classList.contains('name_box')){
                            selection.clearSelection()
                            document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
                        }
                        if(!event.target.classList.contains('num_box')){
                            selection.clearSelection()
                            document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
                        }
                    }
                }
            }
        }
    }
}
export const onKeyBordDown = (event)=>{
    if(event.key == 'g' || event.key == 'ע'){
        dragToScroll.enable()    
        selection.disable()
    }
    if(event.keyCode == 13){
        onMapAdd()
    }
}
export const onKeyBordUp = ()=>{
    dragToScroll.disable()    
    selection.enable()
}