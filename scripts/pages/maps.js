import { map } from "../api/map.js"
import "../lib/jquery.min.js"
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