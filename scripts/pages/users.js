import { onAddPermission } from "../eventListeners.js"
import api from '../api/api.js'
var users_table = document.getElementById('users_table')
api.user.get_all()
.then((users)=>{
    for(let user of users){
        var tr = document.createElement('tr')
        var td_user_name = document.createElement('td')
        td_user_name.textContent = user.user_name
        var td_permissions = document.createElement('td')         
        var list_td = document.createElement('div')
        list_td.addEventListener('click', onAddPermission)
        list_td.classList.add('list_td')
        list_td.setAttribute('id', 'list_td') 
        list_td.setAttribute('state', 'on') 
        list_td.setAttribute('user_id', user.id)            
        if(user.permissions){
            list_td.innerHTML = '<span class="permission_name">'+user.permissions.join('</span><span class="permission_name">')+'</span>'
        }else{
            list_td.innerHTML = '<span class="permission_name none"> none </span>'
        }
        td_permissions.append(list_td)
        tr.append(td_user_name)
        tr.append(td_permissions)
        users_table.append(tr)                
    }
})