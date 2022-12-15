import "../lib/jquery.min.js"

const api_url = '/hive-php/php/api.php'

export const user = {
    get: ()=>{
        var data = {category: 'user', action: 'get'}
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
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
    login : (form_data)=>{
        var data = {
            category: 'user', 
            action: 'login'
        }
        var data_a = Object.assign(data, form_data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
            headers: {}
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
    },
    sginup : (form_data)=>{
        var data = {
            category: 'user', 
            action: 'sginup'
        }
        var data_a = Object.assign(data, form_data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
            headers: {}
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
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