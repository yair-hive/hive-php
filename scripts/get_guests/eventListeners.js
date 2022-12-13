import { exportTableToExcel } from "../scripts.js"
import api from "../api/api.js"

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
export function onSeatNum(event){
    event.target.innerHTML = ''
    var button = document.createElement('button')
    button.textContent = 'הסר'
    button.setAttribute('seat_id', event.target.getAttribute('seat_id'))
    button.addEventListener('click', (event)=>{
        event.preventDefault()
        var seat_id = event.target.getAttribute('seat_id')
        api.seat.delete_belong(seat_id)
        event.target.parentNode.parentNode.style.display = 'none' 
        event.target.parentNode.setAttribute('show', 'false')
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