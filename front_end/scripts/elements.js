import { create_belong } from "./api.js"
import { offsetCalculate } from "./scripts.js"

export const add_map = (map, edit)=>{
    const main_bord = document.getElementById('mainBord')
    const map_container = document.createElement("div")
    map_container.classList.add('map_container')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('id', 'map')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell = document.createElement('div')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.classList.add('cell')
            cell.classList.add('selectable')
            map_ele.appendChild(cell)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    map_container.appendChild(map_ele)
    main_bord.appendChild(map_container)
}

export const add_seat = (seat)=>{
    var seat_location = document.querySelector('.row-'+seat.row_num+'.col-'+seat.col_num)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
    num_box.classList.add('num_box')
    name_box.classList.add('name_box')
    seat_location.classList.remove('cell')
    seat_location.classList.remove('selectable')
    seat_location.classList.add('seat')
    $(name_box).attr('seat_id', seat.id)
    $(num_box).attr('seat_id', seat.id)
    $(num_box).addClass('row-'+seat.row_num)
    $(num_box).addClass('col-'+seat.col_num)
    $(name_box).addClass('row-'+seat.row_num)
    $(name_box).addClass('col-'+seat.col_num)
    $(num_box).text(seat.seat_number)
    $(name_box).attr('guest_id', seat.guest_id)
    $(name_box).text(seat.guest_id)
    seat_location.append(num_box)
    seat_location.append(name_box)
}
export const add_match_list_items = (input_str, guests_list)=>{
    var match_list = []
    var search_str = '^'+input_str
    if(input_str.length != 0){
        var search_reg = new RegExp(search_str)
        for(var corrent of guests_list){
            if(search_reg.test(corrent.name)){
                match_list.push(corrent)
            }
        }
    }
    return match_list
}
export const add_match_list = (input_str, guests_list, selected_seat_class, map_name)=>{
    var match_drop_down = document.createElement('ul')
    $(match_drop_down).attr('id', 'match_drop_down')
    for(let corrent of add_match_list_items(input_str, guests_list)){
        var match_li = document.createElement('li') 
        $(match_li).html(corrent.name+' | <span class="group_name">'+corrent.group+'</span>')
        $(match_li).addClass('match_list')
        $(match_li).attr('guest_id', corrent.id)
        $(match_li).attr('guest_group', corrent.group)
        $(match_li).attr('guest_name', corrent.name)
        $(match_li).click(function(){
            var selected_guest_id = $(this).attr('guest_id')
            $('#name_box_input').val($(this).attr('guest_name'))
            create_belong(selected_guest_id, selected_seat_class, map_name)
        })                                        
        $(match_drop_down).append(match_li)
    }
    return match_drop_down
}
export const add_name_box_input = (box)=>{
    var input_fild = document.createElement('input')
    input_fild.style.border = "none";
    $(input_fild).attr('id', 'name_box_input')
    $(input_fild).val($(box).attr('guest_name'))
    $(input_fild).addClass('name_box')
    return input_fild
}
export const add_drop_down = ()=>{
    var drop_down = document.createElement('div')
    $(drop_down).attr('id', 'drop_down')
    $(drop_down).addClass('drop_down')   
    return drop_down
}
export const add_match_menu = (guests_list, selected_seat_class, map_name, box)=>{
    if(document.getElementById('drop_down')) document.getElementById('drop_down').remove()
    if(document.getElementById('name_box_input')) document.getElementById('name_box_input').remove()
    $('#mainBord').append(add_drop_down())
    $('#mainBord').append(add_name_box_input(box))         
    offsetCalculate(box);
    window.addEventListener('resize', ()=> offsetCalculate(box))
    document.getElementById('mainBord').addEventListener('scroll', ()=> offsetCalculate(box))
    $('#name_box_input').focus()
    $('#name_box_input').on('input', function(){
        var input_str = $('#name_box_input').val()
        $('#drop_down').children('ul').text(' ')
        $('#drop_down').append(add_match_list(input_str, guests_list, selected_seat_class, map_name))                               
    })
}
export const add_guest_details = (guests_list, map_name)=>{
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
            }
        }
        $(box).click(function(){
            var selected_seat_class = $(this).attr('seat_id')
            $(box).text('')
            add_match_menu(guests_list, selected_seat_class, map_name, box)
        })
    }) 
}