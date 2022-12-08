import { create_selection, DragToScroll } from "./tooles.js"
import dropDown from "./dropDown.js"
import { add_elements, add_seats } from "./elements.js"
import api from "../api/api.js"
import MBloader from "../MBloader.js"

const loader = new MBloader()
const menu = new dropDown()
const selection = create_selection()
const dragToScroll = DragToScroll()

function proximity_score(){
    return new Promise((resolve, reject) => {
        var score, map, map_rows, map_cols, seat, cols_middle, i, col_num, row_num
        map = document.getElementById('map')
        map_rows = map.getAttribute('rows')
        map_cols = map.getAttribute('cols')
        cols_middle = Math.round(map_cols / 2)
        var cols = []
        var rows = []
        document.querySelectorAll('.cell_cont > .seat').forEach(col => {
            col_num = col.parentNode.getAttribute('col')
            if(cols.indexOf(col_num) === -1){
                cols.push(col_num)
            }
        })
        document.querySelectorAll('.cell_cont > .seat').forEach(col => {
            row_num = col.parentNode.getAttribute('row')
            row_num = Number(row_num)
            if(rows.indexOf(row_num) === -1){
                rows.push(row_num)
            }
        })
        i = 0
        for(let col of cols){
            if(col < cols_middle) {
                i++; 
                score = Math.abs(i);
            }
            if(col > cols_middle) {
                i--; 
                score = Math.abs(i);
    
            }
            if(col == cols_middle) {
                i++; 
                score = Math.abs(i); 
            }
            document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
                seat = cell_cont.children[0]
                if(seat.children[1]){ 
                    seat.children[1].innerHTML = score
                    seat.setAttribute('col_score', score)
                }
            })       
        }
        i = 0
        rows.sort(function(a, b) { return a - b; });
        rows.reverse();
        for(let row of rows){
            i++
            document.querySelectorAll('.cell_cont[row="'+row+'"]').forEach(cell_cont => {
                seat = cell_cont.children[0]
                score = i
                if(seat.children[1]) {
                    seat.children[1].append(" & "+score)
                    seat.setAttribute('row_score', score)
                }
            })
        }
        resolve()
    })
}
function add_col_group_score(){
    return new Promise((resolve, reject) => {
        var names = []
        var seats_array = []
        var map_id = document.getElementById('map').getAttribute('map_id')
        api.seat_groups.get_groups_cols(map_id)
        .then(res => {
            for(let group_name of res){
                if(names.indexOf(group_name.group_name) === -1){
                    names.push(group_name.group_name)
                }
            }
            for(let i = 0; i < names.length; i++){
                var name = names[i]
                api.seat_groups.get_seats_cols(map_id, name)
                .then(seats => {
                    var seats_ele = []
                    var seat_ele, col
                    var cols = []
                    seats = seats.map(seat => seat.seat)
                    for(let seat of seats){
                        seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                        col = seat_ele.parentNode.getAttribute('col')
                        col = Number(col)
                        if(cols.indexOf(col) === -1){
                            cols.push(col)
                        }
                        seats_ele.push(seat_ele)
                    }
                    seats_array[name] = seats_ele
                    cols.sort(function(a, b) { return a - b; });               
                    var score
                    var mid = Math.floor((cols[0]+cols[cols.length -1])/2);
                    var as = ((cols.length /2) %1) != 0
                    if(as) score = Math.floor(cols.length /2)
                    else score = Math.floor(cols.length /2) -1
                    score = score * score
                    for(let col of cols){
                        document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
                            var seat = cell_cont.children[0]
                            if(seat.children[1]){ 
                                seat.children[1].append(' & '+score)
                                seat.setAttribute('pass_score', score)
                            }
                        }) 
                        if(col < mid) score = score - 2
                        if(as && col == mid) score = score + 2
                        if(col > mid) score = score + 2 
                    }
                    if(i == (names.length -1)) {
                        resolve()
                    }
                })
            }
        })
    })
}
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
export function show_total_score(){
    proximity_score()
    .then(add_col_group_score)
    .then(()=>{
        document.querySelectorAll('.seat').forEach(seat => {
            var col_score = Number(seat.getAttribute('col_score'))
            var row_score = Number(seat.getAttribute('row_score'))
            var pass_score = Number(seat.getAttribute('pass_score'))
            var total_score = col_score + row_score + pass_score
            seat.children[1].innerHTML = total_score
        })
    })
}
export function create_col_group(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם טור')
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_col(seat_id, group_name, map_id)
    })
}
export function addOb(){
    var selected = selection.getSelection()
    var cols = []
    var rows = []
    for(let cell of selected){
        var col = cell.parentNode.getAttribute('col')
        var row = cell.parentNode.getAttribute('row')
        col = Number(col)
        row = Number(row)
        if(cols.indexOf(col) === -1){
            cols.push(col)
        }
        if(rows.indexOf(row) === -1){
            rows.push(row)
        }
    }
    cols.sort(function(a, b) { return a - b; }); 
    rows.sort(function(a, b) { return a - b; }); 
    var name = prompt('הוסף אלמנט')
    var from_row = rows[0]
    var from_col = cols[0]
    var to_row = rows[rows.length -1]
    var to_col = cols[cols.length -1]
    var map = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.add_ob(name, from_row, from_col, to_row, to_col, map)
    .then(()=>{
        add_elements()
    })
}
export function addTag(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם תווית')
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_tag(seat_id, group_name, map_id)
    })
}
export function getTag(){
    document.querySelectorAll('.seat').forEach(seat => {
        var tags_cont = document.createElement('div')
        tags_cont.classList.add('tags_cont')
        seat.children[1].replaceChildren(tags_cont)
    })
    var names = []
    var map_id = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_groups_tags(map_id)
    .then(res => {
        for(let group_name of res){
            if(names.indexOf(group_name.group_name) === -1){
                names.push(group_name.group_name)
            }
        }
        for(let name of names){
            api.seat_groups.get_seats_tags(map_id, name)
            .then(seats => {
                seats = seats.map(seat => seat.seat)
                for(let seat of seats){
                    var seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                    // console.log(seat_ele)
                    var tag_box = document.createElement('div')
                    tag_box.classList.add('tag_box')
                    tag_box.textContent = name
                    var name_box = seat_ele.children[1]
                    var tags_cont = name_box.children[0]
                    tags_cont.append(tag_box)
                    var p = name_box.getBoundingClientRect()
                    var c = tags_cont.getBoundingClientRect()
                    var scale = 1
                    while(p.width < c.width){
                        scale = scale - 0.01
                        tags_cont.style.transform = `scale(${scale})`
                        p = name_box.getBoundingClientRect()
                        c = tags_cont.getBoundingClientRect()
                    }
                }
            })
        }
    })
}