import "../lib/jquery.min.js"

const api_url = 'http://localhost/hive-php/php/api.php'

export const guest = {
    get_all: (map_id)=>{
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
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data
            alert(res.msg)
            return res.msg
        })
    },
    get_belong: (guest_id)=>{
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
    },
    create: (data, map_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=create&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&map_id="+map_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return
            alert(res.msg)
            return res.msg
        })
    },
    update: (data, map_id, guest_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=update&guest_id="+guest_id+"&first_name="+data[0]+"&last_name="+data[1]+"&guest_group="+data[2]+"&map_id="+map_id,
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
    creae_group: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=guest&action=create_group&"+$('#create_group_form').serialize()+"&map_id="+map_id,
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
        .then((res)=>{
            if(res.msg == 'ok') return res.msg
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
    }
}