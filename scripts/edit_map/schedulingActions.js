import api from "../api/api.js"
import { loader } from "./switchs.js"

export function proximity_score(){
    return new Promise((resolve) => {
        var score, map, map_rows, map_cols, seat, cols_middle, i, col_num, row_num, cols_middle2
        map = document.getElementById('map')
        map_rows = map.getAttribute('rows')
        map_cols = map.getAttribute('cols')
        map_cols = Number(map_cols)
        cols_middle = Math.round(map_cols / 2)
        cols_middle2 = Math.floor(map_cols / 2)
        var cols = []
        var rows = []
        document.querySelectorAll('.cell_cont > .seat').forEach(col => {
            col_num = col.parentNode.getAttribute('col')
            col_num = Number(col_num)
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
        cols.sort(function(a, b) { return a - b; });
        cols.reverse()
        i = 0
        for(let col of cols){
            if(cols_middle == cols_middle2){
                if(col != (cols_middle + 1)){
                    if(col < cols_middle) {
                        i++; 
                        score = Math.abs(i);
                    }
                    if(col > cols_middle) {
                        i--; 
                        score = Math.abs(i);    
                    }
                }
                if(col == cols_middle) {
                    i++; 
                    score = Math.abs(i); 
                }
            }else{
                if(col < cols_middle) {
                    i--;
                    score = i
                    // score = Math.abs(i);
                }
                if(col > cols_middle) {
                    i++;
                    score = i
                    // score = Math.abs(i);    
                }
                if(col == cols_middle) {
                    i++; 
                    score = Math.abs(i); 
                }
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
export function add_col_group_score(){
    return new Promise((resolve) => {
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
                    var score = 20
                    var mid = Math.floor((cols[0]+cols[cols.length -1])/2);
                    var as = ((cols.length /2) %1) != 0
                    // if(as) score = Math.floor(cols.length /2)
                    // else score = Math.floor(cols.length /2) -1
                    // score = score * score
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
export function scheduling(){
    const map = document.getElementById('map')
    const guests_list = JSON.parse(map.getAttribute('guests'))
    const map_tags = JSON.parse(map.getAttribute('tags'))
    const seats_list = document.querySelectorAll('.seat')
    function getRandomNumber(max) {
        let min = 0
        let step1 = max - min + 1;
        let step2 = Math.random() * step1;
        let result = Math.floor(step2) + min;
        return result;
    }
    function add_m(arr){
        return new Promise(async (resolve) => {
            console.log(arr)
            var map_id = document.getElementById('map').getAttribute('map_id')
            await api.guest.update_belong_multiple(map_id, arr)
            resolve()
        })
    }
    function get_seats_score(){
        var seats_score = []
        for(let i = 0; i < seats_list.length; i++){
            var seat = seats_list[i]
            var col_score = Number(seat.getAttribute('col_score'))
            var row_score = Number(seat.getAttribute('row_score'))
            var pass_score = Number(seat.getAttribute('pass_score'))
            var total_score = col_score + row_score + pass_score
            seat.setAttribute('total_score', total_score)
            if(seats_score.indexOf(total_score) === -1){
                seats_score.push(total_score)
            }
        }
        seats_score.sort(function(a, b) { return a - b; });
        seats_score.reverse()
        return seats_score
    }
    function get_guests_score(){
        var guests_score = []
        for(let i = 0; i < guests_list.length; i++){
            var guest = guests_list[i]
            if(guests_score.indexOf(Number(guest.score)) === -1){
                guests_score.push(Number(guest.score))
            }
        }
        guests_score.sort(function(a, b) { return a - b; });
        guests_score.reverse()
        return guests_score
    }
    function sort_seats_score(seats_score){
        var seats_s = {}
        for(let i = 0; i < seats_score.length; i++){
            var seat_score = seats_score[i]
            seats_s[seat_score] = []
        }
        // for(let i = 0; i < seats_list.length; i++){
        //     var seat = seats_list[i]
        //     seats_s[seat.getAttribute('total_score')].push(seat.getAttribute('seat_id'))  
        // }

        for(let i = 0; i < seats_list.length; i++){
            var seat = seats_list[i]
            seats_s[seat.getAttribute('total_score')].push(seat)  
        }
        for (const [key, value] of Object.entries(seats_s)) {
            var tags = {}
            for(let seat of value){
                var seat_tags = JSON.parse(seat.getAttribute('tags'))
                if(seat_tags) tags[seat_tags[0].tag_name] = []
                else tags['all'] = []
            }
            for(let seat of value){
                var seat_tags = JSON.parse(seat.getAttribute('tags'))
                if(seat_tags) tags[seat_tags[0].tag_name].push(seat.getAttribute('seat_id'))
                else tags['all'].push(seat.getAttribute('seat_id'))
            }
            seats_s[key] = tags
        }
        return seats_s
    }
    function sort_guests_score(guests_score){
        var guest_s = {}
        for(let i = 0; i < guests_score.length; i++){
            var guest_score = guests_score[i]
            guest_s[guest_score] = []
        }
        for(let i = 0; i < guests_list.length; i++){
            var guest = guests_list[i]
            guest_s[guest.score].push(guest)
        }
        for (const [key, value] of Object.entries(guest_s)) {
            var requests = {}
            for(let guest of value){
                if(guest.requets > 0) {
                    var request_id = guest.requets[0]
                    var request_name = map_tags[request_id].tag_name
                    requests[request_name] = []
                }
                else requests['all'] = []
            }
            for(let guest of value){
                if(guest.requets > 0) {
                    var request_id = guest.requets[0]
                    var request_name = map_tags[request_id].tag_name
                    requests[request_name].push(guest.id)
                }
                else requests['all'].push(guest.id)
            }
            guest_s[key] = requests
        }
        return guest_s
    }
    function get_guests_requests(guests){
        var guests_requests = []
        for (const [key] of Object.entries(guests)){
            guests_requests.push(key)
        }
        var in_of_all = guests_requests.indexOf('all')
        if(in_of_all != -1){
            guests_requests.splice(in_of_all, 1)
            guests_requests.push('all')
        }
        return guests_requests
    }
    function get_seats_tags(seats){
        var seats_tags = []
        for (const [key] of Object.entries(seats)){
            seats_tags.push(key)
        }
        for (const [key, value] of Object.entries(seats_tags)){
            if(seats[value].length == 0){
                delete seats[value]
                seats_tags.splice(key, 1)
            }
        }
        return seats_tags
    }
    loader.start()
    proximity_score()
    .then(add_col_group_score)
    .then(()=>{
        var scheduling_list = []
        var seats_score = get_seats_score()
        var guests_score = get_guests_score()
        var seats_s = sort_seats_score(seats_score)
        var guest_s = sort_guests_score(guests_score)
        for(let i = 0; i < guests_score.length; i++){
            var guests = guest_s[guests_score[i]]
            var guests_requests = get_guests_requests(guests)
            for(let req of guests_requests){
                var guests_by_req = guests[req]
                while(guests_by_req.length != 0){
                    var random_for_guest = getRandomNumber((guests_by_req.length - 1))
                    var random_guest = guests_by_req[random_for_guest]
                    var is_in_plase = false
                    for(let i = 0; i < seats_score.length; i++){
                        var seats = seats_s[seats_score[i]]
                        var seats_tags = get_seats_tags(seats)
                        if(seats_tags.indexOf(req) == -1 && req != 'all') continue
                        if(seats_tags.length == 0) continue
                        if(req === 'all'){
                            var random_tag = seats_tags[getRandomNumber((seats_tags.length - 1))]
                            seats = seats[random_tag]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    is_in_plase = true
                                    break
                                }
                            }
                        }else{
                            seats = seats[req]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    is_in_plase = true
                                    break
                                }
                            }
                        }
                    }
                    if(!is_in_plase){
                        for(let seat_score of seats_score){
                            var seats = seats_s[seat_score]
                            var random_tag = seats_tags[getRandomNumber((seats_tags.length - 1))]
                            seats = seats[random_tag]
                            if(seats){
                                if(seats.length){
                                    var random_for_seat = getRandomNumber((seats.length - 1))
                                    var random_seat = seats[random_for_seat]                      
                                    seats.splice(random_for_seat, 1)
                                    guests_by_req.splice(random_for_guest, 1)
                                    scheduling_list.push({seat: random_seat, guest: random_guest})
                                    break
                                }
                            }
                        }
                        guests_by_req.splice(random_for_guest, 1)
                    }
                }
            }
        }
        add_m(scheduling_list)
        .then(loader.stop)
    })
}