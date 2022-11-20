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
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
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
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data[0]
        alert(res.msg)
        return res.msg
    })
}
export const get_seats = (map_id)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=get_all&map_id="+map_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
    })
}
export const seat_get_belong = (seat_id)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=get_belong&seat_id="+seat_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
    })
}
export const guest_get_belong = (guest_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=get_belong&guest_id="+guest_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
    })
}
export const get_seat_number = (seat_id)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=get_number&seat_id="+seat_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
    })
}
export const get_guests = (map_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=get_all&map_id="+map_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
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
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return
        alert(res.msg)
        return res.msg
    })
}
export const post_seat = (map_id, row, col)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=create&map_id="+map_id+"&row="+row+"&col="+col,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return
        alert(res.msg)
        return res.msg
    })
}
export const post_guest = (data, map_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=create&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&map_id="+map_id,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return
        alert(res.msg)
        return res.msg
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
    .then(res => res.json())
}
export const add_guest = (selected_guest_id, selected_seat_class, map_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=add&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_id="+map_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
    .then(res => res.json())
}
export const update_guest = (selected_guest_id, selected_seat_class, map_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=update_guest&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_id="+map_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }
    return fetch(api_url, options)
    .then(res => res.json())
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
    .then(res => res.json())
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
    .then(res => res.json())
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
    .then(res => res.json())
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
    .then(res => res.json())
}
export const add_permission = (user_id, permission)=>{
    const options = {
        method: 'POST',
        body: "category=user&action=add_permission&user_id="+user_id+"&permission="+permission,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
}
export const get_permissions_list = ()=>{
    const options = {
        method: 'POST',
        body: "category=user&action=get_permissions_list",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
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
    .then(res => res.json())
}
export const delete_guest = (guest_id)=>{
    const options = {
        method: 'POST',
        body: "category=guest&action=delete&guest_id="+guest_id,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
    return fetch(api_url, options)
    .then(res => res.json())
}
export const seat_delete_belong = (seat_id)=>{
    const options = {
        method: 'POST',
        body: "category=seat&action=delete_belong&seat_id="+seat_id,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then(res => res.json())
    .then((res)=>{
        if(res.msg == 'ok') return res.data
        alert(res.msg)
        return res.msg
    })
}
