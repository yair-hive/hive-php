<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="front_end/style.css">
    <script src="front_end/lib/jquery.min.js"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_all_maps",
                success: function(msg){
                    $('#mainBord').html(msg);
                    var sub = document.createElement('div')
                    sub.setAttribute('id', 'sub')
                    sub.classList.add('hive-button')
                    $(sub).text('הוסף מפה')
                    $(sub).click(()=>{
                        location.href='http://localhost/hive-php/create_map.php'
                    })
                    $('#mainBord').append(sub)
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