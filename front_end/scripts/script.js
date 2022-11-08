import { get_map, get_seats, get_guests_names, post_seat_number, post_seats } from "./api.js"
import {add_map, add_seat, add_match_list, add_match_menu, add_guest_details} from "./elements.js"


function get_seat_string(map_id){
    var selected = selection.getSelection()
    var selectedArray = []
    selected.forEach(element => {
        selectedArray.push(element.classList)
    });
    var selectedString = selectedArray.join(' *|* ')
    post_seats(map_id, selectedString)
}

function set_num(){
    $('#sub_1').click(function(){
        var cells = document.querySelectorAll('.cell')
        for(let cell of cells){
            $(cell).addClass('cell_2')
            $(cell).removeClass('cell')
        }
        var cells = document.querySelectorAll('.seat')
        for(let cell of cells){
            $(cell).addClass('cell')
        }
        selection.resolveSelectables()
    })
    $('#sub_2').click(function(){
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
        console.log('col '+most_l+' op '+'row '+most_t)
        console.log('col '+most_r+' op '+'row '+most_b)
        var col_group_name = prompt('Please enter number')
        col_group_name = Number(col_group_name)
        for(let i = most_t; i <= most_b; i++){
            let seats = document.querySelectorAll('.row-'+i+'.selected')
            seats.forEach(function(seat){
                var box = $(seat).children('.num_box')
                box.text(col_group_name)
                var selected_seat_class = box.attr('seat_id')
                console.log(selected_seat_class)
                post_seat_number(selected_seat_class, col_group_name)          
                col_group_name = col_group_name +1
            })           
        }
    })
    $('#sub_3').click(function(){
        var seats = document.querySelectorAll('.seat')
        for(let seat of seats){
            $(seat).removeClass('cell')
        }
        var cells = document.querySelectorAll('.cell_2')
        for(let cell of cells){
            $(cell).addClass('cell')
            $(cell).removeClass('cell_2')
        }
        selection.resolveSelectables()
    })
}

const load_content = async function(){
    const parsedUrl = new URL(window.location.href)
    const map_name = parsedUrl.searchParams.get("map_name")
    $('title').append(map_name)
    var map = await get_map(map_name)
    add_map(map)
    var seats = await get_seats(map_name)
    for(let seat of seats){
        add_seat(seat)
    }
    var guests_list = await get_guests_names()
    add_guest_details(guests_list, map_name)
    set_num()
    $('#sub').click(function(){
        get_seat_string(map.id)
    })
    $('#sub_4').attr('href', 'http://localhost/hive-php/guest_seat_num.php?map_name='+map_name)
}
load_content()


