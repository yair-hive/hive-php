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
            get_map(map_name)
            get_seats(map_name)
            get_guests_names()
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