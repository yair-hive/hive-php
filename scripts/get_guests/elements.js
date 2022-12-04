import "../lib/jquery.min.js"
import { respondToVisibility, stopMBLoader } from "../scripts.js"
import api from '../api/api.js'
import { onSeatNum } from "../eventListeners.js"
import { hiveSwitch, onGroupsSwitch, onTdFocusOut } from "../elements.js"

export const add_guests_table = (map_name, table)=>{
    var map_id = ''
    var table_length = 0
    return api.map.get(map_name)
    .then(res => map_id = res.id)
    .then(()=>{
        api.guest.get_all(map_id)
        .then((names)=>{
            if(names.length == 0) stopMBLoader()
            table_length = names.length
            var i = 1
            var groups = []
            for(let name of names){
                i++
                var td = document.createElement('td')
                td.classList.add('seat_num')
                td.setAttribute('guest_id', name.id)                  
                var tdX = document.createElement('td')
                tdX.style.backgroundColor = 'red'
                tdX.textContent = 'X'
                tdX.addEventListener('click', (event)=>{
                    api.guest.delete(name.id)
                    .then(()=>{
                        event.target.parentNode.style.display = 'none'
                        event.target.parentNode.childNodes[0].setAttribute('show', 'false')
                        event.target.classList.add('no_show')
                    })
                })
                var tr = document.createElement('tr')
                tr.setAttribute('map_id', map_id)
                tr.setAttribute('guest_id', name.id)
                tr.setAttribute('group', name.guest_group)
                tr.setAttribute('status_group', 'open')
                tr.setAttribute('status_belong', 'open')
                if(groups.indexOf(name.guest_group) == -1){
                    groups.push(name.guest_group)
                }
                var tr_j = $(tr)
                .append(td)
                .append($('<td>').append($('<input>').val(name.last_name).on('focusout', onTdFocusOut)))
                .append($('<td>').append($('<input>').val(name.first_name).on('focusout', onTdFocusOut)))
                .append($('<td>').append($('<input>').val(name.guest_group).on('focusout', onTdFocusOut)))
                .append($('<td>').text(name.score))
                .append(tdX)
                $(table).append(tr_j)
                if(i == table_length){
                    respondToVisibility(tr, stopMBLoader)
                }
            }
            var groupsSwitch = document.getElementById('groupsSwitch')
            var i = 0
            var l = groups.length -1
            for(var group of groups){
                var div = document.createElement('div')
                div.textContent = group
                group = group.replace(' ', '_')
                div.setAttribute('id', group)                        
                groupsSwitch.append(div)
                i++
            }
            var groupsSwitchOptions = {
                element_id: 'groupsSwitch', 
                active: 'all', 
                keys: ['q', '/']
            } 
            hiveSwitch(groupsSwitchOptions, onGroupsSwitch)
        })
        .then(()=>{
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
        })
    })
}