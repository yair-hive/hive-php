import { post_seat_number, post_seats, create_belong, get_seats, get_guests_names } from "./api.js"
import { convert_seats } from "./scripts.js"
import { dragToScroll, selection } from "./main.js"
import { add_seats } from "./elements.js"
import add_match_menu from "./add_match_menu.js"
import "./lib/jquery.min.js"

var selectables = 'cells'

export const onClick_select_seats = ()=>{
    selectables = 'seats'
    document.getElementById('add_seats').style.display = 'none'
    document.getElementById('add_seat_number').style.display = 'block'
    document.getElementById('select_seats').style.backgroundColor = 'tomato'
    document.getElementById('select_cells').style.backgroundColor = 'gray'
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    var cells = document.querySelectorAll('.cell')
    for(let cell of cells){
        $(cell).removeClass('selectable')
    }
    var seats = document.querySelectorAll('.seat')
    for(let seat of seats){
        $(seat).addClass('selectable')
    }
    selection.resolveSelectables()
}
export const onClick_select_cells = ()=>{
    selectables = 'cells'
    document.getElementById('add_seats').style.display = 'block'
    document.getElementById('add_seat_number').style.display = 'none'
    document.getElementById('select_cells').style.backgroundColor = 'tomato'
    document.getElementById('select_seats').style.backgroundColor = 'gray'
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    var seats = document.querySelectorAll('.seat')
    for(let seat of seats){
        $(seat).removeClass('selectable')
    }
    var cells = document.querySelectorAll('.cell')
    for(let cell of cells){
        $(cell).addClass('selectable')
    }
    selection.resolveSelectables()
}
export const onClick_add_seats = (event)=>{
    var selected = selection.getSelection()
    var seat_string = convert_seats(selected)
    var seats = []
    selected.forEach(e => seats.push({row_num: e.getAttribute('row'), col_num: e.getAttribute('col')}))
    var map_id = document.getElementById('map').getAttribute('map_id')
    var map_name = document.getElementById('map').getAttribute('map_name')
    let guests_data = {}
    post_seats(map_id, seat_string)
    .then(()=> {selection.clearSelection(); document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))})
    .then(()=> get_seats(map_name).then((seats) => {add_seats(seats); console.log(seats)}))
    .then(() => get_guests_names())
    .then((guests) => {guests_data = guests})
    .then(()=> document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target))))
}
export const onClick_add_seat_number = ()=>{
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
        seats.forEach(function(seat){
            var box = $(seat).children('.num_box')
            box.text(col_group_name)
            var selected_seat_class = box.attr('seat_id')
            post_seat_number(selected_seat_class, col_group_name)     
            col_group_name = col_group_name +1
        })           
    }
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
}
export const onClick_outside = (event)=>{
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
                if(selectables === 'cells'){
                    if(!event.target.classList.contains('cell')){
                        selection.clearSelection()
                        document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
                    }
                }
                if(selectables === 'seats'){
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
export const onClick_match_list_item = (event)=>{
    var map = document.getElementById('map').getAttribute('map_name')
    var guest_id = event.target.getAttribute('guest_id')
    var seat_id = event.target.getAttribute('seat')
    var name_box = document.querySelector(`.name_box[seat_id="${seat_id}"]`)
    var guest = document.querySelector(`.match_list[guest_id="${guest_id}"]`)
    var guest_name = guest.getAttribute('guest_name')
    var guest_group = guest.getAttribute('guest_group')
    var other_seat = document.querySelector(`.name_box[guest_name="${guest_name}"]`)
    if(other_seat) {
        other_seat.removeAttribute('guest_group')
        other_seat.removeAttribute('guest_name')
        other_seat.textContent = ''
    }
    name_box.setAttribute('guest_name', guest_name)
    name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
    name_box.textContent = guest_name    
    document.getElementById('drop_down').remove()
    document.getElementById('name_box_input').remove()
    create_belong(guest_id, seat_id, map)
}
export const onKeyBordDown = (event)=>{
    if(event.key == 'g' || event.key == 'ע'){
        dragToScroll.enable()    
        selection.disable()
    }
    if(event.ctrlKey || event.metaKey){
        const map_container = document.querySelector('.map_container')
        if(event.key === ' ') map_container.style.transform = `scale(1)`;        
    }
}
export const onKeyBordUp = ()=>{
    dragToScroll.disable()    
    selection.enable()
}
