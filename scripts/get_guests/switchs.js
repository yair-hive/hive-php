import api from "../api/api.js"
import HiveSwitch from "../hiveElements/HiveSwitch.js"

var belongSwitchOptions = {
    element_id: 'belongSwitch', 
    active: 'ShowAll', 
    keys: ['x', 'ס']
} 
var groupsSwitchOptions = {
    element_id: 'groupsSwitch', 
    active: 'all', 
    keys: ['q', '/']
} 
var tagsSwitchOptions = {
    element_id: 'tagsSwitch', 
    active: 'all', 
    keys: ['b', 'נ']
}

function addGroupsSwitchElement(){
    return new Promise((resolve, reject) => {
        const table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var group 
        api.guest.get_all_groups(map_id)
        .then((groups)=>{
            var groupsSwitch = document.getElementById('groupsSwitch')
            for(let i = 0; i < groups.length; i++){
                group = groups[i]
                var div = document.createElement('div')
                div.textContent = group.group_name
                group.group_name = group.group_name.replace(' ', '_')
                div.setAttribute('id', group.group_name)                        
                groupsSwitch.append(div)
                if(i === (groups.length -1)) resolve()
            }
        })
    })
}
function addTagsSwitchElement(){
    return new Promise((resolve, reject) => {
        const table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var tag
        api.seat_groups.get_all_tags(map_id)
        .then((tags)=>{
            var tagsSwitch = document.getElementById('tagsSwitch')
            for(let i = 0; i < tags.length; i++){
                tag = tags[i]
                var div = document.createElement('div')
                div.textContent = tag.tag_name
                tag.group_tag = tag.tag_name.replace(' ', '_')
                div.setAttribute('id', tag.tag_name)                        
                tagsSwitch.append(div)
                if(i === (tags.length -1)) resolve()
            }
        })
    })
}

function onShowOnlyWthBelong(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e =>{
        if(e.parentNode.getAttribute('status_group') == 'open'){
            e.parentNode.style.display = 'none'
            e.parentNode.setAttribute('status_belong', 'close')
            e.classList.add('no_show')
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
}
function onShowOnlyWthoutBelong(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            e.parentNode.style.display = 'none'
            e.parentNode.setAttribute('status_belong', 'close')
            e.classList.add('no_show')
        }
    })
}
function onShowAll(){
    document.querySelectorAll('td[seat_id = "none"]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
    document.querySelectorAll('td[belong]').forEach(e => {
        if(e.parentNode.getAttribute('status_group') == 'open'){
            if(e.getAttribute('show') == 'true'){
                e.parentNode.style.display = 'table-row';
                e.parentNode.style.verticalAlign = 'inherit';
                e.parentNode.setAttribute('status_belong', 'open')
            }
        }
    })
}
function onBelongSwitch(active){
    switch(active){
        case 'ShowOnlyWthBelong':
            onShowOnlyWthBelong()
            break;
        case 'ShowOnlyWthoutBelong':
            onShowOnlyWthoutBelong()
            break;
        case 'ShowAll':
            onShowAll()
            break;
    }
}
function onGroupsSwitch(active){
    var group = active
    var table = document.getElementById('names_table')
    if(group == 'all'){
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                rows[i].style.display = 'table-row'; 
                rows[i].style.verticalAlign = 'inherit';
                rows[i].setAttribute('status_group', 'open')
            }
        }
    }else{
        var i
        var rows = table.rows
        var l = rows.length 
        for(i = 1; i < l; i++){
            if(rows[i].getAttribute('status_belong') == 'open'){
                if(rows[i].getAttribute('group') != group){
                    rows[i].style.display = 'none'
                    rows[i].setAttribute('status_group', 'close')
                    rows[i].childNodes[0].classList.add('no_show')
                }
                else{
                    rows[i].childNodes[0].classList.remove('no_show')
                    rows[i].style.display = 'table-row'; 
                    rows[i].style.verticalAlign = 'inherit';
                    rows[i].setAttribute('status_group', 'open')
                }
            }
        }
    }
}
function onTagsSwitch(active){
    console.log(active)
}

export function addBelongSwitch(){
    HiveSwitch(belongSwitchOptions, onBelongSwitch)
}
export function addGroupsSwitch(){
    return addGroupsSwitchElement()
    .then(()=>{HiveSwitch(groupsSwitchOptions, onGroupsSwitch)})
}
export function addTagsSwitch(){
    return addTagsSwitchElement()
    .then(()=>{HiveSwitch(tagsSwitchOptions, onTagsSwitch)})
}