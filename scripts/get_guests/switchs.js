import api from "../api/api.js"
import HiveSwitch from "../hiveElements/HiveSwitch.js"

var belongSwitchOptions = {
    element_id: 'belongSwitch', 
    active: 'all', 
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
    return new Promise((resolve) => {
        const table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var group 
        api.guest.get_all_groups(map_id)
        .then((groups)=>{
            if(groups.length == 0) resolve()
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
    return new Promise((resolve) => {
        const table = document.getElementById('names_table') 
        var map_id = table.getAttribute('map_id')
        var tag
        api.seat_groups.get_all_tags(map_id)
        .then((tags)=>{
            if(tags.length == 0) resolve()
            var tagsSwitch = document.getElementById('tagsSwitch')
            for(let i = 0; i < tags.length; i++){
                tag = tags[i]
                var div = document.createElement('div')
                div.textContent = tag.tag_name
                tag.tag_name = tag.tag_name.replace(' ', '_')
                div.setAttribute('id', tag.tag_name)                        
                tagsSwitch.append(div)
                if(i === (tags.length -1)) resolve()
            }
        })
    })
}

function onSwitch(){
    const table = document.getElementById('names_table') 
    var belong_switch = table.getAttribute('belong_switch')
    var groups_switch = table.getAttribute('groups_switch')
    var tags_switch = table.getAttribute('tags_switch')
    var trs = document.querySelectorAll('tr')
    for(let i = 1; i < trs.length; i++){
        var corrent = trs[i]
        corrent.classList.remove('no_show')
        var corrent_group = corrent.getAttribute('guest_group')
        var corrent_belong = corrent.getAttribute('belong')
        if(corrent_group != groups_switch && groups_switch != 'all') corrent.classList.add('no_show')
        if(corrent_belong != belong_switch && belong_switch != 'all') corrent.classList.add('no_show')
        var corrent_tags = corrent.getAttribute('tags_list')
        if(corrent_tags){
            corrent_tags = JSON.parse(corrent_tags)
            var as_tag = corrent_tags.indexOf(tags_switch) == -1
            if(as_tag && tags_switch != 'all') corrent.classList.add('no_show')
        }else
        {
            if(tags_switch != 'all') corrent.classList.add('no_show')
        }
    }
}

function onBelongSwitch(active){
    var table = document.getElementById('names_table')
    table.setAttribute('belong_switch', active)
    onSwitch()
}
function onGroupsSwitch(active){
    var table = document.getElementById('names_table')
    table.setAttribute('groups_switch', active)
    onSwitch()
}
function onTagsSwitch(active){
    const table = document.getElementById('names_table') 
    table.setAttribute('tags_switch', active)
    onSwitch()
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