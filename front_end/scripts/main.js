import { post_map, get_map, get_seats, get_guests_names, get_all_maps, login, sginup, get_user, logout, post_guest } from "./api.js"
import {add_map, add_seats, add_guest} from "./elements.js"
import { onClick_add_seats, onClick_add_seat_number, onClick_outside, onClick_select_cells, onClick_select_seats, onKeyBordDown, onKeyBordUp } from "./eventListeners.js"
import { create_selection, DragToScroll, zoom} from "./scripts.js"
import add_match_menu from './add_match_menu.js'
import "./../lib/jquery.min.js"
import "./../lib/read-excel-file.min.js"
import "./../lib/jquery.table2excel.min.js"

export const selection = create_selection()
export const dragToScroll = new DragToScroll()
selection.disable()
const parsedUrl = new URL(window.location.href)

get_user()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})

switch(parsedUrl.pathname){
    case '/hive-php/edit_map.html':
        selection.enable()
        var map_name = parsedUrl.searchParams.get("map_name")
        $('title').append(map_name)
        let map_data = {}
        let guests_data = {}
        get_map(map_name).then(map => {add_map(map); map_data = map})
        .then(() => get_seats(map_name))
        .then(seats => add_seats(seats))
        .then(() => get_guests_names(map_name))
        .then((guests) => {add_guest(guests); guests_data = guests})
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
    case '/hive-php/create_map.html':
        document.getElementById('create_map').addEventListener('click', post_map)
        break;
    case '/hive-php/maps.html':
        get_all_maps()
        break;
    case '/hive-php/guest_seat_num.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        $.ajax({
            type: "POST", 
            url: "http://localhost/hive-php/api.php",
            data: "action=get_guest_seat_num&map_name="+map_name,
            success: function(msg){
                var belongs_list = JSON.parse(msg)   
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
            }
        });
        document.getElementById('export').addEventListener('click', ()=>{
            $(list_table).table2excel({
                filename: "list.xls"
            });
        })
        break;
    case '/hive-php/add_guests.html':
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
    case '/hive-php/login.html':
        document.getElementById('login_button').addEventListener('click', ()=>{login().then(json => alert(json.msg))})
        document.getElementById('sginup_button').addEventListener('click', ()=>{sginup().then(json => alert(json.msg))})
        document.getElementById('logout_button').addEventListener('click', ()=>{logout().then(json => alert(json.msg))})
        break;
    case '/hive-php/get_guests.html':
        var map_name = parsedUrl.searchParams.get("map_name")
        var table = document.getElementById('names_table')
        get_guests_names(map_name)
        .then((names)=>{
            for(let name of names){
                var tr = $('<tr>')
                .append($('<td>').text(name.last_name))
                .append($('<td>').text(name.first_name))
                .append($('<td>').text(name.group))
                $(table).append(tr)
            }
        })
        break;
}