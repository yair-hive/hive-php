<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="front_end/style.css">
    <link rel="stylesheet" href="front_end/viselect.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@viselect/vanilla/lib/viselect.cjs.js"></script>
    <script src="front_end/script.js"></script>
    <script src="front_end/viselect.js"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            const parsedUrl = new URL(window.location.href)
            const map_name = parsedUrl.searchParams.get("map_name")
            $('title').append(map_name)
            // $.ajax({
            //     type: "POST", 
            //     url: "api.php",
            //     data: "action=get_map_and_details&map_name="+map_name,
            //     success: function(msg){
            //         var map_and_details = JSON.parse(msg)
            //         var map = map_and_details.map
            //         addMap(map)
            //         for(let seat of map_and_details.seats){
            //             addSeat(seat)
            //         }
            //         $('#sub').click(function(){
            //             get_seat_string(map_and_details.map.id)
            //         })
            //     }
            // });
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_map&map_name="+map_name,
                success: function(msg){
                    var map = JSON.parse(msg)
                    addMap(map)
                    $('#sub').click(function(){
                        get_seat_string(map.id)
                    })
                }
            });
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_seats&map_name="+map_name,
                success: function(msg){
                    var seats = JSON.parse(msg)
                    for(let seat of seats){
                        addSeat(seat)
                    }
                }
            });
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_guests_names",
                success: function(msg){
                    var guests_list = JSON.parse(msg)
                    add_guest_details(guests_list)
                    add_num_box_ev()
                }                                
            })
        })
    </script>

    <title> hive | </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord">
        <div id="mapContainer"></div>
    </div>
    <div id="mneu">
        <div id='sub'> submit </div>
    </div>
    </body>
</html>