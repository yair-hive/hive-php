import { map } from "../api/map.js"
import { guest } from "../api/guest.js"
import "../lib/read-excel-file.min.js"
import { startMBLoader, stopMBLoader } from "../scripts.js"

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
var map_id = ''
map.get(map_name)
.then(res => map_id = res.id)
.then(()=>{
    document.getElementById('add_guest_button').addEventListener('click', ()=>{
        startMBLoader()
        var data = []
        data[0] = document.getElementById('add_guest_form')['first_name'].value
        data[1] = document.getElementById('add_guest_form')['last_name'].value
        data[2] = document.getElementById('add_guest_form')['guest_group'].value
        guest.create(data, map_id)
        .then(()=>{
            document.getElementById('add_guest_form').reset()
        })
        .then(stopMBLoader)
    })
    document.getElementById('submit').addEventListener('click', ()=>{
        startMBLoader()
        var file = document.getElementById('file').files[0]    
        readXlsxFile(file)
        .then((rows)=>{
            for(let row of rows){
                guest.create(row, map_id)
            }
        })
        .then(stopMBLoader)
    })
})