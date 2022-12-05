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
    add_belong: (seat, group)=>{
        const options = {
            method: 'POST',
            body: "category=seat_groups&action=add_belong&seat="+seat+"&group="+group,
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
    }
}