<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="front_end/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="front_end/script.js"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            const parsedUrl = new URL(window.location.href)
            const map_name = parsedUrl.searchParams.get("map_name")
            $('title').append(map_name)
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_map_and_details&map_name="+map_name,
                success: function(msg){
                    const map_and_details = JSON.parse(msg)
                    addMap(map_and_details.map.rows_number, map_and_details.map.columns_number)
                    for(let seat of map_and_details.seats){
                        addSeat(seat.row_num, seat.col_num)
                    }
                }
            });
        });
    </script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            $('.seat').each(function(){
                var seat_class = this.attr('class')
                this.click(function(){
                    this.css('background-color', 'blueviolet')
                    $('#mneu').append(seat_class)
                })
            })
        });
    </script>
    <title> hive | </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord">
        <div id="mapContainer"></div>
    </div>
    <div id="mneu"></div>
</body>
</html>