<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="front_end/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_all_maps",
                success: function(msg){
                    $('#mainBord').html(msg);
                    var a_link = document.createElement('a')
                    a_link.setAttribute('href', 'create_map.php')
                    var sub = document.createElement('div')
                    sub.setAttribute('id', 'sub')
                    $(sub).text('add map')
                    $(a_link).append(sub)
                    $('#mainBord').append(a_link)
                }
            });
        });
    </script>
    <title> hive | maps </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord"></div>
    <div id="mneu"></div>
</body>
</html>