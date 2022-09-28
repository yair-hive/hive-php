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
    <!-- <script src="front_end/drag-to-scroll.js"></script>    -->
    <script type="text/javascript"> 
        $(document).ready(async function(){
            const parsedUrl = new URL(window.location.href)
            const map_name = parsedUrl.searchParams.get("map_name")
            $('title').append(map_name)
            var map = await get_map(map_name)
            await get_map_callbeck(map)
            var seats = await get_seats(map_name)
            await get_seats_callback(seats)
            var guests_list = await get_guests_names()
            await get_guests_names_callback(guests_list)
            set_num()
        })
    </script>

    <title> hive | </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord"></div>
    <div id="mneu">
        <div id='sub' class='sub'> submit </div>
        <div id='sub_1' class='sub'> submit 1 </div>
        <div id='sub_2' class='sub'> submit 2 </div>
        <div id='sub_3' class='sub'> submit 3 </div>
    </div>
</body>
</html>