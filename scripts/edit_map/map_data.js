import api from "../api/api.js"

const mainBord = document.getElementById('mainBord')

export async function add_map_data(map_name){
    const map_data = await api.map.get(map_name)
    mainBord.setAttribute('map_name', map_data.map_name)
    mainBord.setAttribute('map_id', map_data.id)
    mainBord.setAttribute('rows', map_data.rows_number)
    mainBord.setAttribute('cols', map_data.columns_number)
}
export async function add_groups_data(){
    const map_id = mainBord.getAttribute('map_id')
    const groups = await api.guest.get_all_groups(map_id)
    var groups_to_press = {}
    groups.map(group => groups_to_press[group.id] = group)
    mainBord.setAttribute('groups', JSON.stringify(groups_to_press))
}
export async function add_guests_data(){
    const map_id = mainBord.getAttribute('map_id')
    const guests = await api.guest.get_all({map_id: map_id})
    const groups = JSON.parse(mainBord.getAttribute('groups'))
    guests.map(guest => {
        if(groups[guest.guest_group]) guest.score = Number(guest.score) + Number(groups[guest.guest_group].score)
        return guest
    })
    mainBord.setAttribute('guests', JSON.stringify(guests))
}
export async function add_seats_data(){
    const map_id = mainBord.getAttribute('map_id')
    var new_seats = {}
    const seats = await api.seat.get_all(map_id)
    seats.map(seat => {new_seats[seat.id] = seat})
    mainBord.setAttribute('seats', JSON.stringify(seats))
}
export async function add_belongs_data(){
    const map_id = mainBord.getAttribute('map_id')
    const belongs = await api.seat.get_belong(map_id)
    mainBord.setAttribute('seats_belongs', JSON.stringify(belongs))
}
export async function add_elements_data(){
    const map_id = mainBord.getAttribute('map_id')
    const map_elements = await api.map_elements.get(map_id)
    mainBord.setAttribute('map_elements', JSON.stringify(map_elements))
}
export async function add_tags_data(){
    const map_id = mainBord.getAttribute('map_id')
    const map_tags = await api.tags.get_tags({map_id: map_id})
    var new_map_tags = {}
    map_tags.map(tag => {new_map_tags[tag.id] = tag})
    mainBord.setAttribute('tags', JSON.stringify(new_map_tags))
}
export async function add_tags_belongs_data(){
    const map_id = mainBord.getAttribute('map_id')
    const belongs = await api.tags.get_all_belongs(map_id)
    mainBord.setAttribute('tags_belongs', JSON.stringify(belongs))
}