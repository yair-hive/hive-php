import "./lib/jquery.min.js"

const api_url = 'http://localhost/hive-php/php/api.php'

export const get_maps = ()=>{
    const options = {
        method: 'POST',
        body: "category=map&action=get_all",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        // console.log(response.text())
        return response.json()
    })
}
export const get_map = (map_name)=>{
    const options = {
        method: 'POST',
        body: "category=map&action=get&map_name="+map_name,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        // console.log(response.text())
        return response.json()
    })
}
export const get_seats = (map_name)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=get_all&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json()
    })
}
export const get_guests = (map_name)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=get_all&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json()
    })
}
export const post_map = () => {
    const options = {
        method: 'POST',
        body: "category=map&action=create&"+$('#create_map_form').serialize(),
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
    .then(()=>{window.location.replace('http://localhost/hive-php/html/maps.html')})
}
export const post_seat = (map_name, row, col)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=create&map_name="+map_name+"&row="+row+"&col="+col,
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
        body: "category=guest&action=create&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&map_name="+map_name,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const add_seat_number = (seat_id, seat_number)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=add_number&seat_id="+seat_id+"&seat_number="+seat_number,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
}
export const add_guest = (selected_guest_id, selected_seat_class, map_name)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=add&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
}
export const login = ()=>{
    const options = {
        method: 'POST',
        body: "category=user&action=login&"+$('#user_form').serialize(),
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
        body: "category=user&action=sginup&"+$('#user_form').serialize(),
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
        body: "category=user&action=get",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}
export const get_users = ()=>{
    const options = {
        method: 'POST',
        body: "category=user&action=get_all",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        // console.log(response.text())
        return response.json()
    })
}
export const add_permission = (user_name, permission)=>{
    const options = {
        method: 'POST',
        body: "category=user&action=add_permission&user_name="+user_name+"&permission="+permission,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
}
export const logout = ()=>{
    const options = {
        method: 'POST',
        body: "category=user&action=logout",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}

export const get_guest_seat_num = (map_name)=>{
    const options = {
        method: 'POST',
        body: "category=all&action=get_guest_seat_num&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
}