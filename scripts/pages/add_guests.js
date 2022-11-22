import { map } from "../api/map.js"
import { guest } from "../api/guest.js"
import "../lib/jquery.min.js"
import "../lib/read-excel-file.min.js"
const parsedUrl = new URL(window.location.href)
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