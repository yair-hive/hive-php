const api_url = '/hive-php/php/api.php'

export const tags = {
    add_request: function(data){
        var action_data = {category: 'tag', action: 'add_request'}
        var data_a = Object.assign(action_data, data)
        const options = {
            method: 'POST',
            body: JSON.stringify(data_a),
        }
        return fetch(api_url, options)
        .then(res => res.text())
        .then(res => {
            // var st = JSON.parse(res)
            // if(st) return st
            // else 
            return res
        })
        // .then(res => res.json())
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
    }
}