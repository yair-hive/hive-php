import { create_belong } from "./api.js"

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

export const add_match_list = (input_str, guests_list, selected_seat_class, map_name)=>{
    var search_str = '^'+input_str
    var match_list_ele = document.createElement('ul')
    $(match_list_ele).attr('id', 'match_list_ele')
    if(input_str.length != 0){
        var search_reg = new RegExp(search_str)
        for(var corrent of guests_list){
            if(search_reg.test(corrent.name)){
                var match_li = document.createElement('li') 
                $(match_li).html(corrent.name+' | <span class="group_name">'+corrent.group+'</span>')
                $(match_li).attr('guest_id', corrent.id)
                $(match_li).attr('guest_group', corrent.group)
                $(match_li).attr('guest_name', corrent.name)
                $(match_li).click(function(){
                    var selected_guest_id = $(this).attr('guest_id')
                    $('#input_fild').val($(this).attr('guest_name'))
                    create_belong(selected_guest_id, selected_seat_class, map_name)
                })                                        
                $(match_list_ele).append(match_li)
            }
        }
    }
    return match_list_ele
}
export const add_match_menu = (guests_list, selected_seat_class, map_name, box)=>{
    if(document.getElementById('list_ele')) document.getElementById('list_ele').remove()
    if(document.getElementById('input_fild_2')) document.getElementById('input_fild_2').remove()
    var list_ele = document.createElement('div')
    $(list_ele).attr('id', 'list_ele')
    $(list_ele).addClass('sub_test')   
    var parent = box.getBoundingClientRect()
    var parent_width = box.offsetWidth
    var parent_height = box.offsetHeight
    var list_width_over = 60
    var list_width_over_d = list_width_over / 2
    var input_fild = document.createElement('input')
    input_fild.style.border = "none";
    $(input_fild).attr('id', 'input_fild_2')
    $('#mainBord').append(list_ele)
    $('#mainBord').append(input_fild)
    $('#input_fild_2').addClass('name_box')            
    function offsetCalculate(){
        $('#list_ele').css({
            'position': 'absolute',
            'width': parent_width + list_width_over, 
            'top':parent.top + parent_height,
            'left': parent.left - list_width_over_d,
            'overflow': 'auto'
        });
        $('#input_fild_2').css({
            'position': 'absolute',
            'width': parent_width, 
            'top':parent.top,
            'left': parent.left,
            'margin': 0,
            'padding': 0
        })
    }
    function srollOffsetCalculate(event){
        $('#list_ele').css({
            'position': 'absolute',
            'width': parent_width + list_width_over, 
            'top':parent.top + parent_height - event.target.scrollTop,
            'left': parent.left - list_width_over_d - event.target.scrollLeft,
            'overflow': 'auto'
        });
        $('#input_fild_2').css({
            'position': 'absolute',
            'width': parent_width, 
            'top':parent.top - event.target.scrollTop,
            'left': parent.left - event.target.scrollLeft,
            'margin': 0,
            'padding': 0
        })
    }
    offsetCalculate();
    $(window).resize(function(){
        offsetCalculate();
    });
    document.getElementById('mainBord').addEventListener('scroll', srollOffsetCalculate)
    $(input_fild).focus()
    $('#input_fild_2').on('input', function(){
        var input_str = $('#input_fild_2').val()
        $('#list_ele').children('ul').text(' ')
        $('#list_ele').append(add_match_list(input_str, guests_list, selected_seat_class, map_name))                               
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
            add_match_menu(guests_list, selected_seat_class, map_name, box)
        })
    }) 
}