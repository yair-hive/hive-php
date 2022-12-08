import api from "./api/api.js"
import { selection } from "./edit_map/eventListeners.js"
import hiveSwitch from "./hiveSwitch.js"

function hiveButton(name, callback){
    var button = document.createElement('div')
    button.classList.add('hive-button')
    button.textContent = name
    button.addEventListener('click', callback)
    return button
}

// function add_edit_switch(){
//     var mneu = document.getElementById('mneu')
//     var edit_ele = document.createElement('div')
//     edit_ele.setAttribute('id', 'edit')
//     edit_ele.textContent = 'edit'
//     var no_edit_ele = document.createElement('div')
//     no_edit_ele.setAttribute('id', 'no_edit')
//     no_edit_ele.textContent = 'no'
//     var edit_switch = document.createElement('div') 
//     edit_switch.classList.add('hive-switch')
//     edit_switch.append(edit_ele)
//     edit_switch.append(no_edit_ele)
//     mneu.append(edit_switch)
//     var hiveSwitchOptions = {
//         element_id: 'selecteblsSwitch', 
//         active: 'no_edit', 
//         keys: ['q', '/']
//     } 
//     hiveSwitch(hiveSwitchOptions, (active)=>{
//         var edit_eles = document.getElementById('edit_eles')
//         switch (active) {
//             case 'edit':
//                 edit_eles.style.display = 'block'
//                 break;
//             case 'no_edit':
//                 edit_eles.style.display = 'none'
//                 break;
//         }
//     })
// }
// add_edit_switch()

function proximity_score(){
    return new Promise((resolve, reject) => {
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
        resolve()
    })
}

function add_col_group_score(){
    return new Promise((resolve, reject) => {
        var names = []
        var seats_array = []
        var map_id = document.getElementById('map').getAttribute('map_id')
        api.seat_groups.get_groups_cols(map_id)
        .then(res => {
            for(let group_name of res){
                if(names.indexOf(group_name.group_name) === -1){
                    names.push(group_name.group_name)
                }
            }
            for(let i = 0; i < names.length; i++){
                var name = names[i]
                api.seat_groups.get_seats_cols(map_id, name)
                .then(seats => {
                    var seats_ele = []
                    var seat_ele, col
                    var cols = []
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
                    if(i == (names.length -1)) {
                        resolve()
                    }
                })
            }
        })
    })
}

function show_total_score(){
    proximity_score()
    .then(add_col_group_score)
    .then(()=>{
        document.querySelectorAll('.seat').forEach(seat => {
            var col_score = Number(seat.getAttribute('col_score'))
            var row_score = Number(seat.getAttribute('row_score'))
            var pass_score = Number(seat.getAttribute('pass_score'))
            var total_score = col_score + row_score + pass_score
            seat.children[1].innerHTML = total_score
        })
    })
}

function create_col_group(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם טור')
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_col(seat_id, group_name, map_id)
    })
}

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
            ob_ele.classList.add('ob_ele')
            var ob_name_ele = document.createElement('div')
            ob_name_ele.textContent = ob.ob_name
            ob_ele.append(ob_name_ele)
            ob_ele.style.gridColumnStart = ob.from_col
            ob_ele.style.gridRowStart = ob.from_row
            ob_ele.style.gridColumnEnd = to_col.toString()
            ob_ele.style.gridRowEnd = to_row.toString()
            ob_ele.style.backgroundColor = 'rgb(0, 0, 0, 0)'
            document.getElementById('map').insertBefore(ob_ele, next_cell)
            var per = ob_ele.getBoundingClientRect()
            if(per.height > per.width) ob_name_ele.style.transform = 'rotate(90deg)';
        }
    })
}

function addTag(){
    var selected = selection.getSelection()
    var group_name = prompt('הכנס שם תווית')
    var map_id = document.getElementById('map').getAttribute('map_id')
    selected.forEach(seat => {
        var seat_id = seat.getAttribute('seat_id')
        api.seat_groups.add_tag(seat_id, group_name, map_id)
    })
}

function getTag(){
    var names = []
    var map_id = document.getElementById('map').getAttribute('map_id')
    api.seat_groups.get_groups_tags(map_id)
    .then(res => {
        for(let group_name of res){
            if(names.indexOf(group_name.group_name) === -1){
                names.push(group_name.group_name)
            }
        }
        for(let name of names){
            api.seat_groups.get_seats_tags(map_id, name)
            .then(seats => {
                seats = seats.map(seat => seat.seat)
                for(let seat of seats){
                    var seat_ele = document.querySelector('.seat[seat_id = "'+seat+'"]')
                    // console.log(seat_ele)
                    seat_ele.children[1].textContent = name
                }
            })
        }
    })
}

var mneu = document.getElementById('mneu')

var edit_eles = document.createElement('div')
edit_eles.setAttribute('id', 'edit_eles')
edit_eles.append(hiveButton('סיכום ניקוד', show_total_score))
edit_eles.append(hiveButton('הוסף טור', create_col_group))
edit_eles.append(hiveButton('הוסף אלמנטים', addOb))
edit_eles.append(hiveButton('הצג אלמנטים', showOb))
edit_eles.append(hiveButton('הוסף תגיות', addTag))
edit_eles.append(hiveButton('הצג תגיות', getTag))
// edit_eles.style.display = 'none'
mneu.append(edit_eles)
