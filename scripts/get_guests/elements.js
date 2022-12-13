import "../lib/jquery.min.js"
import api from '../api/api.js'
import { onSeatNum, onTdFocusOut } from "./eventListeners.js"
import "../lib/read-excel-file.min.js"

const table = document.getElementById('names_table') 

function td_delete(){
    var tdX = document.createElement('td')
    tdX.style.backgroundColor = 'red'
    tdX.textContent = 'X'
    tdX.addEventListener('click', (event)=>{
        var guest_id = event.target.parentNode.getAttribute('guest_id')
        api.guest.delete(guest_id)
        .then(()=>{
            event.target.parentNode.style.display = 'none'
            event.target.parentNode.childNodes[0].setAttribute('show', 'false')
            event.target.classList.add('no_show')
        })
    })
    return tdX
}
function td_seat_number(){
    var td = document.createElement('td')
    td.classList.add('seat_num')
    return td
}
function td_input(value){
    var td = document.createElement('td')
    var input = document.createElement('input')
    input.value = value
    input.addEventListener('focusout', onTdFocusOut)
    td.append(input)
    return td
}
function td_tags(){
    var td = document.createElement('td')
    td.classList.add('td_tag')
    return td
}
function td_score(name){
    var tdScore = document.createElement('td')
    var score_input = document.createElement('input')
    score_input.setAttribute('value', name.score)
    score_input.setAttribute('group_score', name.group_score)
    score_input.addEventListener('focusout', (event)=>{
        var guest_id = event.target.parentNode.parentNode.querySelector('.seat_num').getAttribute('guest_id')
        var p_score = Number(event.target.getAttribute('group_score'))
        var c_score = Number(event.target.value)
        console.log(c_score)
        console.log(p_score)
        var score = c_score - p_score
        api.guest.update_guest_score(guest_id, score)

    })
    tdScore.append(score_input)
    return tdScore
}
function get_group(name){
    var table = document.getElementById('names_table')
    var groups_to_press = table.getAttribute('groups')
    var groups = JSON.parse(groups_to_press)
    for(let group of groups){
        if(group.id == name.guest_group){
            name.group_id = name.guest_group
            name.guest_group = group.group_name
            name.score = Number(name.score)
            group.score = Number(group.score)
            name.score = name.score + group.score
            name.group_score = group.score
        }
    }
    return name
}
function add_groups(groups){
    table.setAttribute('groups', JSON.stringify(groups))
}
function row(name){
    var tr = document.createElement('tr')
    tr.setAttribute('guest_id', name.id)
    tr.setAttribute('guest_group', name.guest_group)
    return tr
}
function addTableRow(name){
    name = get_group(name)
    var tr = row(name)
    tr.append(td_seat_number())
    tr.append(td_tags())
    tr.append(td_input(name.last_name))
    tr.append(td_input(name.first_name))
    tr.append(td_input(name.guest_group))
    tr.append(td_score(name))
    tr.append(td_delete())
    return tr
}
function add_rows(guests){
    return new Promise((resolve) => {
        if(guests.length == 0) resolve()
        for (let i = 0; i < guests.length; i++){          
            table.append(addTableRow(guests[i]) )
            if(i == (guests.length -1)) resolve()
        }
    })
}
export function add_map_id(){
    const parsedUrl = new URL(window.location.href)
    var map_name = parsedUrl.searchParams.get("map_name")
    var table = document.getElementById('names_table') 
    return api.map.get(map_name)
    .then((res)=>{
        table.setAttribute('map_id', res.id)
    })
}
export function add_table(){
    const map_id = table.getAttribute('map_id')
    return new Promise((resolve) => {
        api.guest.get_all_groups(map_id)
        .then(add_groups)
        .then(()=> api.guest.get_all(map_id))
        .then(add_rows)
        .then(resolve)
    })
}
export function add_seat_number(){
    return new Promise(async (resolve) => {
        var num_cells = document.querySelectorAll('.seat_num')
        for(let i = 0; i < num_cells.length; i++){
            var element = num_cells[i]
            var corrent_tr = element.parentNode
            var guest_id = corrent_tr.getAttribute('guest_id')
            var res = await api.guest.get_belong(guest_id)
            if(res[0]){
                var seat_id = res[0].seat
                corrent_tr.setAttribute('seat_id', seat_id)
                corrent_tr.setAttribute('belong', 'belong')
                var seat = await api.seat.get_number(seat_id)
                if(seat[0]) {
                    element.textContent = seat[0].seat_number
                    element.addEventListener('click', onSeatNum)
                }
            }else{
                corrent_tr.setAttribute('belong', 'no belong')
            }                          
            if(i == (num_cells.length -1)) resolve()                
        }
    })
}
export function add_tags(){
    return new Promise(async (resolve) => {
        document.querySelectorAll('.td_tag').forEach(td_tag => {
            var tags_cont = document.createElement('div')
            tags_cont.classList.add('tags_cont')
            td_tag.replaceChildren(tags_cont)
        })
        var names = []
        var tags_data = []
        var table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var res = await api.seat_groups.get_groups_tags(map_id)
        for(let group_name of res){
            if(names.indexOf(group_name.tag_name) === -1){
                names.push(group_name.tag_name)
                tags_data.push(group_name)
            }
        }
        for(let i = 0; i < tags_data.length; i++){
            var tag = tags_data[i]
            var name = tag.tag_name
            var seats = await api.seat_groups.get_seats_tags(map_id, name)
            seats = seats.map(seat => seat.seat)
            for(let i = 0; i < seats.length; i++){
                if(i == (seats.length -1)) resolve()
                var seat = seats[i]
                var tr_ele = document.querySelector('tr[seat_id = "'+seat+'"]')
                if(tr_ele){
                    var tags_list_to_press = tr_ele.getAttribute('tags_list')
                    if(tags_list_to_press){
                        var tags_list = JSON.parse(tags_list_to_press)
                        tags_list.push(tag.tag_name)
                        tr_ele.setAttribute('tags_list', JSON.stringify(tags_list))
                    }else{
                        var tags_list = []
                        tags_list.push(tag.tag_name)
                        tr_ele.setAttribute('tags_list', JSON.stringify(tags_list))
                    }
                    var tag_box = document.createElement('div')
                    tag_box.classList.add('tag_box')
                    tag_box.style.backgroundColor = tag.color
                    tag_box.textContent = tag.tag_name
                    var td_tag = tr_ele.querySelector('.td_tag')
                    var tags_cont = td_tag.children[0]
                    tags_cont.append(tag_box)
                    var p = td_tag.getBoundingClientRect()
                    var c = tags_cont.getBoundingClientRect()
                    var scale = 1
                    while(p.width < c.width){
                        scale = scale - 0.01
                        tags_cont.style.transform = `scale(${scale})`
                        p = td_tag.getBoundingClientRect()
                        c = tags_cont.getBoundingClientRect()
                    }
                }
            }
        }
    })
}