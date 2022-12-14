import api from '../api/api.js'
import { onTdFocusOut } from "./eventListeners.js"

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
export function td_seat_number(){
    var td = document.createElement('td')
    td.classList.add('seat_num')
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
export function td_tags(){
    var td = document.createElement('td')
    td.classList.add('td_tag')
    return td
}
export function td_score(name){
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
export function row(name){
    var tr = document.createElement('tr')
    tr.setAttribute('guest_id', name.id)
    tr.setAttribute('guest_group', name.guest_group)
    return tr
}