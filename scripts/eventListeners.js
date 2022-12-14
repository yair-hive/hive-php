import "./lib/jquery.min.js"
import { seat } from "./api/seat.js"
import { user } from "./api/user.js"

export const onAddPermission = (event)=>{
    if(event.target.id == 'list_td'){
        var list_td = event.target    
        var select = document.createElement('select')
        var button = document.createElement('div')
        select.classList.add('hive-button')
        select.classList.add('users-button')
        button.classList.add('hive-button')
        button.classList.add('users-button')
        button.textContent = 'הוסף'
        button.addEventListener('click', ()=>{
            var user_id = list_td.getAttribute('user_id')
            user.add_permission(user_id, select.value)
            .then(res => res.json())
            .then(res => alert(res.msg))
            .then(()=> window.location.reload())
        })
        if(list_td.getAttribute('state') == 'on'){ 
            list_td.setAttribute('state', 'off')      
            user.get_permissions_list()            
            .then((permissions)=>{
                var option = document.createElement('option')
                option.setAttribute('value', 'none')
                option.textContent = 'none'
                select.append(option)
                for(let permission of permissions){
                    var option = document.createElement('option')
                    option.setAttribute('value', permission)
                    option.textContent = permission
                    select.append(option)
                }
            })
            list_td.innerHTML = ''
            list_td.append(select) 
            list_td.append(button)  
        }
    }
}
export const onShowOnlyWthBelong = (event)=>{
    document.querySelectorAll('.hive-button').forEach(e => {
        e.style.backgroundColor = 'rgb(119, 224, 224)'
        e.addEventListener('mouseover', e => e.target.style.backgroundColor = '#7a93b9')
        e.addEventListener('mouseout', e => e.target.style.backgroundColor = 'rgb(119, 224, 224)')
    })
    event.target.style.backgroundColor = '#7a93b9';
    document.querySelectorAll('td[seat_id = "none"]').forEach(e =>{
        e.parentNode.style.display = 'none'
        e.classList.add('no_show')
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.getAttribute('show') == 'true'){
            e.parentNode.style.display = 'table-row';
            e.parentNode.style.verticalAlign = 'inherit';
        }
    })
}
export const onShowOnlyWthoutBelong = (event)=>{
    document.querySelectorAll('.hive-button').forEach(e => {
        e.style.backgroundColor = 'rgb(119, 224, 224)'
        e.addEventListener('mouseover', e => {e.target.style.backgroundColor = '#7a93b9'})
        e.addEventListener('mouseout', e => e.target.style.backgroundColor = 'rgb(119, 224, 224)')
    })
    event.target.style.backgroundColor = '#7a93b9';
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.getAttribute('show') == 'true'){
            e.parentNode.style.display = 'table-row';
            e.parentNode.style.verticalAlign = 'inherit';
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        e.parentNode.style.display = 'none'
        e.classList.add('no_show')
    })
}
export const onShowAll = (event)=>{
    document.querySelectorAll('.hive-button').forEach(e => {
        e.style.backgroundColor = 'rgb(119, 224, 224)'
        e.addEventListener('mouseover', e => e.target.style.backgroundColor = '#7a93b9')
        e.addEventListener('mouseout', e => e.target.style.backgroundColor = 'rgb(119, 224, 224)')
    })
    event.target.style.backgroundColor = '#7a93b9';
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.getAttribute('show') == 'true'){
            e.parentNode.style.display = 'table-row';
            e.parentNode.style.verticalAlign = 'inherit';
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.getAttribute('show') == 'true'){
            e.parentNode.style.display = 'table-row';
            e.parentNode.style.verticalAlign = 'inherit';
        }
    })
}
export const onSeatNum = (event)=>{
    event.target.innerHTML = ''
    var button = document.createElement('button')
    button.textContent = 'הסר'
    button.setAttribute('seat_id', event.target.getAttribute('seat_id'))
    button.addEventListener('click', (event)=>{
        event.preventDefault()
        var seat_id = event.target.getAttribute('seat_id')
        seat.delete_belong(seat_id)
        event.target.parentNode.parentNode.style.display = 'none' 
        event.target.parentNode.setAttribute('show', 'false')
     })
    event.target.append(button)
}