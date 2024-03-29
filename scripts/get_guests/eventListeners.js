import { exportTableToExcel } from "../scripts.js"
import api from "../api/api.js"
import dropDown from "../hiveElements/dropDown.js"
import scrolling_list from '../hiveElements/scrolling_list.js'
import { add_requests } from "./elements.js"

var mainBord = document.getElementById('mainBord')
const menu = new dropDown(mainBord)
menu.onClose = function(){
    this.drop_element.innerHTML = ''
}

export function onExportTable(){
    {
        var table = document.getElementById('names_table').cloneNode(true)
        var rows = table.rows
        for(let row of rows){
            row.children[4].remove()
            row.children[4].remove()
        }
        var table_title = table.getElementsByTagName('tr')[0]
        table_title.children[0].textContent = 'כיסא'
        table.querySelectorAll('.no_show').forEach(e => e.parentNode.remove())
        var i = 0
        for(let row of rows){
            if(i != 0){
                var td_first = row.childNodes[1]
                var input = td_first.childNodes[0]
                var value = input.value
                td_first.textContent = value
                var td_last = row.childNodes[2]
                var input = td_last.childNodes[0]
                value = input.value
                td_last.textContent = value
                var td_group = row.childNodes[3]
                var input = td_group.childNodes[0]
                value = input.value
                td_group.textContent = value
            }
            i++
        }
        exportTableToExcel(table, 'שמות')
    }
}
export function onKeyBordDown(e){
    if(e.keyCode == 13){
        document.activeElement.blur()
    }
}
export const onClickOutside = (event)=>{
    if(event.keyCode != 13){
        var classList = event.target.classList
        if(!classList.contains('td_requests') && !classList.contains('drop_down') && !classList.contains('request_list') && !event.ctrlKey && !event.metaKey && !classList.contains('hive-button')){
            menu.close()
        }
    }
}
export function onSeatNum(event){
    event.target.innerHTML = ''
    var button = document.createElement('button')
    button.textContent = 'הסר'
    button.addEventListener('click', (event)=>{
        event.preventDefault()
        var seat_id = event.target.parentNode.parentNode.getAttribute('seat_id')
        api.seat.delete_belong(seat_id)
        location.reload()
     })
    event.target.append(button)
}
export function onTdFocusOut(e){
    var data = []
    data[0] = e.target.parentNode.parentNode.childNodes[3].childNodes[0].value
    data[1] = e.target.parentNode.parentNode.childNodes[2].childNodes[0].value
    data[2] = e.target.parentNode.parentNode.childNodes[4].childNodes[0].value
    data[3] = e.target.parentNode.parentNode.childNodes[5].textContent
    var map_id = e.target.parentNode.parentNode.parentNode.getAttribute('map_id')
    var guest_id = e.target.parentNode.parentNode.getAttribute('guest_id')
    api.guest.update(data, map_id, guest_id)
}
function onRequestsListItem(target){
    const table = document.getElementById('names_table') 
    const map_id = table.getAttribute('map_id')
    var tag_id = target.getAttribute('tag_id')
    var guest_id = target.getAttribute('guest_id')
    api.tags.add_request({tag_id: tag_id, guest_id: guest_id, map_id: map_id})
    .then(add_requests)
    .then(()=>{
        menu.close()
        console.log('adg')
    })
}
export function onTdRequests(event){
    if(menu.status != 'open'){
        const guest_scrolling_list = new scrolling_list(menu.drop_element)
        const table = document.getElementById('names_table') 
        var tags = JSON.parse(table.getAttribute('tags'))
        tags = Object.entries(tags)
        var list_elements = []
        for(let i = 0; i < tags.length; i++){
            var tag = tags[i][1]
            var li = document.createElement('li')
            li.setAttribute('tag_id', tag.id)
            li.setAttribute('guest_id', event.target.parentNode.getAttribute('guest_id'))
            li.innerHTML = tag.tag_name
            li.classList.add('request_list')
            list_elements.push(li)
        }
        guest_scrolling_list.replaceItems(list_elements)
        guest_scrolling_list.onItem = onRequestsListItem
    }
    menu.open(event.target)
}