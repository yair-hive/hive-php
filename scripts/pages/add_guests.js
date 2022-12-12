import "../lib/read-excel-file.min.js"
import { startMBLoader, stopMBLoader } from "../scripts.js"
import api from '../api/api.js'

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
var map_id = ''
api.map.get(map_name)
.then(res => map_id = res.id)
.then(()=>{
    document.getElementById('add_guest_button').addEventListener('click', ()=>{
        startMBLoader()
        var data = []
        data[0] = document.getElementById('add_guest_form')['first_name'].value
        data[1] = document.getElementById('add_guest_form')['last_name'].value
        data[2] = document.getElementById('add_guest_form')['guest_group'].value
        api.guest.create(data, map_id)
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
                api.guest.create(row, map_id)
            }
        })
        .then(stopMBLoader)
    })
})