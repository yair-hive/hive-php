import popUp from "../hiveElements/PopUp.js"
import { resizeAllInputs } from "../scripts.js"
import { on_show_tags } from "./eventListeners.js"
import api from "../api/api.js"

function tags(){
    function tags_list_script(pop_up){
        const map_id = document.getElementById('map').getAttribute('map_id')
        const table = document.getElementById('tags_table')
        function add_td_color(group, pop_up){
            var td_color = document.createElement('td')
            var color_input = document.createElement('input')
            color_input.setAttribute('type', 'color')
            color_input.setAttribute('value', group.color)
            td_color.style.backgroundColor = group.color
            td_color.classList.add('td_color')
            color_input.style.padding = '0'
            color_input.style.margin = '0'
            color_input.style.height = '100%'
            color_input.addEventListener('focusout', (e)=>{
                var color = e.target.value
                var group_id = e.target.parentNode.parentNode.getAttribute('group_id')
                api.seat_groups.update_tag_color(group_id, color)
            })
            td_color.append(color_input)
            return td_color
        }
        function add_td_x(group, pop_up){
            var td = document.createElement('td')
            td.setAttribute('group_id', group.id)
            td.textContent = 'X'
            td.style.backgroundColor = 'red'
            td.style.padding = '5px'
            td.addEventListener('click', (e)=>{
                var group_id = e.target.parentNode.getAttribute('group_id')
                api.tags.delete_tag({tag_id: group_id})
            })
            return td
        }
        function add_td_name(group){
            var td_name = document.createElement('td')
            var name_input = document.createElement('input')
            name_input.value = group.tag_name
            name_input.addEventListener('focusout', (e)=>{
                var id = e.target.parentNode.parentNode.getAttribute('group_id')
                var name = e.target.value
                api.seat_groups.update_tag_name(id, name)
            })
            td_name.append(name_input)
            return td_name
        }
        function add_rows(groups, pop_up){
            for(let group of groups){
                var tr = document.createElement('tr')
                tr.setAttribute('group_id', group.id)
                var td_score = document.createElement('td')
                td_score.textContent = group.score
                tr.append(add_td_x(group, pop_up))
                tr.append(add_td_color(group, pop_up))
                tr.append(td_score)
                tr.append(add_td_name(group))
                table.append(tr)
            }
        }
        return api.seat_groups.get_all_tags(map_id)
        .then((groups)=> add_rows(groups, pop_up))
        .then(resizeAllInputs)
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
    tags_pop_up.onOpen = tags_list_script
    return tags_pop_up
}

export default {
    tags: tags()
}