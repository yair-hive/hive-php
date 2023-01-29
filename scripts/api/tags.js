const api_url = '/php/api.php'

export const tags = {
    add: (seat, group, map)=>{
        const options = {
            method: 'POST',
            body: "category=tag&action=add_tag&seat="+seat+"&group="+group+"&map="+map,
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
    get_seats_tags: (map_id, group_name)=>{
        const options = {
            method: 'POST',
            body: "category=tag&action=get_belong&map_id="+map_id+"&group_name="+group_name,
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
    get_all_belongs: (map_id)=>{
        const options = {
            method: 'POST',
            body: "category=tag&action=get_all_belongs&map_id="+map_id,
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
    update_color: (id, color)=>{
        const options = {
            method: 'POST',
            body: "category=tag&action=update_tag_color&color="+color+"&id="+id,
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
    update_name: (id, name)=>{
        const options = {
            method: 'POST',
            body: "category=tag&action=update_tag_name&name="+name+"&id="+id,
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
    add_request: function(data){
        var action_data = {category: 'tag', action: 'add_request'}
        var data_a = Object.assign(action_data, data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
    },
    get_requests: function(data){
        var action_data = {category: 'tag', action: 'get_requests'}
        var data_a = Object.assign(action_data, data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
    },
    delete_tag: function(data){
        var action_data = {category: 'tag', action: 'delete_tag'}
        var data_a = Object.assign(action_data, data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
    },
    get_tags: function(data){
        var action_data = {category: 'tag', action: 'get_all_tags'}
        var data_a = Object.assign(action_data, data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
        }
        return fetch(api_url, options)
        // .then(res => res.text())
        // .then(res => console.log(res))
        .then(res => res.json())
        .then(res => {
            if(res.msg === 'ok') return res.data
            alert(res)
        })
    }
}