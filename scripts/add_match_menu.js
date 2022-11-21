import { onClick_match_list_item } from "./eventListeners.js"
import { offsetCalculate } from "./scripts.js"
import { selection } from "./main.js"
import "./lib/jquery.min.js"
import { add_guest, update_guest } from "./api/api.js"

var corrent = 0
var selected_ele
const add_match_list_items = (guests_list)=>{
    var match_list = []
    var input_str = document.getElementById('name_box_input').value
    var search_str = '^'+input_str
    if(input_str.length != 0){
        var search_reg = new RegExp(search_str)
        for(var corrent of guests_list){
            corrent.name = corrent.last_name+' '+corrent.first_name
            if(search_reg.test(corrent.name)){
                match_list.push(corrent)
            }
        }
    }
    return match_list
}
const add_match_list = (guests_list, seat)=>{
    var match_drop_down = document.createElement('ul')
    $(match_drop_down).attr('id', 'match_drop_down')
    for(let corrent of add_match_list_items(guests_list)){
        corrent.name = corrent.last_name+' '+corrent.first_name
        var match_li = document.createElement('li') 
        $(match_li).html(corrent.name+' <span class="group_name">'+corrent.guest_group+'   |</span>')
        $(match_li).addClass('match_list')
        $(match_li).attr('guest_id', corrent.id)
        $(match_li).attr('guest_name', corrent.name)
        $(match_li).attr('guest_group', corrent.guest_group.replace("_"," "))
        $(match_li).attr('seat', seat)
        match_li.addEventListener('click', onClick_match_list_item)                                       
        $(match_drop_down).append(match_li)
    }
    return match_drop_down
}
const add_name_box_input = (box)=>{
    var input_fild = document.createElement('input')
    input_fild.style.border = "none";
    input_fild.setAttribute('autocomplete', "off")
    $(input_fild).attr('id', 'name_box_input')
    $(input_fild).val($(box).attr('guest_name'))
    $(input_fild).addClass('name_box')
    return input_fild
}
const add_drop_down = ()=>{
    if(document.getElementById('drop_down')) document.getElementById('drop_down').remove()
    if(document.getElementById('name_box_input')) document.getElementById('name_box_input').remove()
    var drop_down = document.createElement('div')
    $(drop_down).attr('id', 'drop_down')
    $(drop_down).addClass('drop_down')   
    return drop_down
}
const addGuest = (ele)=>{
    if(ele.getAttribute('guest_id')){
        var map = document.getElementById('map').getAttribute('map_id')
        var guest_id = ele.getAttribute('guest_id')
        var seat_id = ele.getAttribute('seat')
        var name_box = document.querySelector(`.name_box[seat_id="${seat_id}"]`)
        var guest = document.querySelector(`.match_list[guest_id="${guest_id}"]`)
        var guest_name = guest.getAttribute('guest_name')
        var guest_group = guest.getAttribute('guest_group')   
        document.getElementById('drop_down').remove()
        document.getElementById('name_box_input').remove()
        add_guest(guest_id, seat_id, map)
        .then((res)=>{
            if(res.msg === 'belong'){
                if(confirm('המשתמש כבר משובץ האם אתה רוצה לשבץ מחדש?')){
                    update_guest(guest_id, seat_id, map)
                    .then(()=>{
                        var other_seat = document.querySelector(`.name_box[guest_name="${guest_name}"]`)
                        if(other_seat) {
                            other_seat.removeAttribute('guest_group')
                            other_seat.removeAttribute('guest_name')
                            other_seat.textContent = ''
                        }
                        name_box.setAttribute('guest_name', guest_name)
                        name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                        name_box.textContent = guest_name 
                    })
                }
            }else{
                name_box.setAttribute('guest_name', guest_name)
                name_box.setAttribute('guest_group', guest_group.replace(" ","_"))
                name_box.textContent = guest_name 
            }
        })
    }
}
const onDropMenuArrow = (e)=>{
    var len = document.querySelectorAll('.drop_down > ul > li').length -1
    if(e.keyCode == 13){
        addGuest(selected_ele)
     }
    if(e.keyCode == 38){
        if(corrent > 0){
            corrent--
            var drop_down = document.getElementById('drop_down')
            var match_drop_down = document.getElementById('match_drop_down')
            var corrent_ele = match_drop_down.childNodes[corrent] 
            selected_ele = corrent_ele
            document.querySelectorAll('.drop_down > ul > li').forEach(e => e.style.backgroundColor = 'rgb(202, 248, 248)')
            corrent_ele.style.backgroundColor = '#4f90f275'
            var list = drop_down.getBoundingClientRect()
            var corrent_ele_size = corrent_ele.getBoundingClientRect()
            var list_b = list.top + (corrent_ele_size.height + 15)
            if(corrent-1 >= 0){
                var next_ele = match_drop_down.childNodes[corrent - 1] 
                var next_ele_height = next_ele.getBoundingClientRect().height + 1
                if(corrent_ele_size.bottom < list_b){              
                    drop_down.scrollTop = drop_down.scrollTop-next_ele_height 
                }
            }
        }
    }
    if(e.keyCode == 40){
        if(corrent < len){
            corrent++
            var drop_down = document.getElementById('drop_down')
            var match_drop_down = document.getElementById('match_drop_down')
            var corrent_ele = match_drop_down.childNodes[corrent]
            selected_ele = corrent_ele          
            document.querySelectorAll('.drop_down > ul > li').forEach(e => e.style.backgroundColor = 'rgb(202, 248, 248)')
            corrent_ele.style.backgroundColor = '#4f90f275'
            var list = drop_down.getBoundingClientRect()
            var corrent_ele_size = corrent_ele.getBoundingClientRect()
            var list_b = list.bottom - (corrent_ele_size.height + 15)
            if(corrent+1 <= len){
                var next_ele = match_drop_down.childNodes[corrent + 1] 
                var next_ele_height = next_ele.getBoundingClientRect().height + 1
                if(corrent_ele_size.top > list_b){           
                    drop_down.scrollTop = drop_down.scrollTop+next_ele_height 
                }
            }
        }
    }
}
export default function(guests_list, box){
    selection.clearSelection()
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
    $('#mainBord').append(add_drop_down())
    $('#mainBord').append(add_name_box_input(box))         
    offsetCalculate(box);
    window.addEventListener('resize', ()=> offsetCalculate(box))
    document.getElementById('mainBord').addEventListener('scroll', ()=> offsetCalculate(box))
    $('#name_box_input').focus()
    $('#name_box_input').on('input', function(){
        document.removeEventListener('keydown', onDropMenuArrow)
        document.addEventListener('keydown', onDropMenuArrow)
        $('#drop_down').text(' ')
        var seat = box.getAttribute('seat_id')
        corrent = -1
        $('#drop_down').append(add_match_list(guests_list, seat))                               
    })
}