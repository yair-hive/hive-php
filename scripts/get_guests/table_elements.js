import api from '../api/api.js'
import { onTdRequests, onTdFocusOut, onSeatNum } from "./eventListeners.js"

export function td_delete(){
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
export function td_seat_number(seat){
    var td = document.createElement('td')
    td.classList.add('seat_num')
    if(seat){
        td.textContent = seat.seat_number
        td.addEventListener('click', onSeatNum)
    }
    return td
}
export function td_input(value){
    var td = document.createElement('td')
    var input = document.createElement('input')
    input.value = value
    input.addEventListener('focusout', onTdFocusOut)
    td.append(input)
    return td
}
export function td_tags(tags){
    var table = document.getElementById('names_table') 
    var map_tags = JSON.parse(table.getAttribute('tags'))
    var td = document.createElement('td')
    td.classList.add('td_tag')
    var tags_cont = document.createElement('div')
    tags_cont.classList.add('tags_cont')
    if(tags) {
        for(let tag of tags){
            var tag_box = document.createElement('div')
            tag_box.classList.add('tag_box')
            tag_box.style.backgroundColor = map_tags[tag.group_id].color
            tag_box.textContent = map_tags[tag.group_id].tag_name
            tags_cont.append(tag_box)
        }
    }
    td.append(tags_cont)
    var p = td.getBoundingClientRect()
    var c = tags_cont.getBoundingClientRect()
    var scale = 1
    while(p.width < c.width){
        scale = scale - 0.01
        tags_cont.style.transform = `scale(${scale})`
        p = td.getBoundingClientRect()
        c = tags_cont.getBoundingClientRect()
    }
    return td
}
export function td_requests(requests){
    var td = document.createElement('td')
    td.classList.add('td_requests')
    var table = document.getElementById('names_table') 
    var map_tags = JSON.parse(table.getAttribute('tags'))
    if(requests){
        for(let request of requests){
            td.append(' | '+map_tags[request].tag_name+' | ')
        }
    }
    td.addEventListener('click', onTdRequests)
    return td
}
export function td_score(name){
    var tdScore = document.createElement('td')
    var score_input = document.createElement('input')
    score_input.setAttribute('value', name.score)
    score_input.setAttribute('group_score', name.group_score)
    score_input.addEventListener('focusout', (event)=>{
        var guest_id = event.target.parentNode.parentNode.getAttribute('guest_id')
        var p_score = Number(event.target.getAttribute('group_score'))
        var c_score = Number(event.target.value)
        var score = c_score - p_score
        api.guest.update_guest_score(guest_id, score)

    })
    tdScore.append(score_input)
    return tdScore
}
export function row(name){
    var tr = document.createElement('tr')
    tr.setAttribute('guest_id', name.id)
    tr.setAttribute('guest_group', name.guest_group)
    if(name.seat){
        if(name.seat.tags){
            var table = document.getElementById('names_table') 
            var map_tags = JSON.parse(table.getAttribute('tags'))
            var tags_names = []
            for(let tag of name.seat.tags){
                tags_names.push(map_tags[tag.group_id].tag_name)
            }
            tr.setAttribute('tags', JSON.stringify(tags_names))
        }
        tr.setAttribute('seat_id', name.seat.id)
        tr.setAttribute('belong', 'belong')
    }else{
        tr.setAttribute('belong', 'no belong')
    }
    return tr
}