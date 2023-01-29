import "../lib/jquery.min.js"

const api_url = '/php/api.php'

export const seat = {
    get_all: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_all&map_id="+map_id,
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
    get_all_and_all: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_all_and_all&map_id="+map_id,
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
    get_belong: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=get_belong&map_id="+map_id,
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
    },
    create_multiple: (map_id, data)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=create_multiple&map_id="+map_id+"&data="+data,
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }
        return fetch(api_url, options)
        // .then((res)=> res.text())
        // .then((res)=> console.log(res))
        .then(res => res.json())
        .then((res)=>{
            console.log(res)
            // if(res.msg == 'ok') return
            // alert(res.msg)
            // return res.msg
        })
    },
    delete: (seat_id)=>{
        const options = {
            method: 'POST',
            body: "category=seat&action=delete&seat_id="+seat_id,
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return
            alert(res.msg)
            return res.msg
        })
    }
}
