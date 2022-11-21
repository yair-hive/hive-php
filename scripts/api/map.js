import "../lib/jquery.min.js"

const api_url = 'http://localhost/hive-php/php/api.php'

export const map = {
    get_all: ()=>{
        const options = {
            method: 'POST',
            body: "category=map&action=get_all",
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
    get: (map_name)=>{
        const options = {
            method: 'POST',
            body: "category=map&action=get&map_name="+map_name,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };
          
        return fetch(api_url, options)
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data[0]
            alert(res.msg)
            return res.msg
        })
    },
    create: () => {
        const options = {
            method: 'POST',
            body: "category=map&action=create&"+$('#create_map_form').serialize(),
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