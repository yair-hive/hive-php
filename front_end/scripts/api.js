const api_url = 'http://localhost/hive-php/api.php'

export const get_all_maps = ()=>{
    $.ajax({
        type: "POST", 
        url: "http://localhost/hive-php/api.php",
        data: "action=get_all_maps",
        success: function(msg){
            $('#maps_list').html(msg);
        }
    });
}
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
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const get_guests_names = (map_name)=>{
    const options = {
        method: 'POST',
        body: "action=get_guests_names&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const post_map = () => {
    const options = {
        method: 'POST',
        body: "action=create_map&"+$('#create_map_form').serialize(),
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
    .then(()=>{window.location.replace('http://localhost/hive-php/maps.html')})
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
    return fetch(api_url, options)
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
    return fetch(api_url, options)
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
    return fetch(api_url, options)
}
export const post_guest = (data, map_name)=>{
    const options = {
        method: 'POST',
        body: "action=add_guests&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&map_name="+map_name,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const login = ()=>{
    const options = {
        method: 'POST',
        body: "action=login&"+$('#user_form').serialize(),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const sginup = ()=>{
    const options = {
        method: 'POST',
        body: "action=sginup&"+$('#user_form').serialize(),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const get_user = ()=>{
    const options = {
        method: 'POST',
        body: "action=get_user",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch('http://localhost/hive-php/api.php', options)
    .then((response) => {
        return response.json();
    })
}
export const logout = ()=>{
    const options = {
        method: 'POST',
        body: "action=logout",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch('http://localhost/hive-php/api.php', options)
    .then((response) => {
        return response.json();
    })
}