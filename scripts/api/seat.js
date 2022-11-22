import "../lib/jquery.min.js"

const api_url = 'http://localhost/hive-php/php/api.php'

export const seat = {
    get_all: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_all&map_id="+map_id,
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
    get_belong: (seat_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_belong&seat_id="+seat_id,
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
    get_number: (seat_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_number&seat_id="+seat_id,
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
    delete_belong: (seat_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=delete_belong&seat_id="+seat_id,
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
    create_number: (seat_id, seat_number)=>{
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
    },
    create: (map_id, row, col)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=create&map_id="+map_id+"&row="+row+"&col="+col,
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }
        return fetch(api_url, options)
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return
            alert(res.msg)
            return res.msg
        })
    }
}
