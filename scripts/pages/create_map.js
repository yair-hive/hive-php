import { map } from '../api/map.js'
document.getElementById('create_map').addEventListener('click', ()=>{
    map.create().then(()=>{
        window.location.replace('http://localhost/hive-php/html/maps.html')
    })
})