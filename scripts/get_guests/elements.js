import "../lib/jquery.min.js"
import { respondToVisibility, startMBLoader, stopMBLoader } from "../scripts.js"
import { sortTable, sortTableNumber } from "../scripts.js"
import api from '../api/api.js'
import { onSeatNum, onTdFocusOut } from "./eventListeners.js"

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
function addTableRow(name){
    var tdX = tableDeleteGuestButton()
    var tdSeatNum = seatNumCell(name.id)
    var tdScore = document.createElement('td')
    tdScore.textContent = name.score
    var tr = tableRow(name)
    tr.append(tdSeatNum)
    tr.append(tableTdInput(name.last_name))
    tr.append(tableTdInput(name.first_name))
    tr.append(tableTdInput(name.guest_group))
    tr.append(tdScore)
    tr.append(tdX)
    return tr
}
function getGroups(names){
    var groups = []
    for(let name of names){
        if(groups.indexOf(name.guest_group) == -1){
            groups.push(name.guest_group)
        }
    }
    return groups
}
function addGroupsSwitch(groups){
    var groupsSwitch = document.getElementById('groupsSwitch')
    for(var group of groups){
        var div = document.createElement('div')
        div.textContent = group
        group = group.replace(' ', '_')
        div.setAttribute('id', group)                        
        groupsSwitch.append(div)
    }
}
function addSeatNum(){
    document.querySelectorAll('.seat_num').forEach(element => {
        var guest_id = element.getAttribute('guest_id')
        api.guest.get_belong(guest_id)
        .then((res)=>{
            var color, text
            if(res[0]){
                color = 'green'
                text = res[0].seat
            }else{
                color = 'grey'
                text = 'none'
            }
            api.seat.get_number(text)
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
}
function addThEvent(){
    document.getElementById("status").addEventListener('click', ()=>{sortTableNumber(0)})
    document.getElementById("first").addEventListener('click', ()=>{sortTable(1)}) 
    document.getElementById("last").addEventListener('click', ()=>{sortTable(2)})
    document.getElementById("group").addEventListener('click', ()=>{sortTable(3)})
    document.getElementById("score").addEventListener('click', ()=>{sortTableNumber(4)})
}
export const add_guests_table = (map_name, table)=>{
    startMBLoader()
    return api.map.get(map_name)
    .then((res)=>{
        table.setAttribute('map_id', res.id)
        return api.guest.get_all(res.id)
    })
    .then((names)=>{
        var tr, i
        addGroupsSwitch(getGroups(names))
        if(names.length == 0) stopMBLoader()
        for (i = 0; i < (names.length - 1); i++){             
            tr = addTableRow(names[i]) 
            table.append(tr)
        }
        respondToVisibility(tr, stopMBLoader)
    })
    .then(addSeatNum)
    .then(addThEvent)
}