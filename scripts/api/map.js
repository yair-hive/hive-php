import "../lib/jquery.min.js"

const api_url = '/hive-php/php/api.php'

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
    },
    delete_row: (row, map_id, map_rows)=>{
        const options = {
            method: 'POST',
            body: "category=map&action=delete_row&row="+row+"&map_id="+map_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => console.log(res))
        // .then(res => res.json())
    },
    delete_col: (col, map_id)=>{
        const options = {
            method: 'POST',
            body: "category=map&action=delete_col&col="+col+"&map_id="+map_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        // .then(res => res.json())
        .then(res => res.text())
        .then(res => console.log(res))
    },
    add_row: (row, map_id, map_rows)=>{
        const options = {
            method: 'POST',
            body: "category=map&action=add_row&row="+row+"&map_id="+map_id+"&map_rows="+map_rows,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => console.log(res))
        // .then(res => res.json())
    },
    add_col: (col, map_id)=>{
        const options = {
            method: 'POST',
            body: "category=map&action=add_col&col="+col+"&map_id="+map_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        };         
        return fetch(api_url, options)
        // .then(res => res.json())
        .then(res => res.text())
        .then(res => console.log(res))
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
        // .then(res => res.text())
        // .then(res => alert(res))
        .then(res => res.json())
        .then((res)=>{
            if(res.msg == 'ok') return res.data[0]
            alert(res.msg)
            return res.msg
        })
    },
    create: (form_data) => {
        var data = {
            category: 'map', 
            action: 'create'
        }
        var data_a = Object.assign(data, form_data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
            headers: {}
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
    } 
}