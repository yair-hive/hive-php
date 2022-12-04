import { onSeatName } from "./edit_map/eventListeners.js"
import "./lib/jquery.min.js"
import { respondToVisibility, startMBLoader, stopMBLoader } from "./scripts.js"
import api from './api/api.js'

export function loginForm(){
    var form_cont = document.createElement('div')
    form_cont.classList.add('form_cont')
    var form = document.createElement('form')
    form.setAttribute('id', 'user_form')
    form.innerHTML = '<label for="user_name"> שם משתמש </label><br /><input type="text" name="user_name"><br /><label for="password"> סיסמה </label><br /><input type="text" name="password"><br />'
    var button = document.createElement('div')
    button.classList.add('hive-button')
    button.textContent = 'התחבר'
    button.addEventListener('click', ()=>{api.user.login().then(json => {alert(json.msg); closePopUp()})})
    form.append(button)
    form_cont.append(form)
    return form_cont
}
export const add_map = (map)=>{
    const main_bord = document.getElementById('mainBord')
    const map_container = document.createElement("div")
    map_container.classList.add('map_container')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('map_name', map.map_name)
    map_ele.setAttribute('map_id', map.id)
    map_ele.setAttribute('id', 'map')
    map_ele.setAttribute('selectables', 'cell')
    map_ele.setAttribute('isZoomed', 'false')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell_cont = document.createElement('div')
            var cell = document.createElement('div')
            cell_cont.classList.add(`row-${rowsCounter}`)
            cell_cont.classList.add(`col-${colsCounter}`)
            cell_cont.classList.add('cell_cont')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.setAttribute('row', rowsCounter)
            cell.setAttribute('col', colsCounter)
            cell.classList.add('cell')
            cell.classList.add('selectable')
            cell_cont.append(cell)
            map_ele.appendChild(cell_cont)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    map_container.appendChild(map_ele)
    main_bord.appendChild(map_container)
}
export const add_seats = (seats)=>{
    for(let seat of seats){
        var cell = document.querySelector(`.cell_cont.row-${seat.row_num}.col-${seat.col_num}`)
        var seat_ele = document.createElement('div')
        seat_ele.classList.add(`row-${seat.row_num}`)
        seat_ele.classList.add(`col-${seat.col_num}`)
        seat_ele.setAttribute('row', seat.row_num)
        seat_ele.setAttribute('col', seat.col_num)
        seat_ele.setAttribute('seat_id', seat.id)
        var num_box = document.createElement('div')
        var name_box = document.createElement('div')
        num_box.classList.add('num_box')
        name_box.classList.add('name_box')
        seat_ele.classList.add('seat')
        $(name_box).attr('seat_id', seat.id)
        $(num_box).attr('seat_id', seat.id)
        $(num_box).text(seat.seat_number)
        seat_ele.append(num_box)
        seat_ele.append(name_box)
        name_box.addEventListener('click', onSeatName)
        cell.replaceChildren(seat_ele)
    }
    stopMBLoader()
}
export const add_belong = ()=>{
    startMBLoader()
    var name_boxs =  document.querySelectorAll('.name_box')
    var l = name_boxs.length
    var i = 1
   name_boxs.forEach(element => {
        i++
        var seat_id = element.getAttribute('seat_id')
        api.seat.get_belong(seat_id)
        .then(belong => {
            if(belong[0]) element.setAttribute('guest_id', belong[0].guest)
            else return
        })
        .then(()=>{
            if(i == l){
                stopMBLoader()
            }
        })
    })
}
export const add_guests = (guests)=>{
    startMBLoader()
    var guests_press = JSON.stringify(guests)
    document.getElementById('map').setAttribute('guests', guests_press)
    var name_boxs = document.querySelectorAll('.name_box')
    var l = guests.length
    var i = 1
    if(l == 0){
        stopMBLoader()
    }
    name_boxs.forEach((name_box)=>{
        i++
        var guest_id = name_box.getAttribute('guest_id')
        for(var corrent of guests){
            if(corrent.id == guest_id){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(corrent.name.length > 15) name_box.style.fontSize = '11px';
                corrent.guest_group = corrent.guest_group.replace(" ","_"); 
                name_box.setAttribute('guest_name', corrent.name)
                name_box.setAttribute('guest_group', corrent.guest_group)
                name_box.textContent = corrent.name             
            }
            if(i == l){
                respondToVisibility(name_box, stopMBLoader)
            }
        }
    }) 
}
export const addMBloader = ()=>{
    var loader = document.createElement('div')
    var loaderContainer = document.createElement('div')
    var main_bord = document.getElementById('mainBord')
    var perent = main_bord.getBoundingClientRect()
    $(loaderContainer) .css({
        'position': 'absolute',
        'width': perent.width,
        'height': perent.height, 
        'top': perent.top,
        'left': perent.left,
        'margin': 0,
        'padding': 0,
        'backgroundColor' : 'rgb(67, 167, 167)'
    })
    loader.setAttribute('id', "MBloader")
    loaderContainer.setAttribute('id', "MBloader-container")
    document.body.insertBefore(loader, document.body.children[0])
    document.body.insertBefore(loaderContainer, document.body.children[0])
    loader.style.display = 'none'
    loaderContainer.style.display = 'none'
}
function closePopUp(){
    document.getElementById('blur').style.display = 'none'
}
export function addPopUp(){
    var blur = document.createElement('div')
    var popUp = document.createElement('div')
    var popUpHead = document.createElement('div')
    var popUpBody = document.createElement('div')
    popUpBody.setAttribute('id', 'popUpBody')
    popUpBody.classList.add('popUpBody')
    popUpHead.classList.add('popUpHead')
    popUpHead.setAttribute('id', 'popUpHead')
    popUpHead.addEventListener('click', closePopUp)
    blur.setAttribute('id', 'blur')
    blur.classList.add('blur')
    popUp.setAttribute('id', 'popUp')
    popUp.classList.add('popUp')
    popUp.append(popUpHead)
    popUp.append(popUpBody)
    blur.append(popUp)
    document.body.append(blur)
    blur.style.display = 'none'
}
export function openPopUp(title, msg){
    document.getElementById('popUpBody').innerHTML = ''
    document.getElementById('blur').style.display = 'block'
    document.getElementById('popUpBody').append(msg)
    document.getElementById('popUpHead').textContent = title
}
function hiveSwitchChenge(element, active){
    active = active.replace(' ', '_')
    var childrenLength = element.children.length  -1
    for(let i = 0; i < (childrenLength+1); i++){
        element.children[i].classList.remove('active')
    }
    element.querySelector('#'+active).classList.add('active')
}
function hiveSwitchMove(itemsList, active){
    var length = itemsList.length -1
    var activeIndex = itemsList.indexOf(active.replace(' ', '_'))
    var i
    if(activeIndex == length) i = 0
    else i = activeIndex+1
    return itemsList[i]
}
export function hiveSwitch(options, callback){
    var active = options.active
    var itemsList = []
    var element = document.getElementById(options.element_id)
    var childrenLength = element.children.length  -1
    element.children[0].classList.add('hive-switch-l')
    element.children[childrenLength].classList.add('hive-switch-r')
    for(let i = 1; i < childrenLength; i++){
        element.children[i].classList.add('hive-switch-m')
    }
    element.querySelector('#'+active).classList.add('active')
    for(let i = 0; i < (childrenLength+1); i++){
        var corrent = element.children[i]
        itemsList.push(corrent.getAttribute('id'))
        corrent.classList.add('hive-button')
        corrent.addEventListener('click', (e)=>{
            active = e.target.getAttribute('id').replace('_', ' ')
            hiveSwitchChenge(element, active)
            callback(active)
        })
    }
    document.addEventListener('keydown', (e)=>{
        for(let key of options.keys){
            if(e.key == key){
                active = hiveSwitchMove(itemsList, active).replace('_', ' ')
                hiveSwitchChenge(element, active)
                callback(active)
            }
        }
    })
}