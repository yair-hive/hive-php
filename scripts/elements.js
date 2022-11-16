import "./lib/jquery.min.js"

export const add_map = (map)=>{
    const main_bord = document.getElementById('mainBord')
    const map_container = document.createElement("div")
    map_container.classList.add('map_container')
    const map_ele = document.createElement('div')
    map_ele.setAttribute('map_name', map.map_name)
    map_ele.setAttribute('map_id', map.id)
    map_ele.setAttribute('id', 'map')
    map_ele.classList.add('map')
    for(var rowsCounter = 1; rowsCounter <= map.rows_number; rowsCounter++){
        for(var colsCounter = 1; colsCounter <= map.columns_number; colsCounter++){
            var cell_cont = document.createElement('div')
            var cell = document.createElement('div')
            cell_cont.classList.add(`row-${rowsCounter}`)
            cell_cont.classList.add(`col-${colsCounter}`)
            cell_cont.classList.add('cell_cont')
            cell.classList.add(`row-${rowsCounter}`)
            cell.classList.add(`col-${colsCounter}`)
            cell.setAttribute('row', rowsCounter)
            cell.setAttribute('col', colsCounter)
            cell.classList.add('cell')
            cell.classList.add('selectable')
            cell_cont.append(cell)
            map_ele.appendChild(cell_cont)
        }
    }
    map_ele.style.setProperty('--map-rows', map.rows_number)
    map_ele.style.setProperty('--map-cols', map.columns_number)
    map_container.appendChild(map_ele)
    main_bord.appendChild(map_container)
}
export const add_seats = (seats)=>{
    for(let seat of seats){
        var cell = document.querySelector(`.cell_cont.row-${seat.row_num}.col-${seat.col_num}`)
        var seat_ele = document.createElement('div')
        seat_ele.classList.add(`row-${seat.row_num}`)
        seat_ele.classList.add(`col-${seat.col_num}`)
        var num_box = document.createElement('div')
        var name_box = document.createElement('div')
        num_box.classList.add('num_box')
        name_box.classList.add('name_box')
        seat_ele.classList.add('seat')
        $(name_box).attr('seat_id', seat.id)
        $(num_box).attr('seat_id', seat.id)
        $(name_box).attr('guest_id', seat.guest_id)
        $(num_box).text(seat.seat_number)
        seat_ele.append(num_box)
        seat_ele.append(name_box)
        cell.replaceChildren(seat_ele)
    }
}
export const add_guests = (guests)=>{
    document.querySelectorAll('.name_box').forEach((name_box)=>{
        var guest_id = name_box.getAttribute('guest_id')
        for(var corrent of guests){
            if(corrent.id == guest_id){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(corrent.name.length > 15) name_box.style.fontSize = '11px';
                corrent.group = corrent.group.replace(" ","_"); 
                name_box.setAttribute('guest_name', corrent.name)
                name_box.setAttribute('guest_group', corrent.group)
                name_box.textContent = corrent.name             
            }
        }
    }) 
}