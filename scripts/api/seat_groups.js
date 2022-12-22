import "../lib/jquery.min.js"

const api_url = '/hive-php/php/api.php'

export const seat_groups = {
    create: (name, score)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=create&name="+name+"&score="+score,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => alert(res))
        // .then(res => res.json())
        // .then((res)=>{
        //     if(res.msg == 'ok') return
        //     alert(res.msg)
        //     return res.msg
        // })
    },
    get_id: (name)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_id&name="+name,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data[0].id
            alert(res.msg)
            return res.msg
        })
    },
    get_name: (id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_name&id="+id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => alert(res))
        // .then(res => res.json())
        // .then((res)=>{
        //     if(res.msg == 'ok') return res.data
        //     alert(res.msg)
        //     return res.msg
        // })
    },
    get_groups_cols: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_groups_cols&map_id="+map_id,
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
    get_seats_cols: (map_id, group_name)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_seats_cols&map_id="+map_id+"&group_name="+group_name,
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
    add_col: (seat, group, map)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=add_col&seat="+seat+"&group="+group+"&map="+map,
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
    add_ob: (name, from_row, from_col, to_row, to_col, map)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=add_ob&map="+map+"&name="+name+"&from_row="+from_row+"&from_col="+from_col+"&to_row="+to_row+"&to_col="+to_col,
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
    get_ob: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_ob&map_id="+map_id,
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
    delete_ob: (ob_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=delete_ob&ob_id="+ob_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
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
    add_tag: (seat, group, map)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=add_tag&seat="+seat+"&group="+group+"&map="+map,
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
    get_groups_tags: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_groups_tags&map_id="+map_id,
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
    get_seats_tags: (map_id, group_name)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_seats_tags&map_id="+map_id+"&group_name="+group_name,
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
    update_tag_color: (id, color)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=update_tag_color&color="+color+"&id="+id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            return res.msg
        })
    },
    update_tag_name: (id, name)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=update_tag_name&name="+name+"&id="+id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            return res.msg
        })
    },
    get_all_tags: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_all_tags&map_id="+map_id,
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
    }
}