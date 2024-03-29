import dropDown from "../hiveElements/dropDown.js"
import { add_col, add_elements, add_row, add_seats } from "./elements.js"
import api from "../api/api.js"
import scrolling_list from '../hiveElements/scrolling_list.js'
import { add_col_group_score, proximity_score, scheduling } from "./schedulingActions.js"
import { dragToScroll, loader, selection } from "./switchs.js"

const mainBord = document.getElementById('mainBord')

const menu = new dropDown(mainBord)
const guest_scrolling_list = new scrolling_list(menu.drop_element)

export function on_show_score(){
    proximity_score()
    .then(add_col_group_score)
    .then(()=>{
        document.querySelectorAll('.seat').forEach(seat => {
            var col_score = Number(seat.getAttribute('col_score'))
            var row_score = Number(seat.getAttribute('row_score'))
            var pass_score = Number(seat.getAttribute('pass_score'))
            var total_score = col_score + row_score + pass_score
            var total_score = col_score +' & '+ row_score +' & '+ pass_score
            seat.children[1].innerHTML = total_score
        })
    })
}
function getGroupColor(guest_group){
    var groups = JSON.parse(mainBord.getAttribute('groups'))
    return groups[guest_group].color
}
function clearSelection(){
    selection.clearSelection(); 
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
}
function create_col_group(group_name){
    var selected = selection.getSelection()
    var map_id = mainBord.getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_col(seat_id, group_name, map_id)
    })
}

