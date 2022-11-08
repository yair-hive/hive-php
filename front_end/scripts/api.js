const api_url = 'http://localhost/hive-php/api.php'

export const get_map = (map_name)=>{
    const options = {
        method: 'POST',
        body: "action=get_map&map_name="+map_name,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}

export const get_seats = (map_name)=>{
    const options = {
        method: 'POST',
        body: "action=get_seats&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}

export const get_guests_names = ()=>{
    const options = {
        method: 'POST',
        body: "action=get_guests_names",
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}
export const post_seat_number = (seat_id, seat_number)=>{
    const options = {
        method: 'POST',
        body: "action=add_seat_number&seat_id="+seat_id+"&seat_number="+seat_number,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch('api.php', options)
    .then((response) => {
        location.reload();
    })

}
export const create_belong = (selected_guest_id, selected_seat_class, map_name)=>{
    const options = {
        method: 'POST',
        body: "action=create_belong&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch('api.php', options)
    .then((response) => {
        location.reload();
    })
}
export const post_seats = (map_id, selectedString)=>{
    const options = {
        method: 'POST',
        body: "action=add_seats&map_id="+map_id+"&seat_list="+selectedString,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch('api.php', options)
    .then((response) => {
        location.reload();
    })
}