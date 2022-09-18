function addMap(rowsNumber, colsNumber, edit){
    const mapContainer = document.getElementById('mapContainer')
    const map = document.createElement('div')
    map.setAttribute('id', 'map')
    map.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= rowsNumber; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= colsNumber; colsCounter++){
            var cell = document.createElement('div')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.classList.add('cell')
            map.appendChild(cell)
        }
    }
    map.style.setProperty('--map-rows', rowsNumber)
    map.style.setProperty('--map-cols', colsNumber)
    mapContainer.appendChild(map)
}

function addSeat(row_num, col_num, id, guest_id, seat_num){
    var seat_location = document.querySelector('.row-'+row_num+'.col-'+col_num)
    var num_box = document.createElement('div')
    var name_box = document.createElement('div')
    num_box.classList.add('num_box')
    name_box.classList.add('name_box')
    seat_location.classList.remove('cell')
    seat_location.classList.add('seat')
    $(name_box).attr('seat_id', id)
    $(num_box).attr('seat_id', id)
    $(num_box).text(seat_num)
    $(name_box).attr('guest_id', guest_id)
    $(name_box).text(guest_id)
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
