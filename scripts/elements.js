import { guest } from "./api/guest.js"
import { map } from "./api/map.js"
import { seat } from "./api/seat.js"
import { onSeatNum } from "./eventListeners.js"
import { onSeatName } from "./map/eventListeners.js"
import "./lib/jquery.min.js"
import { respondToVisibility, startMBLoader, stopMBLoader } from "./scripts.js"

const test = (e)=>{
    var data = []
    data[0] = e.target.parentNode.parentNode.childNodes[2].childNodes[0].value
    data[1] = e.target.parentNode.parentNode.childNodes[1].childNodes[0].value
    data[2] = e.target.parentNode.parentNode.childNodes[3].childNodes[0].value
    var map_id = e.target.parentNode.parentNode.getAttribute('map_id')
    var guest_id = e.target.parentNode.parentNode.getAttribute('guest_id')
    guest.update2(data, map_id, guest_id)
}
function switchMouseOut(e){
    e.target.style.backgroundColor = 'rgb(119, 224, 224)' 
}
function onGroupsSwitch(event){
    document.querySelectorAll('#groupsSwitch > .hive-button').forEach(e => {
        e.style.backgroundColor = 'rgb(119, 224, 224)'
        e.addEventListener('mouseover', e => e.target.style.backgroundColor = '#7a93b9')
        if(e.getAttribute('group') != event.target.getAttribute('group')) e.addEventListener('mouseout', switchMouseOut)
        else e.removeEventListener('mouseout', switchMouseOut)
        event.target.style.backgroundColor = 'rgb(91, 209, 130)';
    })
    var group = event.target.getAttribute('group')
    var table = document.getElementById('names_table')
    if(group == 'all'){
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                rows[i].style.display = 'table-row'; 
                rows[i].style.verticalAlign = 'inherit';
                rows[i].setAttribute('status_group', 'open')
            }
        }
    }else{
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                if(rows[i].getAttribute('group') != group){
                    rows[i].style.display = 'none'
                    rows[i].setAttribute('status_group', 'close')
                }
                else{
                    rows[i].style.display = 'table-row'; 
                    rows[i].style.verticalAlign = 'inherit';
                    rows[i].setAttribute('status_group', 'open')
                }
            }
        }
    }
}
export const add_map = (map)=>{
    const main_bord = document.getElementById('mainBord')
    const map_container = document.createElement("div")
    map_container.classList.add('map_container')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('map_name', map.map_name)
    map_ele.setAttribute('map_id', map.id)
    map_ele.setAttribute('id', 'map')
    map_ele.setAttribute('selectables', 'cell')
    map_ele.setAttribute('isZoomed', 'false')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell_cont = document.createElement('div')
            var cell = document.createElement('div')
            cell_cont.classList.add(`row-${rowsCounter}`)
            cell_cont.classList.add(`col-${colsCounter}`)
            cell_cont.classList.add('cell_cont')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.setAttribute('row', rowsCounter)
            cell.setAttribute('col', colsCounter)
            cell.classList.add('cell')
            cell.classList.add('selectable')
            cell_cont.append(cell)
            map_ele.appendChild(cell_cont)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    map_container.appendChild(map_ele)
    main_bord.appendChild(map_container)
}
export const add_seats = (seats)=>{
    for(let seat of seats){
        var cell = document.querySelector(`.cell_cont.row-${seat.row_num}.col-${seat.col_num}`)
        var seat_ele = document.createElement('div')
        seat_ele.classList.add(`row-${seat.row_num}`)
        seat_ele.classList.add(`col-${seat.col_num}`)
        seat_ele.setAttribute('row', seat.row_num)
        seat_ele.setAttribute('col', seat.col_num)
        seat_ele.setAttribute('seat_id', seat.id)
        var num_box = document.createElement('div')
        var name_box = document.createElement('div')
        num_box.classList.add('num_box')
        name_box.classList.add('name_box')
        seat_ele.classList.add('seat')
        $(name_box).attr('seat_id', seat.id)
        $(num_box).attr('seat_id', seat.id)
        $(num_box).text(seat.seat_number)
        seat_ele.append(num_box)
        seat_ele.append(name_box)
        name_box.addEventListener('click', onSeatName)
        cell.replaceChildren(seat_ele)
    }
    stopMBLoader()
}
export const add_belong = ()=>{
    startMBLoader()
    var name_boxs =  document.querySelectorAll('.name_box')
    var l = name_boxs.length
    var i = 1
   name_boxs.forEach(element => {
        i++
        var seat_id = element.getAttribute('seat_id')
        seat.get_belong(seat_id)
        .then(belong => {
            if(belong[0]) element.setAttribute('guest_id', belong[0].guest)
            else return
        })
        .then(()=>{
            if(i == l){
                stopMBLoader()
            }
        })
    })
}
export const add_guests = (guests)=>{
    startMBLoader()
    var guests_press = JSON.stringify(guests)
    document.getElementById('map').setAttribute('guests', guests_press)
    var name_boxs = document.querySelectorAll('.name_box')
    var l = guests.length
    var i = 1
    if(l == 0){
        stopMBLoader()
    }
    name_boxs.forEach((name_box)=>{
        i++
        var guest_id = name_box.getAttribute('guest_id')
        for(var corrent of guests){
            if(corrent.id == guest_id){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(corrent.name.length > 15) name_box.style.fontSize = '11px';
                corrent.guest_group = corrent.guest_group.replace(" ","_"); 
                name_box.setAttribute('guest_name', corrent.name)
                name_box.setAttribute('guest_group', corrent.guest_group)
                name_box.textContent = corrent.name             
            }
            if(i == l){
                respondToVisibility(name_box, stopMBLoader)
            }
        }
    }) 
}
export const add_guests_table = (map_name, table)=>{
    var map_id = ''
    var table_length = 0
    return map.get(map_name)
    .then(res => map_id = res.id)
    .then(()=>{
        guest.get_all(map_id)
        .then((names)=>{
            if(names.length == 0) stopMBLoader()
            table_length = names.length
            var i = 1
            var groups = []
            for(let name of names){
                i++
                var td = document.createElement('td')
                td.classList.add('seat_num')
                td.setAttribute('guest_id', name.id)                  
                var tdX = document.createElement('td')
                tdX.style.backgroundColor = 'red'
                tdX.textContent = 'X'
                tdX.addEventListener('click', (event)=>{
                    guest.delete(name.id)
                    .then(()=>{
                        event.target.parentNode.style.display = 'none'
                        event.target.parentNode.childNodes[0].setAttribute('show', 'false')
                        event.target.classList.add('no_show')
                    })
                })
                var tr = document.createElement('tr')
                tr.setAttribute('map_id', map_id)
                tr.setAttribute('guest_id', name.id)
                tr.setAttribute('group', name.guest_group)
                tr.setAttribute('status_group', 'open')
                tr.setAttribute('status_belong', 'open')
                if(groups.indexOf(name.guest_group) == -1){
                    groups.push(name.guest_group)
                }
                var tr_j = $(tr)
                .append(td)
                .append($('<td>').append($('<input>').val(name.last_name).on('focusout', test)))
                .append($('<td>').append($('<input>').val(name.first_name).on('focusout', test)))
                .append($('<td>').append($('<input>').val(name.guest_group).on('focusout', test)))
                .append($('<td>').text(name.score))
                .append(tdX)
                $(table).append(tr_j)
                if(i == table_length){
                    respondToVisibility(tr, stopMBLoader)
                    var groupsSwitch = document.getElementById('groupsSwitch')
                    var i = 0
                    var l = groups.length -1
                    var div = document.createElement('div')
                    div.classList.add('hive-button')
                    div.classList.add('hive-switch-l')
                    div.setAttribute('group', 'all')
                    div.textContent = 'הכל'
                    div.style.backgroundColor = 'rgb(91, 209, 130)'
                    div.addEventListener('click', onGroupsSwitch)
                    groupsSwitch.append(div)
                    for(let group of groups){
                        var div = document.createElement('div')
                        div.classList.add('hive-button')
                        if(i == l) div.classList.add('hive-switch-r')
                        else div.classList.add('hive-switch-m')
                        div.setAttribute('group', group)
                        div.textContent = group
                        div.addEventListener('click', onGroupsSwitch)
                        groupsSwitch.append(div)
                        i++
                    }
                    console.log(groups)
                }
            }
        })
        .then(()=>{
            document.querySelectorAll('.seat_num').forEach(element => {
                var guest_id = element.getAttribute('guest_id')
                guest.get_belong(guest_id)
                .then((res)=>{
                    var color, text
                    if(res[0]){
                        color = 'green'
                        text = res[0].seat
                    }else{
                        color = 'grey'
                        text = 'none'
                    }
                    seat.get_number(text)
                    .then(seat => {
                        if(seat[0]) {
                            element.textContent = seat[0].seat_number
                            element.addEventListener('click', onSeatNum)
                            element.setAttribute('belong', 'true')
                        }                          
                    })
                    element.style.backgroundColor = color
                    element.setAttribute('seat_id', text) 
                    element.setAttribute('show', 'true')                   
                })
            })
        })
    })
}
export const addMBloader = ()=>{
    var loader = document.createElement('div')
    var loaderContainer = document.createElement('div')
    var main_bord = document.getElementById('mainBord')
    var perent = main_bord.getBoundingClientRect()
    $(loaderContainer) .css({
        'position': 'absolute',
        'width': perent.width,
        'height': perent.height, 
        'top': perent.top,
        'left': perent.left,
        'margin': 0,
        'padding': 0,
        'backgroundColor' : 'rgb(67, 167, 167)'
    })
    loader.setAttribute('id', "MBloader")
    loaderContainer.setAttribute('id', "MBloader-container")
    document.body.insertBefore(loader, document.body.children[0])
    document.body.insertBefore(loaderContainer, document.body.children[0])
    loader.style.display = 'none'
    loaderContainer.style.display = 'none'
}