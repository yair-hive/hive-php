import { add_guests_table } from "./elements.js"
import { onShowAll, onShowOnlyWthBelong, onShowOnlyWthoutBelong } from "./eventListeners.js"
import { sortTable } from "./scripts.js"
import "./lib/jquery.min.js"
import "./lib/jquery.table2excel.min.js"
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
    $(table).table2excel({
        filename: "list.xls"
    });
})
add_guests_table(map_name, table).then(()=>{
    document.getElementById('loader').style.display = 'none'
    document.getElementById('loader-container').style.display = 'none' 
})
document.getElementById("first").addEventListener('click', ()=>{sortTable(1)}) 
document.getElementById("last").addEventListener('click', ()=>{sortTable(2)})
document.getElementById("group").addEventListener('click', ()=>{sortTable(3)})