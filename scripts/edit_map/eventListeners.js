import { create_selection, DragToScroll } from "./tooles.js"
import dropDown from "../hiveElements/dropDown.js"
import { add_elements, add_guests, add_seats } from "./elements.js"
import api from "../api/api.js"
import MBloader from "../hiveElements/MBloader.js"
import scrolling_list from '../hiveElements/scrolling_list.js'

var mainBord = document.getElementById('mainBord')

const loader = new MBloader()
const menu = new dropDown(mainBord)
const selection = create_selection()
const dragToScroll = DragToScroll()
const guest_scrolling_list = new scrolling_list(menu.drop_element)

dragToScroll.enable()    
selection.disable()

function proximity_score(){
    return new Promise((resolve) => {
        var score, map, map_rows, map_cols, seat, cols_middle, i, col_num, row_num, cols_middle2
        map = document.getElementById('map')
        map_rows = map.getAttribute('rows')
        map_cols = map.getAttribute('cols')
        map_cols = Number(map_cols)
        cols_middle = Math.round(map_cols / 2)
        cols_middle2 = Math.floor(map_cols / 2)
        var cols = []
        var rows = []
        document.querySelectorAll('.cell_cont > .seat').forEach(col => {
            col_num = col.parentNode.getAttribute('col')
            col_num = Number(col_num)
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
        cols.sort(function(a, b) { return a - b; });
        cols.reverse()
        i = 0
        for(let col of cols){
            if(cols_middle == cols_middle2){
                if(col != (cols_middle + 1)){
                    if(col < cols_middle) {
                        i++; 
                        score = Math.abs(i);
                    }
                    if(col > cols_middle) {
                        i--; 
                        score = Math.abs(i);    
                    }
                }
                if(col == cols_middle) {
                    i++; 
                    score = Math.abs(i); 
                }
            }else{
                if(col < cols_middle) {
                    i--;
                    score = i
                    // score = Math.abs(i);
                }
                if(col > cols_middle) {
                    i++;
                    score = i
                    // score = Math.abs(i);    
                }
                if(col == cols_middle) {
                    i++; 
                    score = Math.abs(i); 
                }
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
    return new Promise((resolve) => {
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
                    var score = 20
                    var mid = Math.floor((cols[0]+cols[cols.length -1])/2);
                    var as = ((cols.length /2) %1) != 0
                    // if(as) score = Math.floor(cols.length /2)
                    // else score = Math.floor(cols.length /2) -1
                    // score = score * score
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
    var groups = JSON.parse(document.getElementById('map').getAttribute('groups'))
    for(let group of groups){
        if(group.group_name == guest_group){
            return group.color
        }
    }
    return false
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
export function on_show_tags(){
    return new Promise(async (resolve) => {
        document.querySelectorAll('.seat').forEach(seat => {
            var tags_cont = document.createElement('div')
            tags_cont.classList.add('tags_cont')
            seat.children[1].replaceChildren(tags_cont)
        })
        var names = []
        var tags_data = []
        var map_id = document.getElementById('map').getAttribute('map_id')
        var res = await api.seat_groups.get_groups_tags(map_id)
        for(let group_name of res){
            if(names.indexOf(group_name.tag_name) === -1){
                names.push(group_name.tag_name)
                tags_data.push(group_name)
            }
        }
        for(let tag of tags_data){
            var name = tag.tag_name
            var seats = await api.seat_groups.get_seats_tags(map_id, name)
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
        }
        resolve()
    })
}
function getRandomNumber(max) {
    let min = 0
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}
function add_m(arr){
    return new Promise(async (resolve) => {
        console.log(arr)
        var map_id = document.getElementById('map').getAttribute('map_id')
        await api.guest.update_belong_multiple(map_id, arr)
        resolve()
    })
}
export function onScheduling(){
    const map = document.getElementById('map')
    const guests_list = JSON.parse(map.getAttribute('guests'))
    const map_tags = JSON.parse(map.getAttribute('tags'))
    const seats_list = document.querySelectorAll('.seat')
    function get_seats_score(){
        var seats_score = []
        for(let i = 0; i < seats_list.length; i++){
            var seat = seats_list[i]
            var col_score = Number(seat.getAttribute('col_score'))
            var row_score = Number(seat.getAttribute('row_score'))
            var pass_score = Number(seat.getAttribute('pass_score'))
            var total_score = col_score + row_score + pass_score
            seat.setAttribute('total_score', total_score)
            if(seats_score.indexOf(total_score) === -1){
                seats_score.push(total_score)
            }
        }
        seats_score.sort(function(a, b) { return a - b; });
        seats_score.reverse()
        return seats_score
    }
    function get_guests_score(){
        var guests_score = []
        for(let i = 0; i < guests_list.length; i++){
            var guest = guests_list[i]
            if(guests_score.indexOf(Number(guest.score)) === -1){
                guests_score.push(Number(guest.score))
            }
        }
        guests_score.sort(function(a, b) { return a - b; });
        guests_score.reverse()
        return guests_score
    }
    function sort_seats_score(seats_score){
        var seats_s = {}
        for(let i = 0; i < seats_score.length; i++){
            var seat_score = seats_score[i]
            seats_s[seat_score] = []
        }
        // for(let i = 0; i < seats_list.length; i++){
        //     var seat = seats_list[i]
        //     seats_s[seat.getAttribute('total_score')].push(seat.getAttribute('seat_id'))  
        // }

        for(let i = 0; i < seats_list.length; i++){
            var seat = seats_list[i]
            seats_s[seat.getAttribute('total_score')].push(seat)  
        }
        for (const [key, value] of Object.entries(seats_s)) {
            var tags = {}
            for(let seat of value){
                var seat_tags = JSON.parse(seat.getAttribute('tags'))
                if(seat_tags) tags[seat_tags[0].tag_name] = []
                else tags['all'] = []
            }
            for(let seat of value){
                var seat_tags = JSON.parse(seat.getAttribute('tags'))
                if(seat_tags) tags[seat_tags[0].tag_name].push(seat.getAttribute('seat_id'))
                else tags['all'].push(seat.getAttribute('seat_id'))
            }
            seats_s[key] = tags
        }
        return seats_s
    }
    function sort_guests_score(guests_score){
        var guest_s = {}
        for(let i = 0; i < guests_score.length; i++){
            var guest_score = guests_score[i]
            guest_s[guest_score] = []
        }
        for(let i = 0; i < guests_list.length; i++){
            var guest = guests_list[i]
            guest_s[guest.score].push(guest)
        }
        for (const [key, value] of Object.entries(guest_s)) {
            var requests = {}
            for(let guest of value){
                if(guest.requets > 0) {
                    var request_id = guest.requets[0]
                    var request_name = map_tags[request_id].tag_name
                    requests[request_name] = []
                }
                else requests['all'] = []
            }
            for(let guest of value){
                if(guest.requets > 0) {
                    var request_id = guest.requets[0]
                    var request_name = map_tags[request_id].tag_name
                    requests[request_name].push(guest.id)
                }
                else requests['all'].push(guest.id)
            }
            guest_s[key] = requests
        }
        return guest_s
    }
    function get_guests_requests(guests){
        var guests_requests = []
        for (const [key] of Object.entries(guests)){
            guests_requests.push(key)
        }
        var in_of_all = guests_requests.indexOf('all')
        if(in_of_all != -1){
            guests_requests.splice(in_of_all, 1)
            guests_requests.push('all')
        }
        return guests_requests
    }
    function get_seats_tags(seats){
        var seats_tags = []
        for (const [key] of Object.entries(seats)){
            seats_tags.push(key)
        }
        for (const [key, value] of Object.entries(seats_tags)){
            if(seats[value].length == 0){
                delete seats[value]
                seats_tags.splice(key, 1)
            }
        }
        return seats_tags
    }
    loader.start()
    proximity_score()
    .then(add_col_group_score)
    .then(()=>{
        var scheduling_list = []
        var seats_score = get_seats_score()
        var guests_score = get_guests_score()
        var seats_s = sort_seats_score(seats_score)
        var guest_s = sort_guests_score(guests_score)
        for(let i = 0; i < guests_score.length; i++){
            var guests = guest_s[guests_score[i]]
            var guests_requests = get_guests_requests(guests)
            for(let req of guests_requests){
                var guests_by_req = guests[req]
                while(guests_by_req.length != 0){
                    var random_for_guest = getRandomNumber((guests_by_req.length - 1))
                    var random_guest = guests_by_req[random_for_guest]
                    var is_in_plase = false
                    for(let i = 0; i < seats_score.length; i++){
                        var seats = seats_s[seats_score[i]]
                        var seats_tags = get_seats_tags(seats)
                        if(seats_tags.indexOf(req) == -1 && req != 'all') continue
                        if(seats_tags.length == 0) continue
                        if(req === 'all'){
                            var random_tag = seats_tags[getRandomNumber((seats_tags.length - 1))]
                            seats = seats[random_tag]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    is_in_plase = true
                                    break
                                }
                            }
                        }else{
                            seats = seats[req]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    is_in_plase = true
                                    break
                                }
                            }
                        }
                    }
                    if(!is_in_plase){
                        for(let seat_score of seats_score){
                            var seats = seats_s[seat_score]
                            var random_tag = seats_tags[getRandomNumber((seats_tags.length - 1))]
                            seats = seats[random_tag]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    break
                                }
                            }
                        }
                        guests_by_req.splice(random_for_guest, 1)
                    }
                }
            }
        }
        add_m(scheduling_list)
        .then(loader.stop)
    })
}
function onAddSeats(){
    // loader.start()
    var selected = selection.getSelection()
    var map_id = document.getElementById('map').getAttribute('map_id')
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
    if(event.keyCode == 13){
        document.activeElement.blur()
    }
    var map = document.getElementById('map')
    var edit = map.getAttribute('edit')
    if(edit == 'yes'){
        if(event.keyCode == 13){
            onMapAdd()
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
    guest_scrolling_list.onItem = function(item){
        onAddGuest(item)
        this.listElement.innerHTML = ''
        menu.close()
    }
    const inputBox = document.getElementById('inputBox')
    menu.onOpen = function(){
        guest_scrolling_list.reset()
        event.target.textContent = ''
        var guest_name = event.target.getAttribute('guest_name')
        inputBox.style.display = 'inline-block'
        inputBox.value = guest_name
        inputBox.focus()
        offsetCalculate()
        inputBox.addEventListener('input', onInput)
        clearSelection()
        document.getElementById('map').setAttribute('selectables', 'guests')
    }  
    menu.onClose = function(){
        inputBox.style.display = 'none'
    }
    function createMatchList(input_str){
        var guests_data = JSON.parse(document.getElementById('map').getAttribute('guests')) 
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
        var arr = []
        var seat = event.target.getAttribute('seat_id')           
        var guestsList = document.createElement('ul')
        guestsList.setAttribute('id', 'guestsList')
        var MatchList = createMatchList(input_str)
        for(let corrent of MatchList){
            corrent.name = corrent.last_name+' '+corrent.first_name
            var li = document.createElement('li') 
            li.innerHTML = corrent.name+' <span class="group_name">'+corrent.guest_group+'   |</span>'
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
        li.innerHTML = match.full_name+' <span class="seat_number"> | '+match.seat_number+'</span>' + ' <span class="seat_number"> | '+match.guest_group+'</span>'
        results.append(li)
    }
}