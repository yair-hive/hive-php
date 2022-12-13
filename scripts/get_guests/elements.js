import "../lib/jquery.min.js"
import { respondToVisibility } from "../scripts.js"
import { sortTable, sortTableNumber } from "../scripts.js"
import api from '../api/api.js'
import { onSeatNum, onTdFocusOut } from "./eventListeners.js"
import MBloader from "../hiveElements/MBloader.js"
import "../lib/read-excel-file.min.js"

var loader = new MBloader()
loader.add()

function tableDeleteGuestButton(){
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
function seatNumCell(guest_id){
    var td = document.createElement('td')
    td.classList.add('seat_num')
    td.setAttribute('guest_id', guest_id) 
    return td
}
function tableRow(name){
    var tr = document.createElement('tr')
    tr.setAttribute('guest_id', name.id)
    tr.setAttribute('group', name.guest_group)
    tr.setAttribute('status_group', 'open')
    tr.setAttribute('status_belong', 'open')
    return tr
}
function tableTdInput(value){
    var td = document.createElement('td')
    var input = document.createElement('input')
    input.value = value
    input.addEventListener('focusout', onTdFocusOut)
    td.append(input)
    return td
}
function tdTags(){
    var td = document.createElement('td')
    td.classList.add('td_tag')
    return td
}
function addTableRow(name){
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
    var tdX = tableDeleteGuestButton()
    var tdSeatNum = seatNumCell(name.id)
    var td_tags = tdTags()
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
    var tr = tableRow(name)
    tr.append(tdSeatNum)
    tr.append(td_tags)
    tr.append(tableTdInput(name.last_name))
    tr.append(tableTdInput(name.first_name))
    tr.append(tableTdInput(name.guest_group))
    tr.append(tdScore)
    tr.append(tdX)
    return tr
}
async function addSeatNum(){
    return new Promise(async (resolve, reject) => {
        var num_cells = document.querySelectorAll('.seat_num')
        for(let i = 0; i < num_cells.length; i++){
            var element = num_cells[i]
            var guest_id = element.getAttribute('guest_id')
            var res = await api.guest.get_belong(guest_id)
            var color, text
            if(res[0]){
                color = 'green'
                text = res[0].seat
                element.parentNode.setAttribute('seat_id', res[0].seat)
            }else{
                color = 'grey'
                text = 'none'
            }
            var seat = await api.seat.get_number(text)
            if(seat[0]) {
                element.textContent = seat[0].seat_number
                element.addEventListener('click', onSeatNum)
                element.setAttribute('belong', 'true')
            }                          
            element.style.backgroundColor = color
            element.setAttribute('seat_id', text) 
            element.setAttribute('show', 'true') 
            if(i == (num_cells.length -1)) resolve()                
        }
    })
}
function addThEvent(){
    document.getElementById("status").addEventListener('click', ()=>{sortTableNumber(0)})
    document.getElementById("first").addEventListener('click', ()=>{sortTable(2)}) 
    document.getElementById("last").addEventListener('click', ()=>{sortTable(3)})
    document.getElementById("group").addEventListener('click', ()=>{sortTable(5)})
    document.getElementById("score").addEventListener('click', ()=>{sortTableNumber(5)})
}
function addTags(){
    document.querySelectorAll('.td_tag').forEach(td_tag => {
        var tags_cont = document.createElement('div')
        tags_cont.classList.add('tags_cont')
        td_tag.replaceChildren(tags_cont)
    })
    var names = []
    var tags_data = []
    var table = document.getElementById('names_table') 
    var map_id = table.getAttribute('map_id')
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
                    var tr_ele = document.querySelector('tr[seat_id = "'+seat+'"]')
                    if(tr_ele){
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
            })
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
export const add_guests_table = ()=>{
    const table = document.getElementById('names_table') 
    loader.start()
    var map_id = table.getAttribute('map_id')
    return api.guest.get_all_groups(map_id)
    .then((groups)=>{
        var groups_press = JSON.stringify(groups)
        table.setAttribute('groups', groups_press)
        return groups
    })
    .then(()=>{
        var map_id = table.getAttribute('map_id')
        return api.guest.get_all(map_id)
    })
    .then((names)=>{
        var tr, i
        if(names.length == 0) loader.stop()
        for (i = 0; i < names.length; i++){          
            tr = addTableRow(names[i]) 
            table.append(tr)
        }
        if(names.length > 0) respondToVisibility(tr, loader.stop)
    })
    .then(addSeatNum)
    .then(addTags)
    .then(addThEvent)
}