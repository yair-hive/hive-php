const api_url = 'http://localhost/hive-php/php/api.php'

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
    get_groups: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_groups&map_id="+map_id,
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
    get_seats: (map_id, group_name)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=get_seats&map_id="+map_id+"&group_name="+group_name,
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
    add_belong: (seat, group, map)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=add_belong&seat="+seat+"&group="+group+"&map="+map,
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
    }
}