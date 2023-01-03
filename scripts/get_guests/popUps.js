import api from '../api/api.js'
import PopUp from '../hiveElements/PopUp.js'

function guest_groups(){
    function groups_list_script(){
        const parsedUrl = new URL(window.location.href)
        var map_name = parsedUrl.searchParams.get("map_name")
        if(map_name){
            var map_id
            api.map.get(map_name).then(map => map_id = map.id)
            .then(()=>{
                api.guest.get_all_groups(map_id)
                .then(groups => {
                    var table = document.getElementById('groups_table')
                    for(let group of groups){
                        var tr = document.createElement('tr')
                        tr.setAttribute('group_id', group.id)
                        var td_name = document.createElement('td')
                        var td_color = document.createElement('td')
                        var td_score = document.createElement('td')
                        var td_x = document.createElement('td')
                        var color_input = document.createElement('input')
                        var score_input = document.createElement('input')
                        score_input.setAttribute('type', 'text')
                        color_input.setAttribute('type', 'color')
                        color_input.setAttribute('value', group.color)
                        td_name.textContent = group.group_name
                        td_color.style.backgroundColor = group.color
                        score_input.setAttribute('value', group.score)
                        score_input.style.width = '30px'
                        score_input.style.textAlign = 'center'
                        score_input.addEventListener('focusout', (event)=>{
                            var group_id = event.target.parentNode.parentNode.getAttribute('group_id')
                            var score = event.target.value
                            api.guest.update_group_score(group_id, score) 
                        })
                        td_score.append(score_input)
                        td_color.classList.add('td_color')
                        color_input.style.padding = '0'
                        color_input.style.margin = '0'
                        color_input.style.height = '100%'
                        color_input.addEventListener('focusout', (e)=>{
                            var color = e.target.value
                            var group_id = e.target.parentNode.parentNode.getAttribute('group_id')
                            api.guest.update_group_color(group_id, color)
                        })
                        td_color.append(color_input)
                        td_x.setAttribute('group_id', group.id)
                        td_x.textContent = 'X'
                        td_x.style.backgroundColor = 'red'
                        td_x.style.padding = '5px'
                        td_x.addEventListener('click', (e)=>{
                            var group_id = e.target.parentNode.getAttribute('group_id')
                            api.guest.delete_group(group_id)
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
            document.addEventListener('keydown', (e)=>{
                if(e.keyCode == 13){
                    document.activeElement.blur()
                }
            })
        }
    }
    function groups_list(){
        return `<table id="groups_table">
            <tr>
                <th> X </th>
                <th> צבע </th>
                <th> ניקוד </th>
                <th> שם </th> 
            </tr>
        </table>`
    }
    var guest_groups_pop_up = new PopUp('בחורים', groups_list())
    guest_groups_pop_up.onOpen = groups_list_script
    return guest_groups_pop_up
}
function import_guests(){
    function import_guest_form(){
        return `<form id='import_guests_form'>
            <h2> ייבא בחורים </h2>
            <label> בחר קובץ אקסאל </label> 
            <br />
            <input class="file_input" type="file" name="file" id="file" accept=".xls,.xlsx">
            <br />
            <div type="submit" id="submit" name="import" class="hive-button"> ייבא </div>	
        </form>`
    }
    function import_guest_form_script(pop_up){
        pop_up.popUpBody.classList.add('popUpBodyF')
        pop_up.popUpBody.setAttribute('dir', 'rtl')
        const parsedUrl = new URL(window.location.href)
        var map_name = parsedUrl.searchParams.get("map_name")
        var map_id = ''
        api.map.get(map_name)
        .then(res => map_id = res.id)
        .then(()=>{
            document.getElementById('submit').addEventListener('click', ()=>{
                var file = document.getElementById('file').files[0]    
                readXlsxFile(file)
                .then((rows)=>{
                    api.guest.create_multi({map_id: map_id, data: rows})
                    .then(()=>{
                        pop_up.close()
                        location.reload()
                    })
                //     for(let i = 0; i < rows.length; i++){
                //         var row = rows[i]
                //         var req = {
                //             map_id: map_id,
                //             first_name: row[0],
                //             last_name: row[1],
                //             guest_group: row[2]
                //         }
                //         api.guest.create(req)
                //         .then(()=>{
                //             if(i == (rows.length -1)) {
                //                 pop_up.close()
                //                 location.reload()
                //             }
                //         })
                //     }
                })
            })
        })
    }
    var import_guests_pop_up = new PopUp('ייבא בחורים', import_guest_form())
    import_guests_pop_up.onOpen = import_guest_form_script
    return import_guests_pop_up
}
function add_guests(){
    function add_guest_form(){
        return `<form id='add_guest_form'>
            <label for='first_name'> שם פרטי </label>
            <br /> 
            <input type='text' name='first_name'>  
            <br />           
            <label for="last_name"> שם משפחה </label>
            <br /> 
            <input type='text' name='last_name'>
            <br /> 
            <label for='guest_group'> שיעור </label>
            <br /> 
            <input type='text' name='guest_group'>
            <br /> 
            <div id='add_guest_button' class='hive-button'> הוסף </div> 
        </form>`
    }
    function add_guest_form_script(pop_up){
        pop_up.popUpBody.classList.add('popUpBodyF')
        pop_up.popUpBody.setAttribute('dir', 'rtl')
        const parsedUrl = new URL(window.location.href)
        var map_name = parsedUrl.searchParams.get("map_name")
        var map_id = ''
        api.map.get(map_name)
        .then(res => map_id = res.id)
        .then(()=>{
            document.getElementById('add_guest_button').addEventListener('click', ()=>{
                var data = []
                data[0] = document.getElementById('add_guest_form')['first_name'].value
                data[1] = document.getElementById('add_guest_form')['last_name'].value
                data[2] = document.getElementById('add_guest_form')['guest_group'].value
                var req = {
                    map_id: map_id,
                    first_name: data[0],
                    last_name: data[1],
                    guest_group: data[2]
                }
                api.guest.create(req)
                .then(()=>{
                    document.getElementById('add_guest_form').reset()
                    pop_up.close()
                    location.reload()
                })
            })
        })
    }
    var add_guests_pop_up = new PopUp('הוסף בחור', add_guest_form())
    add_guests_pop_up.onOpen = add_guest_form_script
    return add_guests_pop_up
}
export default {
    guest_groups: guest_groups(),
    import_guests: import_guests(),
    add_guests: add_guests(),
}
