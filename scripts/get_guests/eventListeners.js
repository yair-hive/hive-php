import { exportTableToExcel } from "../scripts.js"

function onShowOnlyWthBelong(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e =>{
        if(e.parentNode.getAttribute('status_group') == 'open'){
            e.parentNode.style.display = 'none'
            e.parentNode.setAttribute('status_belong', 'close')
            e.classList.add('no_show')
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
}
function onShowOnlyWthoutBelong(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            e.parentNode.style.display = 'none'
            e.parentNode.setAttribute('status_belong', 'close')
            e.classList.add('no_show')
        }
    })
}
function onShowAll(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
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
export function onBelongSwitch(active){
    switch(active){
        case 'ShowOnlyWthBelong':
            onShowOnlyWthBelong()
            break;
        case 'ShowOnlyWthoutBelong':
            onShowOnlyWthoutBelong()
            break;
        case 'ShowAll':
            onShowAll()
            break;
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
export function onGroupsSwitch(active){
    var group = active
    var table = document.getElementById('names_table')
    if(group == 'all'){
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                rows[i].style.display = 'table-row'; 
                rows[i].style.verticalAlign = 'inherit';
                rows[i].setAttribute('status_group', 'open')
            }
        }
    }else{
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                if(rows[i].getAttribute('group') != group){
                    rows[i].style.display = 'none'
                    rows[i].setAttribute('status_group', 'close')
                    rows[i].childNodes[0].classList.add('no_show')
                }
                else{
                    rows[i].childNodes[0].classList.remove('no_show')
                    rows[i].style.display = 'table-row'; 
                    rows[i].style.verticalAlign = 'inherit';
                    rows[i].setAttribute('status_group', 'open')
                }
            }
        }
    }
}
export function onTdFocusOut(e){
    var data = []
    data[0] = e.target.parentNode.parentNode.childNodes[2].childNodes[0].value
    data[1] = e.target.parentNode.parentNode.childNodes[1].childNodes[0].value
    data[2] = e.target.parentNode.parentNode.childNodes[3].childNodes[0].value
    var map_id = e.target.parentNode.parentNode.parentNode.getAttribute('map_id')
    var guest_id = e.target.parentNode.parentNode.getAttribute('guest_id')
    api.guest.update(data, map_id, guest_id)
}