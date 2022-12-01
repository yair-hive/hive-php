import api from '../api/api.js'

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
if(map_name){
    var map_id
    api.map.get(map_name).then(map => map_id = map.id)
    .then(()=>{
        document.getElementById('create_group').addEventListener('click', ()=>{
            api.guest.creae_group(map_id)
            .then(res => alert(res))
        })
    })
}