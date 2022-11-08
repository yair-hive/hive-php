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
            $('#sub').click(function(){
                $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=create_map&"+$('#create_map_form').serialize(),
                success: function(msg){
                    window.location.replace('maps.php')
                }
            });
            })
        });
    </script>
    <title> hive | add map </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord">
        <form id='create_map_form'>
            <label for="map_name"> map name </label>
            <input type='text' name='map_name'>  
            <br />
            <label for="rows_number"> rows number </label>
            <input type='text' name='rows_number'>
            <br />
            <label for="columns_number"> columns_number </label>
            <input type='text' name='columns_number'> 
            <br /> 
        <form>
        <div id='sub' class='hive-button'> צור </div> 
    </div>
    <div id="mneu"></div>
    <script src="front_end/script.js"></script>
</body>
</html>
