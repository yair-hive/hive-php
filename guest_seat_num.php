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
                data: "action=get_guest_seat_num",
                success: function(msg){
                    $('#mainBord').html(msg);
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