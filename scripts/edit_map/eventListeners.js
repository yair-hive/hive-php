import { create_selection, DragToScroll } from "./tooles.js"
import dropDown from "./dropDown.js"
import { add_seats } from "./elements.js"
import api from "../api/api.js"
import MBloader from "../MBloader.js"

const loader = new MBloader()
const menu = new dropDown()
export const selection = create_selection()
const dragToScroll = DragToScroll()

function getGroupColor(guest_group){
    var groups = JSON.parse(document.getElementById('map').getAttribute('groups'))
    for(let group of groups){
        if(group.group_name == guest_group){
            return group.color
        }
    }
    return false
}
function changeSelectables(selectable, notSelectable){
    document.getElementById('map').setAttribute('selectables', selectable)
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    document.querySelectorAll('.'+selectable).forEach(e => e.classList.add('selectable'))
    document.querySelectorAll('.'+notSelectable).forEach(e => e.classList.remove('selectable'))
    selection.resolveSelectables()
}
const clearSelection = ()=>{
    selection.clearSelection(); 
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
}
export const onAddSeats = ()=>{
    loader.start()
    var selected = selection.getSelection()
    var map_id = document.getElementById('map').getAttribute('map_id')
    var i = 0
    selected.forEach((cell) => {
        i++
        var row = cell.parentNode.getAttribute('row') 
        var col = cell.parentNode.getAttribute('col')
        api.seat.create(map_id, row, col)
        .then(()=> {
            if(i === selected.length){
                api.seat.get_all(map_id)
                .then(seats => add_seats(seats))
                loader.stop()
                clearSelection()
            }
        })

    })
    // var cells_list = []
    // for(let cell of selected){
    //     var cell_data = {}
    //     cell_data.row = cell.getAttribute('row') 
    //     cell_data.col = cell.getAttribute('col')
    //     cells_list.push(cell_data)
    // }
    // var data = JSON.stringify(cells_list)
    // seat.create_multiple(map_id, data)
    // .then(()=> {
    //     clearSelection()
    //     seat.get_all(map_id).then(seats => add_seats(seats))
    // })
}
export const onAddNumber = ()=>{
    loader.start()
    var seatNumber = Number(prompt('Please enter number'))
    document.querySelectorAll('.selected').forEach(element => {
        var box = element.getElementsByClassName('num_box')[0]
        box.textContent = seatNumber
        var seat_id = box.getAttribute('seat_id')
        api.seat.create_number(seat_id, seatNumber)     
        seatNumber++
    }) 
    loader.stop()          
    clearSelection()
}
export const onAddGuest = (ele)=>{
    if(ele.getAttribute('guest_id')){
        var map = document.getElementById('map').getAttribute('map_id')
        var guest_id = ele.getAttribute('guest_id')
        var seat_id = ele.getAttribute('seat')
        var name_box = document.querySelector(`.name_box[seat_id="${seat_id}"]`)
        var guest_ele = document.querySelector(`.match_list[guest_id="${guest_id}"]`)
        var guest_name = guest_ele.getAttribute('guest_name')
        var guest_group = guest_ele.getAttribute('guest_group')   
        api.guest.create_belong(guest_id, seat_id, map)
        .then((res)=>{
            if(res.msg === 'belong'){
                if(confirm('המשתמש כבר משובץ האם אתה רוצה לשבץ מחדש?')){
                    api.guest.update_belong(guest_id, seat_id, map)
                    .then((res)=>{
                        var other_seat = document.querySelector(`.name_box[guest_name="${guest_name}"]`)
                        if(other_seat) {
                            other_seat.removeAttribute('guest_group')
                            other_seat.removeAttribute('guest_name')
                            other_seat.style.backgroundColor = 'rgba(146, 136, 209, 0.8)'
                            other_seat.textContent = ''
                        }
                        name_box.setAttribute('guest_name', guest_name)
                        name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                        var color = getGroupColor(guest_group)
                        if(color) name_box.style.backgroundColor = color
                        name_box.textContent = guest_name 
                    })
                }
            }else{
                name_box.setAttribute('guest_name', guest_name)
                name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                var color = getGroupColor(guest_group)
                if(color) name_box.style.backgroundColor = color
                name_box.textContent = guest_name 
            }
        })
    }
}
export const onMapAdd = ()=>{
    var map = document.getElementById('map')
    if(map.getAttribute('selectables') === 'cell'){
        onAddSeats()
    }
    if(map.getAttribute('selectables') === 'seat'){
        onAddNumber()
    }
    if(map.getAttribute('selectables') === 'guests'){
        if(menu.correntItemIndex > -1){
            onAddGuest(menu.correntItem)
            menu.close()
        }
    }
}
export const onClickOutside = (event)=>{
    if(event.keyCode != 13){
        var classList = event.target.classList
        if(!classList.contains('name_box') && !classList.contains('drop_down') && !classList.contains('match_list')){
            menu.close()
        }
        if(!event.ctrlKey && !event.metaKey && selection.getSelection().length !== 0 && !classList.contains('hive-button')){
            var map = document.getElementById('map')
            if(map.getAttribute('selectables') === 'cell' && !event.target.classList.contains('cell')){
                clearSelection()
            }
            if(map.getAttribute('selectables') === 'seat' && !event.target.parentNode.classList.contains('seat')){
                clearSelection()
            }
        }
    }
}
export const onKeyBordDown = (event)=>{
    if(event.key == 'g' || event.key == 'ע'){
        dragToScroll.enable()    
        selection.disable()
        document.getElementById('map').setAttribute('isZoomed', 'true')
    }
    if(event.keyCode == 13){
        onMapAdd()
    }
    if(event.keyCode == 38){
        menu.onArrowUp()
    }
    if(event.keyCode == 40){
        menu.onArrowDown()
    }
}
export const onKeyBordUp = ()=>{
    dragToScroll.disable()    
    selection.enable()
    document.getElementById('map').setAttribute('isZoomed', 'false')
}
export const onSeatName = (event)=>{
    if(!event.ctrlKey && !event.metaKey){
        menu.open(event.target)
        clearSelection()
    }
    if(event.ctrlKey || event.metaKey){
        var name_box = document.createElement('div')
        var seat_id = event.target.parentNode.getAttribute('seat_id')
        name_box.classList.add('name_box')
        name_box.setAttribute('seat_id', seat_id)
        name_box.addEventListener('click', onSeatName)
        event.target.replaceWith(name_box)
        selection.disable()
    }
}
export function onSelecteblsSwitch(active){
    switch(active){
        case 'seats':
            changeSelectables('seat', 'cell')
            break;
        case 'cells':
            changeSelectables('cell', 'seat')
            break;
    }
}