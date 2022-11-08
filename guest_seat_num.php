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
            const parsedUrl = new URL(window.location.href)
            const map_name = parsedUrl.searchParams.get("map_name")
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_guest_seat_num&map_name="+map_name,
                success: function(msg){
                    belongs_list = JSON.parse(msg)
                    console.log(belongs_list)
                    var list_table = document.createElement('table')
                    $(list_table).attr('id', 'list_table')
                    var tr = document.createElement('tr')
                    var th_seat_num = document.createElement('th')
                    var th_guest_first_name = document.createElement('th')
                    var th_guest_last_name = document.createElement('th')
                    var th_guest_group = document.createElement('th')                     
                    $(th_seat_num).text('seat number')
                    $(th_guest_first_name).text('guest first name')
                    $(th_guest_last_name).text('guest last name') 
                    $(th_guest_group).text('guest_group')
                    $(tr).append(th_seat_num)
                    $(tr).append(th_guest_first_name)
                    $(tr).append(th_guest_last_name) 
                    $(tr).append(th_guest_group) 
                    $(list_table).append(tr)
                    for(let bel of belongs_list){
                        var tr = document.createElement('tr')
                        var td_seat_num = document.createElement('td')
                        var td_guest_first_name = document.createElement('td')
                        var td_guest_last_name = document.createElement('td')
                        var td_guest_group = document.createElement('td')                        
                        $(td_seat_num).text(bel.seat_num)
                        $(td_guest_first_name).text(bel.guest_first_name)
                        $(td_guest_last_name).text(bel.guest_last_name)   
                        $(td_guest_group).text(bel.guest_group)                     
                        $(tr).append(td_seat_num)
                        $(tr).append(td_guest_group)
                        $(tr).append(td_guest_first_name)
                        $(tr).append(td_guest_last_name)                         
                        $(list_table).append(tr)
                    }
                    $('#mainBord').append(list_table)
                }
            });
            $('#export').click(function(){
                var html_string = $(list_table).html()
                $.ajax({
                    type: "POST", 
                    url: "api.php",
                    data: "action=export_to_exel&htmlString="+html_string,
                    success: function(msg){
                        window.location.href = "http://localhost/hive-php/uploads/write.xls";
                        console.log('pp')
                    }
                })
            })

        });
    </script>
    <title> hive | maps </title>
</head>
<body>
    <div id="topBar">
        <a href="http://localhost/hive-php/maps.php" class="hive-button"> maps </a>
        <a href="http://localhost/hive-php/import_guests.php" class="hive-button"> import guests </a>
    </div>
    <div id="mainBord"></div>
    <div id="mneu">
        <div id='export' class='hive-button'> export </div>
    </div>
</body>
</html>