import api from "./api/api.js"
import { selection } from "./edit_map/eventListeners.js"

function test(){
    var score, map, map_rows, map_cols, as_decimal, seat, cols_middle, i
    map = document.getElementById('map')
    map_rows = map.getAttribute('rows')
    map_cols = map.getAttribute('cols')
    cols_middle = Math.round(map_cols / 2)
    as_decimal = (map_cols / 2) % 1 != 0
    i = 0
    for(let col = 1; col <= map_cols; col++){
        document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            if(seat.children[1]) seat.children[1].append(score)
        })
        if(as_decimal){
            if(col > cols_middle) {
                i++; 
                score = Math.abs(i);
                score = score * 2;
            }
            if(col < cols_middle) {
                i--; 
                score = Math.abs(i);
                score = score * 2
            }
            if(col == cols_middle) {
                i++; 
                score = Math.abs(i);
                score = score * 2
            }
        }else{
            if(col > cols_middle) {
                i++; 
                score = Math.abs(i);
                score = score * 2
            }
            if(col < cols_middle) {
                i--; 
                score = Math.abs(i);
                score = score * 2
            }
        }
    }
    i = 0
    for(let row = map_rows; row != 0 ; row--){
        i++
        document.querySelectorAll('.cell_cont[row="'+row+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            score = i
            if(seat.children[1]) {
                var p = seat.children[1].innerHTML 
                seat.children[1].innerHTML  = Number(p) + score
            }
        })

    }
}
var mneu = document.getElementById('mneu')
var button = document.createElement('div')
button.classList.add('hive-button')
button.textContent = 'test'
mneu.append(button)
button.addEventListener('click', test)

function test2(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם קבוצה')
    api.seat_groups.get_id(group_name)
    .then(id => {
        selected.forEach(seat => {
            var seat_id = seat.getAttribute('seat_id')
            api.seat_groups.add_belong(seat_id, id)
        })
    })
}
var button2 = document.createElement('div')
button2.classList.add('hive-button')
button2.textContent = 'test2'
mneu.append(button2)
button2.addEventListener('click', test2)
function test3(){
    var group_name = prompt('הכנס שם קבוצה')
    var score = prompt('הכנס ניקוד')
    api.seat_groups.create(group_name, score)
}
var button3 = document.createElement('div')
button3.classList.add('hive-button')
button3.textContent = 'הוסף קבוצת כיסאות'
mneu.append(button3)
button3.addEventListener('click', test3)