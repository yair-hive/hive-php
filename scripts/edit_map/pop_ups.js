import popUp from "../hiveElements/PopUp.js"
import { resizeAllInputs } from "../scripts.js"
import { on_show_tags } from "./eventListeners.js"
import api from "../api/api.js"

function tags(){
    function tags_list_script(pop_up){
        return new Promise((resolve) => {
            const parsedUrl = new URL(window.location.href)
            var map_name = parsedUrl.searchParams.get("map_name")
            if(map_name){
                var map_id
                api.map.get(map_name).then(map => map_id = map.id)
                .then(()=>{
                    api.seat_groups.get_all_tags(map_id)
                    .then(groups => {
                        var table = document.getElementById('tags_table')
                        for(let i = 0; i < groups.length; i++){
                            var group = groups[i]
                            var tr = document.createElement('tr')
                            tr.setAttribute('group_id', group.id)
                            var td_name = document.createElement('td')
                            var td_color = document.createElement('td')
                            var td_score = document.createElement('td')
                            var td_x = document.createElement('td')
                            var color_input = document.createElement('input')
                            color_input.setAttribute('type', 'color')
                            color_input.setAttribute('value', group.color)
                            var name_input = document.createElement('input')
                            name_input.value = group.tag_name
                            name_input.addEventListener('focusout', (e)=>{
                                var id = e.target.parentNode.parentNode.getAttribute('group_id')
                                var name = e.target.value
                                api.seat_groups.update_tag_name(id, name)
                            })
                            td_name.append(name_input)
                            td_color.style.backgroundColor = group.color
                            td_score.textContent = group.score
                            td_color.classList.add('td_color')
                            color_input.style.padding = '0'
                            color_input.style.margin = '0'
                            color_input.style.height = '100%'
                            color_input.addEventListener('focusout', (e)=>{
                                var color = e.target.value
                                var group_id = e.target.parentNode.parentNode.getAttribute('group_id')
                                api.seat_groups.update_tag_color(group_id, color)
                                .then(pop_up.close)
                            })
                            td_color.append(color_input)
                            td_x.setAttribute('group_id', group.id)
                            td_x.textContent = 'X'
                            td_x.style.backgroundColor = 'red'
                            td_x.style.padding = '5px'
                            td_x.addEventListener('click', (e)=>{
                                var group_id = e.target.parentNode.getAttribute('group_id')
                                api.tags.delete_tag({tag_id: group_id})
                                .then(pop_up.close)
                            })
                            tr.append(td_x)
                            tr.append(td_color)
                            tr.append(td_score)
                            tr.append(td_name)
                            table.append(tr)
                            if(i == (groups.length -1)) resolve()
                        }
                    })
                })
                document.addEventListener('keydown', (e)=>{
                    if(e.keyCode == 13){
                        document.activeElement.blur()
                    }
                })
            }
        })
    }
    function tags_list(){
        return `<table id="tags_table">
            <tr>
                <th> X </th>
                <th> צבע </th>
                <th> ניקוד </th>
                <th> שם </th>
            </tr>
        </table>`
    }
    var tags_pop_up = new popUp('תגיות', tags_list())
    tags_pop_up.onClose = on_show_tags
    tags_pop_up.onOpen = function(pop_up){
        tags_list_script(pop_up)
        .then(()=>{
            resizeAllInputs()
        })
    }
    return tags_pop_up
}

export default {
    tags: tags()
}