import { onClick_match_list_item } from "./eventListeners.js"
import { offsetCalculate } from "./scripts.js"
import { selection } from "./main.js"

const add_match_list_items = (guests_list)=>{
    var match_list = []
    var input_str = document.getElementById('name_box_input').value
    var search_str = '^'+input_str
    if(input_str.length != 0){
        var search_reg = new RegExp(search_str)
        for(var corrent of guests_list){
            corrent.name = corrent.first_name+' '+corrent.last_name
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
        corrent.name = corrent.first_name+' '+corrent.last_name
        var match_li = document.createElement('li') 
        $(match_li).html(corrent.name+' <span class="group_name">'+corrent.group+'   |</span>')
        $(match_li).addClass('match_list')
        $(match_li).attr('guest_id', corrent.id)
        $(match_li).attr('guest_name', corrent.name)
        $(match_li).attr('guest_group', corrent.group.replace("_"," "))
        $(match_li).attr('seat', seat)
        match_li.addEventListener('click', onClick_match_list_item)                                       
        $(match_drop_down).append(match_li)
    }
    return match_drop_down
}
const add_name_box_input = (box)=>{
    var input_fild = document.createElement('input')
    input_fild.style.border = "none";
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
        $('#drop_down').text(' ')
        var seat = box.getAttribute('seat_id')
        $('#drop_down').append(add_match_list(guests_list, seat))                               
    })
}