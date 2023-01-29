import "../lib/jquery.min.js"

const api_url = '/php/api.php'

export const seat_groups = {
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
}