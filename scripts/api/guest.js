import "../lib/jquery.min.js"

const api_url = '/hive-php/php/api.php'

const options = {
    method: 'POST',
    credentials: 'include',
}; 

export const guest = {
    get_all: (req)=>{  
        var action_params = {category: 'guest', action: 'get_all'}
        var req_body = Object.assign(action_params, req)
        options.body = JSON.stringify(req_body)       
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data
            alert(res.msg)
            return res.msg
        })
    },
    get_all_and_ditails: (req)=>{
        var action_params = {category: 'guest', action: 'get_all_and_ditails'}
        var req_body = Object.assign(action_params, req)
        options.body = JSON.stringify(req_body)  
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        // .then(res => alert(res))
        .then(res => res.json())
        .then(res => {return res.data})
    },
    create: (req)=>{
        var action_params = {category: 'guest', action: 'create'}
        var req_body = Object.assign(action_params, req)
        options.body = JSON.stringify(req_body)  
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => console.log(res))
        // .then(res => alert(res))
        // .then(res => res.json())
        // .then((res)=>{
        //     if(res.msg == 'ok') return
        //     console.log(res)
        //     return res.msg
        // })
        // .then(()=> alert())
    },
    create_multi: (req)=>{
        var action_params = {category: 'guest', action: 'create_multi'}
        var req_body = Object.assign(action_params, req)
        options.body = JSON.stringify(req_body)  
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => console.log(res))
        // .then(res => alert(res))
        // .then(res => res.json())
        // .then((res)=>{
        //     if(res.msg == 'ok') return
        //     console.log(res)
        //     return res.msg
        // })
        // .then(()=> alert())
    },
    update: (data, map_id, guest_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update&guest_id="+guest_id+"&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&score="+data[3]+"&map_id="+map_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return
            alert(res.msg)
            return res.msg
        })
    },
    create_belong: (selected_guest_id, selected_seat_class, map_id)=>{
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
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
    },
    update_belong: (selected_guest_id, selected_seat_class, map_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update_belong&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class+"&map_id="+map_id,
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }
        return fetch(api_url, options)
        .then(res => res.json())
    },
    update_belong_multiple: (map_id, data)=>{
        data = JSON.stringify(data)
        const options = {
            method: 'POST',
            body: "category=guest&action=update_belong_multiple&data="+data+"&map_id="+map_id,
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }
        return fetch(api_url, options)
        // .then(res => res.json())
        .then(res => res.text())
        .then(res => console.log(res))
    },
    delete: (guest_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=delete&guest_id="+guest_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        .then(res => res.json())
    },
    get_all_groups: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=get_all_groups&map_id="+map_id,
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
          
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data
            alert(res.msg)
            return res.msg
        })
    },
    delete_group: (group_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=delete_group&group_id="+group_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.msg
            alert(res.msg)
            return res.msg
        })
    },
    update_group_color: (group_id, color)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update_group_color&group_id="+group_id+"&color="+color,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.msg
            alert(res.msg)
            return res.msg
        })
    },
    update_group_score: (group_id, score)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update_group_score&group_id="+group_id+"&score="+score,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.msg
            alert(res.msg)
            return res.msg
        })
    },
    update_guest_score: (guest_id, score)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update_guest_score&guest_id="+guest_id+"&score="+score,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.msg
            alert(res.msg)
            return res.msg
        })
    },
}