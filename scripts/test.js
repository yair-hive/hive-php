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
            if(seat.children[1]){ 
                seat.children[1].innerHTML = score
                seat.setAttribute('col_score', score)
            }
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
                seat.setAttribute('row_score', score)
            }
        })
    }
}
var mneu = document.getElementById('mneu')
var button = document.createElement('div')
button.classList.add('hive-button')
button.textContent = 'test'
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
        console.log(names)
        for(let name of names){
            api.seat_groups.get_seats(map_id, name)
            .then(seats => {
                var seats_ele = []
                var seat_ele, col
                var cols = []
                console.log(seats)
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
                var score
                var mid = Math.floor((cols[0]+cols[cols.length -1])/2);
                var as = ((cols.length /2) %1) != 0
                if(as) score = Math.floor(cols.length /2)
                else score = Math.floor(cols.length /2) -1
                score = score * score
                for(let col of cols){
                    document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
                        var seat = cell_cont.children[0]
                        if(seat.children[1]){ 
                            seat.children[1].append(' & '+score)
                            seat.setAttribute('pass_score', score)
                        }
                    }) 
                    if(col < mid) score = score - 2
                    if(as && col == mid) score = score + 2
                    if(col > mid) score = score + 2 
                }
            })
        }
    })
}
var button3 = document.createElement('div')
button3.classList.add('hive-button')
button3.textContent = 'test3'
button3.addEventListener('click', test3)

function test4(){
    document.querySelectorAll('.seat').forEach(seat => {
        var col_score = seat.getAttribute('col_score')
        var row_score = seat.getAttribute('row_score')
        var pass_score = seat.getAttribute('pass_score')
        // console.log(col_score)
        // console.log(row_score)
        // console.log(pass_score)
        // console.log(seat)
        col_score = Number(col_score)
        row_score = Number(row_score)
        pass_score = Number(pass_score)
        var total_score = col_score + row_score + pass_score
        seat.children[1].innerHTML = total_score
    })
}
var button4 = document.createElement('div')
button4.classList.add('hive-button')
button4.textContent = 'test4'
button4.addEventListener('click', test4)

function addOb(){
    var selected = selection.getSelection()
    var cols = []
    var rows = []
    for(let cell of selected){
        var col = cell.parentNode.getAttribute('col')
        var row = cell.parentNode.getAttribute('row')
        col = Number(col)
        row = Number(row)
        if(cols.indexOf(col) === -1){
            cols.push(col)
        }
        if(rows.indexOf(row) === -1){
            rows.push(row)
        }
    }
    cols.sort(function(a, b) { return a - b; }); 
    rows.sort(function(a, b) { return a - b; }); 
    var name = prompt('הוסף אלמנט')
    var from_row = rows[0]
    var from_col = cols[0]
    var to_row = rows[rows.length -1]
    var to_col = cols[cols.length -1]
    var map = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.add_ob(name, from_row, from_col, to_row, to_col, map)
    console.log(cols)
    console.log(rows)
}
var addObButton = document.createElement('div')
addObButton.classList.add('hive-button')
addObButton.textContent = 'test4'
addObButton.addEventListener('click', addOb)

function showOb(){
    var map = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_ob(map)
    .then(res => {
        console.log(res)
        for(let ob of res){
            var row, col
            for(row = ob.from_row; row <= ob.to_row; row++){
                for(col = ob.from_col; col <= ob.to_col; col++){
                    var cell = document.querySelector('.cell_cont[row="'+row+'"][col="'+col+'"]')
                    cell.remove()
                }
            }
            row++
            var next_cell = document.querySelector('.cell_cont[row="'+row+'"][col="'+col+'"]')
            var to_col = Number(ob.to_col) + 1
            var to_row = Number(ob.to_row) + 1
            var ob_ele = document.createElement('div')
            ob_ele.style.gridColumnStart = ob.from_col
            ob_ele.style.gridRowStart = ob.from_row
            ob_ele.style.gridColumnEnd = to_col.toString()
            ob_ele.style.gridRowEnd = to_row.toString()
            ob_ele.style.backgroundColor = 'rgb(0, 0, 0, 0)'
            document.getElementById('map').insertBefore(ob_ele, next_cell)
        }
    })
}
var showObButton = document.createElement('div')
showObButton.classList.add('hive-button')
showObButton.textContent = 'show'
showObButton.addEventListener('click', showOb)
// mneu.append(button)
// mneu.append(button2)
// mneu.append(button3)
// mneu.append(button4)
mneu.append(addObButton)
mneu.append(showObButton)


