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
            $('#sub').click(function(){
                $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=add_guests&"+$('#add_guest_form').serialize(),
                success: function(msg){
                    alert(msg);
                }
            });
            })
        });
    </script>
    <title> hive | add guests </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord">
        <form id='add_guest_form'>
            <label for="first_name"> first name </label>
            <input type='text' name='first_name'>  
            <br />           
            <label for="last_name"> last name </label>
            <input type='text' name='last_name'>
            <br /> 
            <label for="guest_group"> guest group </label>
            <input type='text' name='guest_group'>
            <br /> 
        <form>
        <div id='sub'> submit </div> 
    </div>
    <div id="mneu"></div>
    <script src="front_end/script.js"></script>
</body>
</html>
