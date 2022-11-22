import "../lib/jquery.min.js"

const api_url = 'http://localhost/hive-php/php/api.php'

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

