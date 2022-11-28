import { onAddGuest } from "./map/eventListeners.js"
import { offsetCalculate } from "./scripts.js"
import { selection } from "./main.js"
import "./lib/jquery.min.js"
import { guest } from "./api/guest.js"
import hiveObject from "./hiveObject.js"

var corrent = 0
var selected_ele
const add_match_list_items = ()=>{
    var guests_data = JSON.parse(document.getElementById('map').getAttribute('guests')) 
    var match_list = []
    var input_str = document.getElementById('name_box_input').value
    var search_str = '^'+input_str
    if(input_str.length != 0){
        var search_reg = new RegExp(search_str)
        for(var corrent of guests_data){
            corrent.name = corrent.last_name+' '+corrent.first_name
            if(search_reg.test(corrent.name)){
                match_list.push(corrent)
            }
        }
    }
    return match_list
}
const add_match_list = (box)=>{
    var seat = box.getAttribute('seat_id')
    var match_drop_down = document.createElement('ul')
    $(match_drop_down).attr('id', 'guestsList')
    for(let corrent of add_match_list_items()){
        corrent.name = corrent.last_name+' '+corrent.first_name
        var match_li = document.createElement('li') 
        $(match_li).html(corrent.name+' <span class="group_name">'+corrent.guest_group+'   |</span>')
        $(match_li).addClass('match_list')
        $(match_li).attr('guest_id', corrent.id)
        $(match_li).attr('guest_name', corrent.name)
        $(match_li).attr('guest_group', corrent.guest_group.replace("_"," "))
        $(match_li).attr('seat', seat)
        match_li.addEventListener('click', (e)=> onAddGuest(e.target))                                       
        $(match_drop_down).append(match_li)
    }
    return match_drop_down
}
const add_name_box_input = (box)=>{
    var guest_name = box.getAttribute('guest_name')
    var input_fild = document.createElement('input')
    input_fild.setAttribute('autocomplete', "off")
    input_fild.setAttribute('id', 'name_box_input')
    input_fild.classList.add('name_box')
    input_fild.value = guest_name
    return input_fild
}
const add_drop_down = ()=>{
    if(document.getElementById('drop_down')) document.getElementById('drop_down').remove()
    if(document.getElementById('name_box_input')) document.getElementById('name_box_input').remove()
    var drop_down = document.createElement('div')
    drop_down.setAttribute('id', 'drop_down')
    drop_down.classList.add('drop_down') 
    drop_down.addEventListener('mouseover', (event)=>{
        drop_down.style.cursor = 'pointer'
        document.querySelectorAll('.drop_down > ul > li').forEach(element => {
            if(element.getAttribute('guest_id') != event.target.getAttribute('guest_id')){
                element.style.backgroundColor = 'rgb(202, 248, 248)'
            }else{
                event.target.style.backgroundColor = '#4f90f275'
            }           
        })
    })  
    return drop_down
}
const onDropMenuArrow = (e)=>{
    document.getElementById('map').setAttribute('selectables', 'guests')
    var len = document.querySelectorAll('.drop_down > ul > li').length -1
    if(e.keyCode == 13){
        onAddGuest(selected_ele)
     }
    if(e.keyCode == 38){
        if(corrent > 0){
            corrent--
            var drop_down = document.getElementById('drop_down')
            var match_drop_down = document.getElementById('guestsList')
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
            var match_drop_down = document.getElementById('guestsList')
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
export default function(event){
    var box = event.target
    if(document.getElementById('map').getAttribute('isZoomed') == 'false'){
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
            corrent = -1
            $('#drop_down').append(add_match_list(box))                               
        })
    }
}