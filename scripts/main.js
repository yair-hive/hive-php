import { post_map, get_map, get_seats, get_guests, login, sginup, get_user, logout, post_guest, get_maps, get_guest_seat_num, get_users, add_permission, check_belong, delete_guest, get_permissions_list } from "./api.js"
import {add_map, add_seats, add_guests} from "./elements.js"
import { onAddPermission, onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp } from "./eventListeners.js"
import { create_selection, DragToScroll, zoom} from "./scripts.js"
import add_match_menu from './add_match_menu.js'
import "./lib/jquery.min.js"
import "./lib/read-excel-file.min.js"
import "./lib/jquery.table2excel.min.js"

export const selection = create_selection()
export const dragToScroll = new DragToScroll()
selection.disable()
const parsedUrl = new URL(window.location.href)
const base_path = '/hive-php/html/'

get_user()
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
        let map_data = {}
        let guests_data = {}
        get_map(map_name).then(map => {add_map(map); map_data = map})
        .then(() => get_seats(map_name))
        .then(seats => add_seats(seats))
        .then(() => get_guests(map_name))
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
        document.getElementById('create_map').addEventListener('click', post_map)
        break;
    case base_path+'maps.html':
        var maps_list = document.getElementById('maps_list')
        get_maps()
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
        get_users()
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
    case base_path+'guest_seat_num.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        get_guest_seat_num(map_name)
        .then(respons => respons.json())
        .then((belongs_list)=>{
            var list_table = $('<table>').attr('id', 'list_table')                
            var tr = $('<tr>')
            .append($('<th>').text('מספר כיסא'))
            .append($('<th>').text('שיעור')) 
            .append($('<th>').text('שם פרטי'))
            .append($('<th>').text('שם משפחה'))
            $(list_table).append(tr)
            for(let bel of belongs_list){ 
                var tr = $('<tr>')
                .append($('<td>').text(bel.seat_num))
                .append($('<td>').text(bel.guest_group)) 
                .append($('<td>').text(bel.guest_first_name))
                .append($('<td>').text(bel.guest_last_name))                      
                $(list_table).append(tr)
            }
            $('#table-container').append(list_table)
        })
        document.getElementById('export').addEventListener('click', ()=>{
            $(list_table).table2excel({
                filename: "list.xls"
            });
        })
        break;
    case base_path+'add_guests.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        document.getElementById('loader').style.display = 'none'
        document.getElementById('loader-container').style.display = 'none'
        document.getElementById('add_guest_button').addEventListener('click', ()=>{
            var data = []
            data[0] = document.getElementById('add_guest_form')['first_name'].value
            data[1] = document.getElementById('add_guest_form')['last_name'].value
            data[2] = document.getElementById('add_guest_form')['guest_group'].value
            post_guest(data, map_name)
            .then((respos)=>{
                alert(respos.msg); 
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
                    post_guest(row, map_name)
                }
			})
            .then(()=>{
                document.getElementById('loader').style.display = 'none'
                document.getElementById('loader-container').style.display = 'none'
             })
        })
        break;
    case base_path+'login.html':
        document.getElementById('login_button').addEventListener('click', ()=>{login().then(json => alert(json.msg))})
        document.getElementById('sginup_button').addEventListener('click', ()=>{sginup().then(json => alert(json.msg))})
        document.getElementById('logout_button').addEventListener('click', ()=>{logout().then(json => alert(json.msg))})
        break;
    case base_path+'get_guests.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        var table = document.getElementById('names_table')
        get_guests(map_name)
        .then((names)=>{
            for(let name of names){
                var color
                check_belong(name.id)
                .then((msg)=>{
                    if(msg.msg == 'true'){
                        color = 'green'
                    }else{
                        color = 'grey'
                    }
                })
                .then(()=>{
                    var td = document.createElement('td')
                    td.style.backgroundColor = color
                    var tdX = document.createElement('td')
                    tdX.style.backgroundColor = 'red'
                    tdX.textContent = 'X'
                    tdX.addEventListener('click', ()=>{
                        delete_guest(name.id)
                        .then(window.location.reload())
                    })
                    var tr = $('<tr>')
                    .append(td)
                    .append($('<td>').text(name.last_name))
                    .append($('<td>').text(name.first_name))
                    .append($('<td>').text(name.group))
                    .append(tdX)
                    $(table).append(tr)
                })
            }
        })
        break;
    case base_path+'edit_user.html':
        var user_name = parsedUrl.searchParams.get("user_name")
        document.getElementById('edit_user').addEventListener('click', ()=>{
            var permission = document.getElementById('permission_name').value
            add_permission(user_name, permission)
            .then((respons) => respons.text())
            .then((res) => alert(res))
        })
        break;
}