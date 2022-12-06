import api from "./api/api.js"
import { selection } from "./edit_map/eventListeners.js"

function test(){
    var score, map, map_rows, map_cols, seat, cols_middle, i, col_num, row_num
    map = document.getElementById('map')
    map_rows = map.getAttribute('rows')
    map_cols = map.getAttribute('cols')
    cols_middle = Math.round(map_cols / 2)
    var cols = []
    var rows = []
    document.querySelectorAll('.cell_cont > .seat').forEach(col => {
        col_num = col.parentNode.getAttribute('col')
        if(cols.indexOf(col_num) === -1){
            cols.push(col_num)
        }
    })
    document.querySelectorAll('.cell_cont > .seat').forEach(col => {
        row_num = col.parentNode.getAttribute('row')
        row_num = Number(row_num)
        if(rows.indexOf(row_num) === -1){
            rows.push(row_num)
        }
    })
    i = 0
    for(let col of cols){
        if(col < cols_middle) {
            i++; 
            score = Math.abs(i);
        }
        if(col > cols_middle) {
            i--; 
            score = Math.abs(i);

        }
        if(col == cols_middle) {
            i++; 
            score = Math.abs(i); 
        }
        document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            if(seat.children[1]) seat.children[1].innerHTML = score
        })       
    }
    i = 0
    rows.sort(function(a, b) { return a - b; });
    rows.reverse();
    for(let row of rows){
        i++
        document.querySelectorAll('.cell_cont[row="'+row+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            score = i
            if(seat.children[1]) {
                seat.children[1].append(" & "+score)
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
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_belong(seat_id, group_name, map_id)
    })
}
var button2 = document.createElement('div')
button2.classList.add('hive-button')
button2.textContent = 'test2'
mneu.append(button2)
button2.addEventListener('click', test2)

function test3(){
    var names = []
    var seats_array = []
    var map_id = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_groups(map_id)
    .then(res => {
        for(let group_name of res){
            if(names.indexOf(group_name.group_name) === -1){
                names.push(group_name.group_name)
            }
        }
        for(let name of names){
            var seats_ele = []
            var seat_ele, col
            var cols = []
            api.seat_groups.get_seats(map_id, name)
            .then(seats => {
                seats = seats.map(seat => seat.seat)
                for(let seat of seats){
                    seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                    col = seat_ele.parentNode.getAttribute('col')
                    col = Number(col)
                    if(cols.indexOf(col) === -1){
                        cols.push(col)
                    }
                    seats_ele.push(seat_ele)
                }
                seats_array[name] = seats_ele
                cols.sort(function(a, b) { return a - b; });               
                function middleInBetweenNumnbers(min, max) {
                    return Math.floor((max+min)/2);
                }
                var score
                var mid = middleInBetweenNumnbers(cols[0], cols[cols.length -1])
                var as = ((cols.length /2) %1) != 0
                if(as) score = Math.floor(cols.length /2)
                else score = Math.floor(cols.length /2) -1
                console.log(mid)
                for(let col of cols){
                    document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
                        var seat = cell_cont.children[0]
                        if(seat.children[1]) seat.children[1].append(" | "+score)
                    }) 
                    if(col < mid) score --
                    if(as){
                        if(col == mid) score ++
                    }
                    if(col > mid) score ++ 
                }
            })
        }
        // console.log(seats_array)
    })
}
var button3 = document.createElement('div')
button3.classList.add('hive-button')
button3.textContent = 'test3'
mneu.append(button3)
button3.addEventListener('click', test3)