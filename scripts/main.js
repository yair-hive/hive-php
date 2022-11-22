import { map } from "./api/map.js"
import {add_map, add_seats, add_guests, add_guests_table, add_belong} from "./elements.js"
import { onAddPermission, onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp, onShowAll, onShowOnlyWthBelong, onShowOnlyWthoutBelong } from "./eventListeners.js"
import { create_selection, DragToScroll, zoom, sortTable } from "./scripts.js"
import add_match_menu from './add_match_menu.js'
import "./lib/jquery.min.js"
import "./lib/read-excel-file.min.js"
import "./lib/jquery.table2excel.min.js"
import { seat } from "./api/seat.js"
import { guest } from "./api/guest.js"
import { user } from "./api/user.js"

export const selection = create_selection()
export const dragToScroll = new DragToScroll()
selection.disable()
const parsedUrl = new URL(window.location.href)
const base_path = '/hive-php/html/'

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})

switch(parsedUrl.pathname){
    case base_path+'edit_map.html':
        selection.enable()
        var map_name = parsedUrl.searchParams.get("map_name")
        $('title').append(map_name)
        var map_data = {}
        var guests_data = {}
        var map_id = ''
        map.get(map_name).then(map => {add_map(map); map_data = map; map_id = map.id })
        .then(() => seat.get_all(map_id))
        .then(seats => add_seats(seats))
        .then(()=>{add_belong()})
        .then(() => guest.get_all(map_id))
        .then((guests) => {add_guests(guests); guests_data = guests})
        .then(()=>{
            selection.resolveSelectables()
            document.getElementById('loader').style.display = 'none'
            document.getElementById('loader-container').style.display = 'none'
            document.getElementById('select_seats').addEventListener('click', onClick_select_seats)
            document.getElementById('select_cells').addEventListener('click', onClick_select_cells)
            document.getElementById('add_seats').addEventListener('click', onClick_add_seats)
            document.getElementById('add_seat_number').addEventListener('click', onClick_add_seat_number)
            document.addEventListener('mousedown', onClick_outside)
            document.addEventListener("keydown", onKeyBordDown)
            document.addEventListener("keyup", onKeyBordUp)
            document.getElementById('mainBord').addEventListener('wheel', zoom)
            document.querySelectorAll('.name_box').forEach(box => box.addEventListener('click', event => add_match_menu(guests_data, event.target)))
        })
        break;
    case base_path+'create_map.html':
        document.getElementById('create_map').addEventListener('click', ()=>{map.create().then(()=>{window.location.replace('http://localhost/hive-php/html/maps.html')})})
        break;
    case base_path+'maps.html':
        var maps_list = document.getElementById('maps_list')
        map.get_all()
        .then((maps)=>{
            console.log(maps)
            for(let map of maps){
                var li = $('<li>')
                .append($('<a>').attr('href', `edit_map.html?map_name=${map}`).text(map))
                $(maps_list).append(li)
            }
        })
        break;
    case base_path+'users.html':
        var users_table = document.getElementById('users_table')
        user.get_all()
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
                $(users_table).append(tr)                
            }
        })
        break;
    case base_path+'add_guests.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        var go_back = document.createElement('div')
        go_back.classList.add('hive-button')
        go_back.textContent = 'חזור לרשימת שמות'
        go_back.onclick = ()=>{window.location.replace('http://localhost/hive-php/html/get_guests.html?map_name='+map_name)}
        document.getElementById('mneu').append(go_back)
        var map_id = ''
        map.get(map_name)
        .then(res => map_id = res.id)
        .then(()=>{
            document.getElementById('loader').style.display = 'none'
            document.getElementById('loader-container').style.display = 'none'
            document.getElementById('add_guest_button').addEventListener('click', ()=>{
                var data = []
                data[0] = document.getElementById('add_guest_form')['first_name'].value
                data[1] = document.getElementById('add_guest_form')['last_name'].value
                data[2] = document.getElementById('add_guest_form')['guest_group'].value
                guest.create(data, map_id)
                .then(()=>{
                    document.getElementById('add_guest_form').reset()
                })
            })
            document.getElementById('submit').addEventListener('click', ()=>{
                var file = document.getElementById('file').files[0] 
                document.getElementById('loader').style.display = 'block'
                document.getElementById('loader-container').style.display = 'block'    
                readXlsxFile(file)
                .then((rows)=>{
                    for(let row of rows){
                        guest.create(row, map_id)
                    }
                })
                .then(()=>{
                    document.getElementById('loader').style.display = 'none'
                    document.getElementById('loader-container').style.display = 'none'
                 })
            })
        })
        break;
    case base_path+'login.html':
        document.getElementById('login_button').addEventListener('click', ()=>{user.login().then(json => alert(json.msg))})
        document.getElementById('sginup_button').addEventListener('click', ()=>{user.sginup().then(json => alert(json.msg))})
        document.getElementById('logout_button').addEventListener('click', ()=>{user.logout().then(json => alert(json.msg))})
        break;
    case base_path+'get_guests.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        var go_back = document.createElement('div')
        go_back.classList.add('hive-button')
        go_back.textContent = 'חזור למפה'
        go_back.onclick = ()=>{window.location.replace('http://localhost/hive-php/html/edit_map.html?map_name='+map_name)}
        document.getElementById('mneu').append(go_back)
        var table = document.getElementById('names_table')
        document.getElementById('ShowOnlyWthBelong').addEventListener('click', onShowOnlyWthBelong) 
        document.getElementById("ShowOnlyWthoutBelong").addEventListener('click', onShowOnlyWthoutBelong)
        document.getElementById("ShowAll").addEventListener('click', onShowAll)        
        document.getElementById('export').addEventListener('click', ()=>{
            var table = document.getElementById('names_table').cloneNode(true)
            var rows = table.rows
            for(let row of rows){
                row.childNodes[4].remove()
            }
            table.querySelectorAll('.no_show').forEach(e => e.parentNode.remove())
            $(table).table2excel({
                filename: "list.xls"
            });
        })
        add_guests_table(map_name, table).then(()=>{
            document.getElementById('loader').style.display = 'none'
            document.getElementById('loader-container').style.display = 'none' 
        })
        document.getElementById("first").addEventListener('click', ()=>{sortTable(1)}) 
        document.getElementById("last").addEventListener('click', ()=>{sortTable(2)})
        document.getElementById("group").addEventListener('click', ()=>{sortTable(3)})        
        break;
}