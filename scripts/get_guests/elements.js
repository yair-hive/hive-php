import "../lib/jquery.min.js"
import api from '../api/api.js'
import { onSeatNum } from "./eventListeners.js"
import "../lib/read-excel-file.min.js"
import { row, td_requests, td_delete, td_input, td_score, td_seat_number, td_tags } from "./table_elements.js"

const table = document.getElementById('names_table') 

function get_group(name){
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
function add_row(name){
    name = get_group(name)
    var tr = row(name)
    tr.append(td_seat_number(name.seat))
    if(name.seat) tr.append(td_tags(name.seat.tags))
    else tr.append(td_tags())
    tr.append(td_input(name.last_name))
    tr.append(td_input(name.first_name))
    tr.append(td_input(name.guest_group))
    tr.append(td_score(name))
    if(name.requets) tr.append(td_requests(name.requets))
    else tr.append(td_requests())
    tr.append(td_delete())
    return tr
}
function add_rows(guests){
    console.log(guests)
    return new Promise((resolve) => {
        if(guests.length == 0) resolve()
        for (let i = 0; i < guests.length; i++){          
            table.append(add_row(guests[i]))
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
export function add_tags_id(){
    return new Promise(async (resolve) => {
        var table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var res = await api.tags.get_tags({map_id: map_id})
        if(res){
            var tags = {}
            for(let tag of res){
                tags[tag.id] = tag
            }
            table.setAttribute('tags', JSON.stringify(tags))
        }
        resolve()
    })
}
export function add_table(){
    const map_id = table.getAttribute('map_id')
    return new Promise((resolve) => {
        api.guest.get_all_groups(map_id)
        .then(add_groups)
        .then(()=> api.guest.get_all_and_ditails({map_id: map_id}))
        .then(add_rows)
        .then(resolve) 
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
        var res = await api.tags.get_tags(map_id)
        if(res.length == 0) resolve()
        for(let group_name of res){
            if(names.indexOf(group_name.tag_name) === -1){
                names.push(group_name.tag_name)
                tags_data.push(group_name)
            }
        }
        if(!table.getAttribute('tags')) table.setAttribute('tags', JSON.stringify(tags_data))
        for(let i = 0; i < tags_data.length; i++){
            var tag = tags_data[i]
            var name = tag.tag_name
            var seats = await api.tags.get_seats_tags(map_id, name)
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
export function add_requests(){
    return new Promise(async (resolve) => {
        document.querySelectorAll('.td_requests').forEach(td_tag => {
            var tags_cont = document.createElement('div')
            tags_cont.classList.add('tags_cont')
            td_tag.replaceChildren(tags_cont)
        })
        var tds = document.querySelectorAll('.td_requests')
        if(tds.length == 0) resolve()
        for(let i = 0; i < tds.length; i++){
            var td = tds[i]
            var tr_ele = td.parentNode
            var guest_id = tr_ele.getAttribute('guest_id')
            var tags = JSON.parse(table.getAttribute('tags'))
            var requests = await api.tags.get_requests({guest_id: guest_id})
            requests = requests.data
            if(requests){
                for(let i = 0; i < requests.length; i++){
                    var request = requests[i]
                    for(let i = 0; i < tags.length; i++){
                        var tag = tags[i]
                        if(request.request == tag.id) request.request = tag.tag_name
                    }
                    var tags_cont = tr_ele.querySelector('.td_requests').children[0]
                    tags_cont.append(' | '+request.request+' | ')
                }
            }
            if(i == (tds.length -1)) resolve()
        }
    })
}