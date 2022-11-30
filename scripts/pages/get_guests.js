import { add_guests_table } from "../elements.js"
import { onShowAll, onShowOnlyWthBelong, onShowOnlyWthoutBelong } from "../eventListeners.js"
import { sortTable, sortTableNumber, startMBLoader } from "../scripts.js"
import "../lib/jquery.min.js"
import "../lib/jquery.table2excel.min.js"
startMBLoader()
const parsedUrl = new URL(window.location.href)
var map_name = parsedUrl.searchParams.get("map_name")
var go_back = document.createElement('div')
go_back.classList.add('hive-button')
go_back.textContent = 'חזור למפה'
go_back.onclick = ()=>{window.location.replace('http://localhost/hive-php/html/edit_map.html?map_name='+map_name)}
document.getElementById('mneu').append(go_back)
var table = document.getElementById('names_table')
document.getElementById('ShowOnlyWthBelong').addEventListener('click', onShowOnlyWthBelong) 
document.getElementById("ShowOnlyWthoutBelong").addEventListener('click', onShowOnlyWthoutBelong)
document.getElementById("ShowAll").addEventListener('click', onShowAll)        
document.getElementById('export').addEventListener('click', ()=>{
    var table = document.getElementById('names_table').cloneNode(true)
    var rows = table.rows
    for(let row of rows){
        row.childNodes[4].remove()
    }
    table.querySelectorAll('.no_show').forEach(e => e.parentNode.remove())
    var i = 0
    for(let row of rows){
        if(i != 0){
            var td_first = row.childNodes[1]
            var input = td_first.childNodes[0]
            var value = input.value
            td_first.textContent = value
            var td_last = row.childNodes[2]
            var input = td_last.childNodes[0]
            value = input.value
            td_last.textContent = value
            var td_group = row.childNodes[3]
            var input = td_group.childNodes[0]
            value = input.value
            td_group.textContent = value
        }
        i++
    }
    $(table).table2excel({
        filename: "list.xls"
    });
})
add_guests_table(map_name, table).then(()=>{
    document.getElementById("status").addEventListener('click', ()=>{sortTableNumber(0)})
    document.getElementById("first").addEventListener('click', ()=>{sortTable(1)}) 
    document.getElementById("last").addEventListener('click', ()=>{sortTable(2)})
    document.getElementById("group").addEventListener('click', ()=>{sortTable(3)})
    document.getElementById("score").addEventListener('click', ()=>{sortTableNumber(4)})
    document.addEventListener('keydown', (e)=>{
        if(e.keyCode == 13){
            document.activeElement.blur()
        }
    })
})
