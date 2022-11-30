import { guest } from '../api/guest.js'
import { map } from '../api/map.js'

const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
if(map_name){
    var map_id
    map.get(map_name).then(map => map_id = map.id)
    .then(()=>{
        guest.get_all_groups(map_id)
        .then(groups => {
            var table = document.getElementById('groups_table')
            for(let group of groups){
                var tr = document.createElement('tr')
                var td_name = document.createElement('td')
                var td_color = document.createElement('td')
                var td_score = document.createElement('td')
                var td_x = document.createElement('td')
                var color_input = document.createElement('input')
                color_input.setAttribute('type', 'color')
                color_input.setAttribute('value', group.color)
                td_name.textContent = group.group_name
                td_color.style.backgroundColor = group.color
                td_score.textContent = group.score
                td_color.classList.add('td_color')
                color_input.style.padding = '0'
                color_input.style.margin = '0'
                color_input.style.height = '100%'
                td_color.append(color_input)
                td_x.setAttribute('group_id', group.id)
                td_x.textContent = 'X'
                td_x.style.backgroundColor = 'red'
                td_x.style.padding = '5px'
                td_x.addEventListener('click', (e)=>{
                    var group_id = e.target.getAttribute('group_id')
                    guest.delete_group(group_id)
                    .then(()=>{
                        e.target.parentNode.style.display = 'none'
                    })
                })
                tr.append(td_x)
                tr.append(td_color)
                tr.append(td_score)
                tr.append(td_name)
                table.append(tr)
            }
        })
    })
}