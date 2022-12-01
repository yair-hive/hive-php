import api from '../api/api.js'
document.getElementById('create_map').addEventListener('click', ()=>{
    api.map.create().then(()=>{
        window.location.replace('http://localhost/hive-php/html/maps.html')
    })
})