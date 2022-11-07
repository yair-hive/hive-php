export const add_map = (map, edit)=>{
    const mapContainer = document.getElementById('mainBord')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('id', 'map')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell = document.createElement('div')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.classList.add('cell')
            cell.classList.add('cell_s')
            map_ele.appendChild(cell)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    mapContainer.appendChild(map_ele)
}

export const add_seat = (seat)=>{
    var seat_location = document.querySelector('.row-'+seat.row_num+'.col-'+seat.col_num)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
    num_box.classList.add('num_box')
    name_box.classList.add('name_box')
    seat_location.classList.remove('cell')
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

export const add_menu = ()=>{
    var main_div = document.createElement('div')
    var br = document.createElement('br')
    var input_fild = document.createElement('input')
    var search_button = document.createElement('button')
    $(search_button).text('search')
    $(search_button).attr('id', 'search_button')
    $(input_fild).attr('type', 'input_fild')
    $(input_fild).attr('id', 'input_fild')
    $(main_div).append(br)
    $(main_div).append(input_fild)
    $(main_div).append(search_button)
    return main_div
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
                    $.ajax({
                        type: "POST", 
                        url: "api.php",
                        data: "action=create_belong&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_name="+map_name,
                        success:function(msg){
                            location.reload();
                        }
                    })
                })                                        
                $(match_list_ele).append(match_li)
            }
        }
    }
    return match_list_ele
}
export const add_match_menu = (guests_list, selected_seat_class, map_name, box)=>{
    var list_ele = document.createElement('div')
    $(list_ele).attr('id', 'list_ele')
    $(list_ele).addClass('sub_test')   
    var parent = box.getBoundingClientRect()
    var parent_width = box.offsetWidth
    var parent_height = box.offsetHeight
    var list_width_over = 60
    var list_width_over_d = list_width_over / 2
    var input_fild = document.createElement('input')
    $(input_fild).attr('id', 'input_fild_2')
    $(input_fild).focus()
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
    offsetCalculate();
    $(window).resize(function(){
        offsetCalculate();
    });
    $('#input_fild_2').on('input', function(){
        var input_str = $('#input_fild_2').val()
        $('#list_ele').children('ul').text(' ')
        $('#list_ele').append(add_match_list(input_str, guests_list, selected_seat_class, map_name))                               
    })
}