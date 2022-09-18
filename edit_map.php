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
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_map_and_details&map_name="+map_name,
                success: function(msg){
                    const map_and_details = JSON.parse(msg)
                    addMap(map_and_details.map.rows_number, map_and_details.map.columns_number)
                    for(let seat of map_and_details.seats){
                        addSeat(seat.row_num, seat.col_num, seat.id, seat.guest_id)
                    }
                    $('#sub').click(function(){
                        get_seat_string(map_and_details.map.id)
                    })
                }
            });
            $.ajax({
                type: "POST", 
                url: "api.php",
                data: "action=get_guests_names",
                success: function(msg){
                    var guests_list = JSON.parse(msg)
                    document.querySelectorAll('.seat').forEach(function(seat){
                        var seat_guest_id = $(seat).attr('guest_id')
                        for(var corrent of guests_list){
                            if(corrent.id == seat_guest_id){
                                $(seat).attr('guest_name', corrent.name)
                                $(seat).attr('guest_group', corrent.group)
                                $(seat).children('.name_box').text(corrent.name)
                                $(seat).children('.name_box').addClass('guest_group_'+corrent.group)
                                console.log($(seat).children('.name_box').attr('class'))
                                
                                
                            }
                        }
                        $(seat).click(function(){
                            var br = document.createElement('br')
                            var input_fild = document.createElement('input')
                            var search_button = document.createElement('button')
                            $(search_button).text('search')
                            $(search_button).attr('id', 'search_button')
                            $(input_fild).attr('type', 'input_fild')
                            $(input_fild).attr('id', 'input_fild')
                            $('#mneu').text(this.classList.value)
                            $('#mneu').append(br)
                            $('#mneu').append(input_fild)
                            $('#mneu').append(search_button)
                            var selected_seat_class = $(this).attr('seat_id')
                            var match_list_ele = document.createElement('ul')
                            $(match_list_ele).attr('id', 'match_list_ele')
                            $('#mneu').append(match_list_ele)
                            $('#input_fild').on('input', function(){
                                $('#match_list_ele').text('')
                                var search_str = '^'+$('#input_fild').val()
                                var input_str = $('#input_fild').val()
                                if(input_str.length != 0){
                                    var search_reg = new RegExp(search_str); 
                                    for(var corrent of guests_list){
                                        if(search_reg.test(corrent.name)){
                                            var match_li = document.createElement('li') 
                                            $(match_li).html(corrent.name+' | <span class="group_name">'+corrent.group+'</span>')
                                            $(match_li).attr('guest_id', corrent.id)
                                            $(match_li).attr('guest_group', corrent.group)
                                            $(match_li).attr('guest_name', corrent.name)
                                            $(match_li).click(function(){
                                                var selected_guest_id = $(this).attr('guest_id')
                                                $('#input_fild').val($(this).attr('guest_name'))
                                                alert(selected_guest_id+' && '+selected_seat_class)
                                                $.ajax({
                                                    type: "POST", 
                                                    url: "api.php",
                                                    data: "action=create_belong&guest_id="+selected_guest_id+"&seat_id="+selected_seat_class,
                                                    success:function(msg){
                                                        alert(msg)
                                                    }
                                                })
                                            })                                        
                                            $('#match_list_ele').append(match_li)
                                        }
                                    }
                                }                                
                            })
                        })
                    })                    
                }
            });
        });
    </script>

    <title> hive | </title>
</head>
<body>
    <div id="topBar"></div>
    <div id="mainBord">
        <div id="mapContainer"></div>
        <div id='sub'> submit </div>
        <div id='guests'> guests names </div>
    </div>
    <div id="mneu"></div>
    </body>
</html>