export function on_show_tags(){
    document.querySelectorAll('.seat').forEach(seat => {
        var tags_cont = document.createElement('div')
        tags_cont.classList.add('tags_cont')
        seat.children[1].replaceChildren(tags_cont)
        var seat_tags = JSON.parse(seat.getAttribute('tags'))
        if(seat_tags){
            for(let tag of seat_tags){
                var tag_box = document.createElement('div')
                tag_box.classList.add('tag_box')
                tag_box.style.backgroundColor = tag.color
                tag_box.textContent = tag.tag_name
                var name_box = seat.children[1]
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
        }
    })
}
export function onScheduling(){
    scheduling()
}
function onAddSeats(){
    // loader.start()
    var selected = selection.getSelection()
    var map_id = mainBord.getAttribute('map_id')
    // var i = 0
    // selected.forEach((cell) => {
    //     i++
    //     var row = cell.parentNode.getAttribute('row') 
    //     var col = cell.parentNode.getAttribute('col')
    //     api.seat.create(map_id, row, col)
    //     .then(()=> {
    //         if(i === selected.length){
    //             api.seat.get_all(map_id)
    //             .then(seats => add_seats(seats))
    //             loader.stop()
    //             clearSelection()
    //         }
    //     })

    // })
    loader.start()
    var cells_list = []
    for(let cell of selected){
        var cell_data = {}
        cell_data.row = cell.parentNode.getAttribute('row') 
        cell_data.col = cell.parentNode.getAttribute('col')
        cells_list.push(cell_data)
    }
    var data = JSON.stringify(cells_list)
    api.seat.create_multiple(map_id, data)
    .then(()=> {
        loader.stop()
        clearSelection()
        api.seat.get_all(map_id).then(seats => add_seats(seats))
    })
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
    var map_id = mainBord.getAttribute('map_id')
    api.map_elements.add(name, from_row, from_col, to_row, to_col, map_id)
    .then(()=>{
        add_elements()
    })
}
function onAddTag(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם תווית')
    var map_id = mainBord.getAttribute('map_id')
    for(let i = 0; i < selected.length; i++){
        var seat = selected[i]
        var seat_id = seat.getAttribute('seat_id')
        api.tags.add(seat_id, group_name, map_id).then(()=>{
            if(i == (selected.length -1)) {
                on_show_tags()
                clearSelection()
            }
        })
    }
}
async function onAddRow(){
    var map = document.getElementById('map')
    var map_id = mainBord.getAttribute('map_id')
    var row = map.getAttribute('to_delete')
    await api.map.add_row(row, map_id)
    add_row(row)
}
async function onAddCol(){
    var map = document.getElementById('map')
    var map_id = mainBord.getAttribute('map_id')
    var col = map.getAttribute('to_delete')
    await api.map.add_col(col, map_id)
    add_col(col)
}
export function onAddGuest(ele){
    if(ele.getAttribute('guest_id')){
        var map_id = mainBord.getAttribute('map_id')
        var guest_id = ele.getAttribute('guest_id')
        var seat_id = ele.getAttribute('seat')
        var name_box = document.querySelector(`.name_box[seat_id="${seat_id}"]`)
        var guest_ele = document.querySelector(`.match_list[guest_id="${guest_id}"]`)
        var guest_name = guest_ele.getAttribute('guest_name')
        var guest_group = guest_ele.getAttribute('guest_group')   
        api.guest.create_belong(guest_id, seat_id, map_id)
        .then((res)=>{
            if(res.msg === 'exists'){
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
                        console.log(guest_group)
                        var color = getGroupColor(guest_group)
                        if(color) name_box.style.backgroundColor = color
                        name_box.style.fontSize = '15px';
                        if(guest_name.length > 15) name_box.style.fontSize = '11px';
                        name_box.textContent = guest_name 
                    })
                }
            }else{
                name_box.setAttribute('guest_name', guest_name)
                name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                var color = getGroupColor(guest_group)
                if(color) name_box.style.backgroundColor = color
                if(guest_name.length > 15) name_box.style.fontSize = '11px';
                name_box.textContent = guest_name 
            }
        })
    }
}
export function onMapAdd(){
    var map = document.getElementById('map')
    var selectables = map.getAttribute('selectables')
    if(selectables === 'cell'){
        if(selection.getSelection().length != 0) onAddSeats()
    }
    if(selectables === 'seat'){
        if(selection.getSelection().length != 0) onAddNumber()
    }
    if(selectables === 'element'){
        if(selection.getSelection().length != 0) onAddElement()
    }
    if(selectables === 'tag'){
        if(selection.getSelection().length != 0) onAddTag()
    }
    if(selectables === 'col'){
        loader.start()
        onAddCol()
        .then(loader.stop)
        // .then(()=> location.reload())
    }
    if(selectables === 'row'){
        loader.start()
        onAddRow()
        .then(loader.stop)
        // .then(()=> location.reload())
    }
}
function onDeleteCell(){
    // var map = document.getElementById('map')
    // var map_id = map.getAttribute('map_id')
    // var col = map.getAttribute('to_delete')
    // api.map.delete_col(col, map_id)
    // console.log(map.getAttribute('to_delete'))
}
async function onDeleteSeat(){
    var selected = selection.getSelection()
    for(let seat of selected){
        var seat_id = seat.getAttribute('seat_id')
        await api.seat.delete(seat_id)
        await api.seat.delete_belong(seat_id)
    }
} 
async function onDeleteElement(){
    var selected = selection.getSelection()
    for(let ob of selected){
        var ob_id = ob.getAttribute('ob_id')
        if(ob_id) await api.map_elements.delete(ob_id)
    }
}
function onDeleteTag(){
    console.log('TODO delete tag')
}
function onDeleteRow(){
    var map = document.getElementById('map')
    var map_id = mainBord.getAttribute('map_id')
    var row = map.getAttribute('to_delete')
    return api.map.delete_row(row, map_id)
}
function onDeleteCol(){
    var map = document.getElementById('map')
    var map_id = mainBord.getAttribute('map_id')
    var col = map.getAttribute('to_delete')
    return api.map.delete_col(col, map_id)
}
export function onMapDelete(){
    var map = document.getElementById('map')
    var selectables = map.getAttribute('selectables')
    if(selectables === 'cell'){
        if(selection.getSelection().length != 0) onDeleteCell()
    }
    if(selectables === 'seat'){
        if(selection.getSelection().length != 0) {
            loader.start()
            onDeleteSeat()
            .then(loader.stop)
            .then(()=> location.reload())
        }
    }
    if(selectables === 'element'){
        if(selection.getSelection().length != 0) {
            loader.start()
            onDeleteElement()
            .then(loader.stop)
            .then(()=> location.reload())
        }
    }
    if(selectables === 'tag'){
        if(selection.getSelection().length != 0) onDeleteTag()
    }
    if(selectables === 'col'){
        loader.start()
        onDeleteCol()
        .then(loader.stop)
        .then(()=> location.reload())
    }
    if(selectables === 'row'){
        loader.start()
        onDeleteRow()
        .then(loader.stop)
        .then(()=> location.reload())
    }
}
export function onClickOutside(event){
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
        if(!classList.contains('hive-button')){
            document.querySelectorAll('.row_selector').forEach(e => e.classList.remove('active'))      
            document.querySelectorAll('.sle').forEach(e => e.classList.remove('sle'))
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
export function onKeyBordDown(event){
    if(event.keyCode == 13){
        document.activeElement.blur()
    }
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'yes'){
        if(event.code == 'Enter'){
            onMapAdd()
        }
        if(event.code == 'Delete'){
            onMapDelete()
        }
        dragToScroll.enable()    
        selection.disable()
        if(event.key == 'g' || event.key == 'ע'){
            dragToScroll.enable()    
            selection.disable()
            document.getElementById('map').setAttribute('isZoomed', 'true')
        }
        document.getElementById('map').setAttribute('isZoomed', 'true')
    }
}
export function onKeyBordUp(){
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'yes'){
        dragToScroll.disable()    
        selection.enable()
        document.getElementById('map').setAttribute('isZoomed', 'false')
    }
}
export function onSeatName(event){
    const inputBox = document.getElementById('inputBox')
    var guest_name = event.target.getAttribute('guest_name')
    guest_scrolling_list.onItem = function(item){
        onAddGuest(item)
        this.listElement.innerHTML = ''
        menu.close()
    }
    menu.onOpen = function(){
        guest_scrolling_list.reset()
        event.target.textContent = ''
        inputBox.value = guest_name
        offsetCalculate()
        inputBox.addEventListener('input', onInput)
        clearSelection()
        document.getElementById('map').setAttribute('selectables', 'guests')
    }  
    menu.onClose = function(){
        event.target.textContent = guest_name
        inputBox.style.display = 'none'
    }
    function createMatchList(input_str){
        var guests_data = JSON.parse(mainBord.getAttribute('guests')) 
        var match_list = []
        var search_str = '^'+input_str
        if(input_str.length != 0){
            var search_reg = new RegExp(search_str)
            for(var corrent of guests_data){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(search_reg.test(corrent.name)){
                    match_list.push(corrent)
                }
            }
        }
        return match_list
    }
    function createGuestsList(input_str){
        var groups = JSON.parse(mainBord.getAttribute('groups'))
        var arr = []
        var seat = event.target.getAttribute('seat_id')           
        var guestsList = document.createElement('ul')
        guestsList.setAttribute('id', 'guestsList')
        var MatchList = createMatchList(input_str)
        for(let corrent of MatchList){
            var group_name = groups[corrent.guest_group].group_name
            corrent.name = corrent.last_name+' '+corrent.first_name
            var li = document.createElement('li') 
            li.innerHTML = corrent.name+' <span class="group_name">'+ group_name +'   |</span>'
            li.classList.add('match_list')
            li.setAttribute('guest_id', corrent.id)
            li.setAttribute('guest_name', corrent.name)
            li.setAttribute('guest_group', corrent.guest_group.replace("_"," "))
            li.setAttribute('seat', seat)                             
            arr.push(li)
        }
        return arr
    }
    function offsetCalculate(){
        var parent = event.target.getBoundingClientRect()
        inputBox.style.position = 'absolute'
        inputBox.style.margin = 0
        inputBox.style.padding = 0
        inputBox.style.top = parent.top+'px'
        inputBox.style.left = parent.left+'px'
        inputBox.style.display = 'inline-block'
        inputBox.focus()
    }
    function onInput(event){
        guest_scrolling_list.replaceItems(createGuestsList(event.target.value))
    }
    if(!event.ctrlKey && !event.metaKey){
        var map = document.getElementById('map')
        var isZoomed = map.getAttribute('isZoomed') 
        if(isZoomed == 'false'){
            menu.open(event.target)
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
export function onGuestList(event){
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
    var belongs = JSON.parse(mainBord.getAttribute('seats_belongs'))
    var guest_list = JSON.parse(mainBord.getAttribute('guests'))
    var groups = JSON.parse(mainBord.getAttribute('groups'))
    var seats = JSON.parse(mainBord.getAttribute('seats'))
    var new_belongs = {}
    var new_seats = {}
    belongs.map(bel => {new_belongs[bel.guest] = bel})
    seats.map(seat => {new_seats[seat.id] = seat})
    var guests_with_belong = []
    for(let guest of guest_list){
        var seat = new_belongs[guest.id]
        if(seat) {
            seat = seat.seat
            var seat_number = new_seats[seat].seat_number
            guest.group_id = guest.guest_group
            guest.guest_group = groups[guest.group_id].group_name
            guest.full_name = guest.last_name  + ' ' + guest.first_name
            guest.seat_number = seat_number
            guests_with_belong.push(guest)
        }
    }
    var results = document.getElementById('results')
    results.innerHTML = ''
    var matchList = createMatchList(guests_with_belong, event.target)
    for(let match of matchList){
        var li = document.createElement('li')
        li.innerHTML = '<span>'+match.full_name+'</span><span><span class="seat_number"> | '+match.seat_number+' | </span>' + ' <span class="guest_group"> '+match.guest_group+'</span></span>'
        results.append(li)
    }
}