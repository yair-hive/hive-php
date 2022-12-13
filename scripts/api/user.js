import "../lib/jquery.min.js"

const api_url = '/hive-php/php/api.php'

export const user = {
    get: ()=>{
        const options = {
            method: 'POST',
            body: "category=user&action=get",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        .then(res => res.json())
    },
    get_all: ()=>{
        const options = {
            method: 'POST',
            body: "category=user&action=get_all",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
          
        return fetch(api_url, options)
        .then(res => res.json())
    },
    login : ()=>{
        const options = {
            method: 'POST',
            body: "category=user&action=login&"+$('#user_form').serialize(),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        .then(res => res.json())
    },
    sginup : ()=>{
        const options = {
            method: 'POST',
            body: "category=user&action=sginup&"+$('#user_form').serialize(),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        .then(res => res.json())
    },
    add_permission : (user_id, permission)=>{
        const options = {
            method: 'POST',
            body: "category=user&action=add_permission&user_id="+user_id+"&permission="+permission,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
          
        return fetch(api_url, options)
        .then(res => res.json())
    },
    get_permissions_list : ()=>{
        const options = {
            method: 'POST',
            body: "category=user&action=get_permissions_list",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
          
        return fetch(api_url, options)
        .then(res => res.json())
    },
    logout : ()=>{
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
}