import { post_seat_number, post_seats } from "./api.js"
import { convert_seats } from "./scripts.js"
import { selection } from "./main.js"

export const onClick_select_seats = ()=>{
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

export const onClick_add_seats = ()=>{
    var selected = selection.getSelection()
    var seat_string = convert_seats(selected)
    post_seats(map.id, seat_string)
}

export const onClick_add_seat_number = ()=>{
    var selected = selection.getSelection()
    var new_arr = new Array()
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
}
