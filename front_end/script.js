function addMap(map, edit){
    const mapContainer = document.getElementById('mapContainer')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('id', 'map')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell = document.createElement('div')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.classList.add('cell')
            map_ele.appendChild(cell)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    mapContainer.appendChild(map_ele)
}

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
            alert(msg)
        }
    });
}

function addSeat(seat){
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

function add_the_menu(){
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

function search_match_li(input_str, guests_list, selected_seat_class){
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
                    alert(selected_guest_id+' && '+selected_seat_class)
                    $.ajax({
                        type: "POST", 
                        url: "api.php",
                        data: "action=create_belong&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class,
                        success:function(msg){
                            alert(msg)
                        }
                    })
                })                                        
                $(match_list_ele).append(match_li)
            }
        }
    }
    return match_list_ele
}

function add_guest_details(guests_list){
    document.querySelectorAll('.name_box').forEach(function(box){
        var seat_guest_id = $(box).attr('guest_id')
        for(var corrent of guests_list){
            if(corrent.id == seat_guest_id){
                $(box).attr('guest_name', corrent.name)
                $(box).attr('guest_group', corrent.group)
                $(box).text(corrent.name)
                $(box).addClass('guest_group_'+corrent.group)
                console.log($(box).attr('class'))
                
                
            }
        }
        $(box).click(function(){
            $('#mneu').text(this.classList.value)
            $('#mneu').append(add_the_menu())
            var selected_seat_class = $(this).attr('seat_id')
            $('#input_fild').on('input', function(){
                input_str = $('#input_fild').val()
                $('#mneu').append(search_match_li(input_str, guests_list, selected_seat_class))                               
            })
        })
    }) 
}
function add_num_box_ev(){
    document.querySelectorAll('.num_box').forEach(function(box){
        $(box).click(function(){
            $('#mneu').text(this.classList.value)
            $('#mneu').append(add_the_menu())
            var selected_seat_class = $(this).attr('seat_id')
            $(search_button).click(function(){
                var input_num = $('#input_fild').val()
                $.ajax({
                    type: "POST", 
                    url: "api.php",
                    data: "action=add_seat_number&seat_id="+selected_seat_class+"&seat_number="+input_num,
                    success:function(msg){
                        alert(msg)
                    }
                })
            })                                        
        })
    })
}

function get_map(map_name){
    const options = {
        method: 'POST',
        body: "action=get_map&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}

function get_map_callbeck(map){
    addMap(map)
    $('#sub').click(function(){
        get_seat_string(map.id)
    })
    return 'ok'
}

function get_seats(map_name){
    const options = {
        method: 'POST',
        body: "action=get_seats&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}

function get_seats_callback(seats){
    for(let seat of seats){
        addSeat(seat)
    }
    return 'ok'
}

function get_guests_names(){
    const options = {
        method: 'POST',
        body: "action=get_guests_names",
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}

function get_guests_names_callback(guests_list){
    add_guest_details(guests_list)
    add_num_box_ev()
    return 'ok'
}