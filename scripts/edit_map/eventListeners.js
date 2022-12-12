import { create_selection, DragToScroll } from "./tooles.js"
import dropDown from "./dropDown.js"
import { add_elements, add_guests, add_seats } from "./elements.js"
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
function create_col_group(group_name){
    var selected = selection.getSelection()
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_col(seat_id, group_name, map_id)
    })
}
function on_show_tags(){
    document.querySelectorAll('.seat').forEach(seat => {
        var tags_cont = document.createElement('div')
        tags_cont.classList.add('tags_cont')
        seat.children[1].replaceChildren(tags_cont)
    })
    var names = []
    var tags_data = []
    var map_id = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_groups_tags(map_id)
    .then(res => {
        for(let group_name of res){
            if(names.indexOf(group_name.tag_name) === -1){
                names.push(group_name.tag_name)
                tags_data.push(group_name)
            }
        }
        for(let tag of tags_data){
            var name = tag.tag_name
            api.seat_groups.get_seats_tags(map_id, name)
            .then(seats => {
                seats = seats.map(seat => seat.seat)
                for(let seat of seats){
                    var seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                    var tag_box = document.createElement('div')
                    tag_box.classList.add('tag_box')
                    tag_box.style.backgroundColor = tag.color
                    tag_box.textContent = tag.tag_name
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
function on_show_score(){
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
function onAddSeats(){
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
function onAddNumber(){
    loader.start()
    var col_name = prompt('Please enter number')
    var seatNumber = Number(col_name) + 1
    document.querySelectorAll('.selected').forEach(element => {
        var box = element.getElementsByClassName('num_box')[0]
        box.textContent = seatNumber
        var seat_id = box.getAttribute('seat_id')
        api.seat.create_number(seat_id, seatNumber)     
        seatNumber++
    }) 
    create_col_group(col_name)
    loader.stop()          
    clearSelection()
}
function onAddElement(){
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
function onAddTag(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם תווית')
    var map_id = document.getElementById('map').getAttribute('map_id')
    for(let i = 0; i < selected.length; i++){
        var seat = selected[i]
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_tag(seat_id, group_name, map_id).then(()=>{
            if(i == (selected.length -1)) {
                on_show_tags()
                clearSelection()
            }
        })
    }
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
        if(selection.getSelection().length != 0) onAddSeats()
    }
    if(map.getAttribute('selectables') === 'seat'){
        if(selection.getSelection().length != 0) onAddNumber()
    }
    if(map.getAttribute('selectables') === 'element'){
        if(selection.getSelection().length != 0) onAddElement()
    }
    if(map.getAttribute('selectables') === 'tag'){
        if(selection.getSelection().length != 0) onAddTag()
    }
}
export const onClickOutside = (event)=>{
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'no'){
        dragToScroll.enable()    
        selection.disable()
        document.getElementById('map').setAttribute('isZoomed', 'false')
    }
    if(edit == 'yes'){
        dragToScroll.disable()   
        selection.enable()
        document.getElementById('map').setAttribute('isZoomed', 'true')
    }
    if(event.keyCode != 13){
        var classList = event.target.classList
        if(!classList.contains('name_box') && !classList.contains('drop_down') && !classList.contains('match_list')){
            menu.close()
        }
        if(!event.ctrlKey && !event.metaKey && selection.getSelection().length !== 0 && !classList.contains('hive-button')){
            var map = document.getElementById('map')
            var selectables = map.getAttribute('selectables')
            if(selectables === 'cell' || selectables === 'element'){
                if(!event.target.classList.contains('cell')){
                    clearSelection()
                }                
            }
            if(selectables === 'seat' || selectables === 'tag'){
                if(!event.target.parentNode.classList.contains('seat')){
                    clearSelection()
                }
            }
        }
    }
}
export const onKeyBordDown = (event)=>{
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'no'){
        if(event.key == 'g' || event.key == 'ע'){
            dragToScroll.enable()    
            selection.disable()
            document.getElementById('map').setAttribute('isZoomed', 'true')
        }
    }
    if(edit == 'yes'){
        if(event.keyCode == 13){
            onMapAdd()
        }
        dragToScroll.enable()    
        selection.disable()
        document.getElementById('map').setAttribute('isZoomed', 'true')
    }
}
export const onKeyBordUp = ()=>{
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'yes'){
        dragToScroll.disable()    
        selection.enable()
        document.getElementById('map').setAttribute('isZoomed', 'false')
    }
}
export const onSeatName = (event)=>{
    if(!event.ctrlKey && !event.metaKey){
        var map = document.getElementById('map')
        var isZoomed = map.getAttribute('isZoomed') 
        if(isZoomed == 'false'){
            menu.open(event.target)
            clearSelection()
        }
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
export function onEditSwitch(active){
    var map = document.getElementById('map')
    var edit_menu = document.getElementById('edit_menu')
    var map_menu = document.getElementById('map_menu')
    switch (active) {
        case 'edit':
            edit_menu.style.display = 'flex'
            map_menu.style.display = 'none'
            map.setAttribute('edit', 'yes')
            on_show_tags()
            break;
        case 'no edit':
            edit_menu.style.display = 'none'
            map_menu.style.display = 'flex'
            map.setAttribute('edit', 'no')
            var map_id = document.getElementById('map').getAttribute('map_id')
            document.querySelectorAll('.name_box').forEach(e => e.textContent = '')
            api.guest.get_all(map_id)
            .then(guests => add_guests(guests))
            break;
    }
}
export function onSelecteblsSwitch(active){
    var map = document.getElementById('map')
    switch(active){
        case 'seats':
            changeSelectables('seat', 'cell')
            map.setAttribute('selectables', 'seat')
            break;
        case 'cells':
            changeSelectables('cell', 'seat')
            map.setAttribute('selectables', 'cell')
            break;
        case 'elements':
            map.setAttribute('selectables', 'element')
            changeSelectables('cell', 'seat')
            break;
        case 'tags':
            changeSelectables('seat', 'cell')
            map.setAttribute('selectables', 'tag')
            break;
    }
}
export function onShowSwitch(active){
    switch (active) {
        case 'tags':
            on_show_tags()
            break;
        case 'score':
            on_show_score()
            break;
    }
}
export async function onGuestList(event){
    var createMatchList = function(guests_data, inputBox){
        var match_list = []
        var input_str = inputBox.value
        var search_str = '^'+input_str
        if(input_str.length != 0){
            var search_reg = new RegExp(search_str)
            for(var corrent of guests_data){
                if(search_reg.test(corrent.full_name)){
                    match_list.push(corrent)
                }
            }
        }
        return match_list
    }
    var map = document.getElementById('map')
    var guest_list = map.getAttribute('guests')
    var res
    var guests_with_belong = []
    guest_list = JSON.parse(guest_list)
    for(let i = 0; i < guest_list.length; i++){
        var guest = guest_list[i]
        guest.full_name = guest.last_name + ' ' + guest.first_name
        res = await api.guest.get_belong(guest.id)
        if(res[0]){
            res = await api.seat.get_number(res[0].seat)
            if(res) {
                guest.seat_number = res[0].seat_number
                guests_with_belong.push(guest)
            }
        }
    }
    var results = document.getElementById('results')
    results.innerHTML = ''
    var matchList = createMatchList(guests_with_belong, event.target)
    for(let match of matchList){
        var li = document.createElement('li')
        console.log(match)
        li.innerHTML = match.full_name+' <span class="seat_number"> | '+match.seat_number+'</span>' + ' <span class="group_name"> | '+match.guest_group+'</span>'
        results.append(li)
    }
}