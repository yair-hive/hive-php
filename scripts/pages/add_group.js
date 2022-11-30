import { guest } from '../api/guest.js'
import { map } from '../api/map.js'

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
if(map_name){
    var map_id
    map.get(map_name).then(map => map_id = map.id)
    .then(()=>{
        document.getElementById('create_group').addEventListener('click', ()=>{
            guest.creae_group(map_id)
            .then(res => alert(res))
        })
    })
}