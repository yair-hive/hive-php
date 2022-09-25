$(document).ready(function(){
    const options = {
        method: 'POST',
        body: "action=add_seats&map_id=2",
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };
      
    fetch('http://localhost/hive_php_new/test/api.php', options)
    .then((response) => {
        return response.text();
    })
    .then((jsonObject) => {
        console.log(jsonObject)
        document.write(jsonObject)
    })
    .catch((error) => {
        document.write(error);
    });

    $.ajax({
        type: "POST", 
        url: "api.php",
        data: "action=add_seats&map_id=2",
        success: function(msg){
            console.log(msg)
        }
    });

    const formData  = new FormData();
    formData.append('action', 'get_map')
    const options_2 = {
        method: 'POST',
        body: formData
        }
        fetch('http://localhost/hive_php_new/test/api.php', options_2)
    .then((response) => {
        return response.text();
    })
    .then((jsonObject) => {
        console.log(jsonObject)
        document.write(jsonObject)
    })
    .catch((error) => {
        document.write(error);
    });
})
