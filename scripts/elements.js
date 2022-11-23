import { guest } from "./api/guest.js"
import { map } from "./api/map.js"
import { seat } from "./api/seat.js"
import { onSeatNum } from "./eventListeners.js"
import "./lib/jquery.min.js"
import { respondToVisibility, startLoader, startMBLoader, stopLoader, stopMBLoader } from "./scripts.js"

export const add_map = (map)=>{
    const main_bord = document.getElementById('mainBord')
    const map_container = document.createElement("div")
    map_container.classList.add('map_container')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('map_name', map.map_name)
    map_ele.setAttribute('map_id', map.id)
    map_ele.setAttribute('id', 'map')
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
        cell.replaceChildren(seat_ele)
    }
    stopMBLoader()
}
export const add_belong = ()=>{
    document.querySelectorAll('.name_box').forEach(element => {
        var seat_id = element.getAttribute('seat_id')
        seat.get_belong(seat_id)
        .then(belong => {
            if(belong[0]) element.setAttribute('guest_id', belong[0].guest)
            else return
        })
    })
}
export const add_guests = (guests)=>{
    startMBLoader()
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
                respondToVisibility(name_box, stopMBLoader())
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
                var tr_j = $(tr)
                .append(td)
                .append($('<td>').text(name.last_name))
                .append($('<td>').text(name.first_name))
                .append($('<td>').text(name.guest_group))
                .append(tdX)
                $(table).append(tr_j)
                if(i == table_length){
                    respondToVisibility(tr, stopMBLoader)
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
export const add_loader = ()=>{
    var loader = document.createElement('div')
    var loaderContainer = document.createElement('div')
    loader.setAttribute('id', "loader")
    loaderContainer.setAttribute('id', "loader-container")
    document.body.insertBefore(loader, document.body.children[0])
    document.body.insertBefore(loaderContainer, document.body.children[0])
    loader.style.display = 'none'
    loaderContainer.style.display = 'none'
}
export const add_MBloader = ()=>{
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