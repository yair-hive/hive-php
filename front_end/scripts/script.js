import { get_map, get_seats, get_guests_names } from "./api.js"
import {add_map, add_seat, add_menu, add_match_list, add_match_menu} from "./elements.js"


function get_seat_string(map_id){
    var selected = selection.getSelection()
    var selectedArray = []
    selected.forEach(element => {
        selectedArray.push(element.classList)
    });
    var selectedString = selectedArray.join(' *|* ')
    $.ajax({
        type: "POST", 
        url: "api.php",
        data: "action=add_seats&map_id="+map_id+"&seat_list="+selectedString,
        success: function(msg){
            location.reload();
        }
    });
}

function formSend(map_id){
    var seats_list = document.forms['add_seats']['seats_list'].value
    $.ajax({
        type: "POST", 
        url: "api.php",
        data: "action=add_seats&map_id="+map_id+"&seat_list="+seats_list,
        success: function(msg){
            alert(msg)
        }
    });
}

function add_guest_details(guests_list, map_name){
    document.querySelectorAll('.name_box').forEach(function(box){
        var seat_guest_id = $(box).attr('guest_id')
        for(var corrent of guests_list){
            if(corrent.id == seat_guest_id){
                if(corrent.name.length > 15)
                box.style.fontSize = '11px';
                $(box).attr('guest_name', corrent.name)
                $(box).attr('guest_group', corrent.group)
                $(box).text(corrent.name)
                corrent.group = corrent.group.replace(" ","_");
                $(box).addClass('guest_group_'+corrent.group)
                console.log($(box).attr('class'))
                
                
            }
        }
        $(box).click(function(){
            var selected_seat_class = $(this).attr('seat_id')
            add_match_menu(guests_list, selected_seat_class, map_name, box)
        })
    }) 
}
function add_num_box_ev(){
    document.querySelectorAll('.num_box').forEach(function(box){
        $(box).click(function(){
            $('#mneu').text(this.classList.value)
            $('#mneu').append(add_menu())
            var selected_seat_class = $(this).attr('seat_id')
            $(search_button).click(function(){
                var input_num = $('#input_fild').val()
                $.ajax({
                    type: "POST", 
                    url: "api.php",
                    data: "action=add_seat_number&seat_id="+selected_seat_class+"&seat_number="+input_num,
                    success:function(msg){
                        location.reload();
                    }
                })
            })                                        
        })
    })
}

function get_map_callbeck(map){
    add_map(map)
    return 'ok'
}

function get_seats_callback(seats){
    for(let seat of seats){
        add_seat(seat)
    }
    return 'ok'
}

function get_guests_names_callback(guests_list, map_name){
    add_guest_details(guests_list, map_name)
    add_num_box_ev()
    return 'ok'
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
                $.ajax({
                    type: "POST", 
                    url: "api.php",
                    data: "action=add_seat_number&seat_id="+selected_seat_class+"&seat_number="+col_group_name,
                    success:function(msg){
                        location.reload();
                    }
                })            
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
$('#topBar').click(function(){
    $('#mneu').html("<div id='sub' class='sub'> submit </div><div id='sub_1' class='sub'> chenge th selection </div><div id='sub_2' class='sub'> do the action </div><div id='sub_3' class='sub'> restart the selection </div><a id='sub_4'><div class='sub'> דוחות </div></a>")
})

$(document).ready(async function(){
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
    await get_guests_names_callback(guests_list, map_name)
    set_num()
    $('#sub').click(function(){
        get_seat_string(map.id)
    })
    $('#sub_4').attr('href', 'http://localhost/hive-php/guest_seat_num.php?map_name='+map_name)
})

