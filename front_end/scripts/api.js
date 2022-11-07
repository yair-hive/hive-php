const api_url = 'http://localhost/hive-php/api.php'

export const get_map = (map_name)=>{
    const options = {
        method: 'POST',
        body: "action=get_map&map_name="+map_name,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch(api_url, options)
    .then((response) => {
        return response.json();
    })
}

export const get_seats = (map_name)=>{
    const options = {
        method: 'POST',
        body: "action=get_seats&map_name="+map_name,
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}

export const get_guests_names = ()=>{
    const options = {
        method: 'POST',
        body: "action=get_guests_names",
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    return fetch('api.php', options)
    .then((response) => {
        return response.json();
    })
}