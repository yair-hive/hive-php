const api_url = '/hive-php/php/api.php'

export const map_elements = {
    add: (name, from_row, from_col, to_row, to_col, map)=>{
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
    get: (map_id)=>{
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
    delete: (ob_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=delete_ob&ob_id="+ob_id,
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