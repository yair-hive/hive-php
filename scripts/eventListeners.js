import "./lib/jquery.min.js"
import api from './api/api.js'

function switchMouseOut(e){
    e.target.style.backgroundColor = 'rgb(119, 224, 224)' 
}

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
            api.user.add_permission(user_id, select.value)
            .then(res => res.json())
            .then(res => alert(res.msg))
            .then(()=> window.location.reload())
        })
        if(list_td.getAttribute('state') == 'on'){ 
            list_td.setAttribute('state', 'off')      
            api.user.get_permissions_list()            
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
export const onShowOnlyWthBelong = ()=>{
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
export const onShowOnlyWthoutBelong = ()=>{
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
export const onShowAll = ()=>{
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
export const onSeatNum = (event)=>{
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