import { map } from "../api/map.js"
var maps_list = document.getElementById('maps_list')
map.get_all()
.then((respons)=>{
    if(respons.msg != 'ok'){
        alert(respons.msg)
        return false
    }else{
        return respons.data
    }   
})
.then((maps)=>{
    if(maps){
        for(let map of maps){
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.setAttribute('href', `edit_map.html?map_name=${map}`)
            a.textContent = map
            li.append(a)
            maps_list.append(li)
        }
    }
})