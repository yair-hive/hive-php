import { seat } from "../api/seat.js"
import { guest } from "../api/guest.js"
import { startMBLoader, stopMBLoader, create_selection, DragToScroll } from "../scripts.js"
import "../lib/jquery.min.js"
import dropDown from "./dropDown.js"
import { add_seats } from "./elements.js"

const menu = new dropDown()
const selection = create_selection()
const dragToScroll = DragToScroll()

const changeSelectables = (selectable, notSelectable)=>{
    document.getElementById('map').setAttribute('selectables', selectable)
    var buttons = {
        seat:document.getElementById('select_seats'),
        cell:document.getElementById('select_cells')
    }
    buttons[selectable].style.backgroundColor = 'tomato'
    buttons[notSelectable].style.backgroundColor = 'gray'
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
export const onSelectSeats = ()=>{
    changeSelectables('seat', 'cell')
}
export const onSelectCells = ()=>{
    changeSelectables('cell', 'seat')
}
export const onAddSeats = ()=>{
    startMBLoader()
    var selected = selection.getSelection()
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach((cell) => {
        var row = cell.getAttribute('row') 
        var col = cell.getAttribute('col')
        seat.create(map_id, row, col)
        .then(()=> {
            clearSelection()
            return seat.get_all(map_id)
        })
        .then(seats => add_seats(seats))
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
    var seatNumber = Number(prompt('Please enter number'))
    document.querySelectorAll('.selected').forEach(element => {
        var box = element.getElementsByClassName('num_box')[0]
        box.textContent = seatNumber
        var seat_id = box.getAttribute('seat_id')
        seat.create_number(seat_id, seatNumber)     
        seatNumber++
    })           
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
        guest.create_belong(guest_id, seat_id, map)
        .then((res)=>{
            if(res.msg === 'belong'){
                if(confirm('המשתמש כבר משובץ האם אתה רוצה לשבץ מחדש?')){
                    guest.update(guest_id, seat_id, map)
                    .then(()=>{
                        var other_seat = document.querySelector(`.name_box[guest_name="${guest_name}"]`)
                        if(other_seat) {
                            other_seat.removeAttribute('guest_group')
                            other_seat.removeAttribute('guest_name')
                            other_seat.textContent = ''
                        }
                        name_box.setAttribute('guest_name', guest_name)
                        name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                        name_box.textContent = guest_name 
                    })
                }
            }else{
                name_box.setAttribute('guest_name', guest_name)
                name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
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
    if(event.ctrlKey || event.metaKey){
        if(event.key == 'q' || event.key == '/'){
            event.preventDefault()
            changeSelectables('cell', 'seat')
        }
        if(event.key == 'x' || event.key == 'ס'){
            event.preventDefault()
            changeSelectables('seat', 'cell')
        }
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