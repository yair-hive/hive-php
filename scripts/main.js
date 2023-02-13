import api from './api/api.js'
import PopUp from './hiveElements/PopUp.js'

const api_url = '/php/api.php'

function test(){
    const options = {
        method: 'POST',
        body: "action=test",
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.text())
    .then(res => console.log(res))
    // .then(res => alert(res))
    // .then(res => res.json())
    // .then(res => console.log(res))
}
// test()
function add_create_map_form(){
    return `<form id='create_map_form'>
        <label for="map_name"> שם המפה </label>
        <br />
        <input type='text' name='map_name'>  
        <br />
        <label for="rows_number"> מספר שורות </label>
        <br />
        <input type='text' name='rows_number'>
        <br />
        <label for="columns_number"> מספר טורים </label>
        <br />
        <input type='text' name='columns_number'> 
        <br /> 
    <form>
    <div id='create_map' class='hive-button'> צור </div>`
}
function add_create_map_form_scripts(pop_up){
    pop_up.popUpBody.classList.add('popUpBodyF')
    pop_up.popUpBody.setAttribute('dir', 'rtl')
    document.getElementById('create_map').addEventListener('click', ()=>{
        var map_form = document.getElementById('create_map_form')
        var form_data = new FormData(map_form)
        const formDataObj = {};
        form_data.forEach((value, key) => (formDataObj[key] = value));
        var map_name = formDataObj.map_name
        api.map.create(formDataObj)
        .then(()=> location.replace(`/html/edit_map.html?map_name=${map_name}`))
    })
}
function add_maps_list(){
    return `<ul id="maps_list"></ul>
    <div id="add_map" class="hive-button"> הוסף מפה </div>`
}
function add_maps_list_scripts(pop_up){
    var create_map_pop_up = new PopUp('צור מפה', add_create_map_form())
    create_map_pop_up.onOpen = add_create_map_form_scripts
    document.getElementById('add_map').addEventListener('click', ()=>{
        pop_up.close()
        create_map_pop_up.open()
    })
    pop_up.popUpBody.classList.add('popUpBodyF')
    pop_up.popUpBody.setAttribute('dir', 'rtl')
    var maps_list = document.getElementById('maps_list')
    api.map.get_all()
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
                a.setAttribute('href', `edit_map.html?map_name=${map.map_name}`)
                a.textContent = map.map_name
                li.append(a)
                maps_list.append(li)
            }
        }
    })
}
function add_maps_list_pop_up(){
    var maps_list_pop_up = new PopUp('מפות', add_maps_list())
    maps_list_pop_up.onOpen = add_maps_list_scripts
    return maps_list_pop_up
}

var maps_list_pop_up = add_maps_list_pop_up()

var get_maps_button = document.getElementById('get_maps_button')

if(get_maps_button){
    get_maps_button.addEventListener('click', maps_list_pop_up.open)
}

api.user.get()
.then((respons) => {
    if(respons.msg === 'ok'){
        document.getElementById('user_element').innerText = respons.data
    }
})

api.user.get_all_actions()
var last_action_data = await api.user.get_last_action()
var last_action_date = last_action_data.data[0].action_date
last_action_date = new Date(last_action_date)

window.setInterval(async ()=>{
    var new_action_data = await api.user.get_last_action()
    var action_date = new_action_data.data[0].action_date
    action_date = new Date(action_date)
    if(action_date > last_action_date){
        location.reload()
    }
    
}, 5000)

function ws_test(){
    const hive_socket = new WebSocket('ws://hive.com:3001')
    hive_socket.onopen = function() {
        hive_socket.send('array');
    };
    hive_socket.onmessage = function(mss){
        console.log(mss)
    }
}
// ws_test()

function test69(){
    const options = {
        method: 'POST',
        credentials: 'include',
        body: '',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    fetch('https://hive.com/api/', options)
    .then(res => res.text())
    .then(console.log)
}

// test69()

function test70(){
    var a = ['p', 'o']
    console.log(a)
    var b = ['lopp', 'koo']
    a.push(...b)
    console.log(a)
}
// test70()
function test71(){
    const api_url1 = '/api/index.php'
    const options = {
        method: 'POST',
        body: "category=seat_groups&action=get_seats_by_cols&map_name=test17",
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url1, options)
    // .then(res => res.text())
    // .then(res => console.log(res))
    .then(res => res.json())
    .then(res => console.log(res))
}
test71()