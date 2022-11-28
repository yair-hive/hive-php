export default class {
    correntItemIndex = 0
    correntItem = ''
    box = ''
    dropDown = ''
    inputBox = ''
    matchList = ''
    guestsList = ''
    constructor(box){
        this.createDropDown = this.createDropDown.bind(this)
        this.createInputBox = this.createInputBox.bind(this)
        this.createMatchList = this.createMatchList.bind(this)
        this.createGuestsList = this.createGuestsList.bind(this)
        this.offsetCalculate = this.offsetCalculate.bind(this)
        this.box = box
    }
    open = function(){}
    close = function(){}
    rollUp = function(){}
    rollDown = function(){}
    append = function(){}
    offsetCalculate = function(){
        var parent = this.box.getBoundingClientRect()
        var parent_width = box.offsetWidth
        var list_width_over = 60
        var list_width_over_d = list_width_over / 2
        var drop_down_top = parent.bottom
        var drop_down_width = parent_width + list_width_over
        var drop_down_left = parent.left - list_width_over_d 
        this.inputBox.style.position = 'absolute'
        this.inputBox.style.margin = 0
        this.inputBox.style.padding = 0
        this.inputBox.style.top = parent.top+'px'
        this.inputBox.style.left = parent.left+'px'
        this.dropDown.style.position = 'absolute'
        this.dropDown.style.width = drop_down_width+'px'
        this.dropDown.style.top = drop_down_top+'px'
        this.dropDown.style.left = drop_down_left+'px'
        this.dropDown.style.overflow = 'auto'
    }
    createDropDown = function(){
        var drop_down = document.createElement('div')
        drop_down.setAttribute('id', 'drop_down')
        drop_down.classList.add('drop_down')
        this.dropDown = drop_down
        return drop_down
    }
    createInputBox = function(){
        var guest_name = this.box.getAttribute('guest_name')
        var input_fild = document.createElement('input')
        input_fild.setAttribute('autocomplete', "off")
        input_fild.setAttribute('id', 'name_box_input')
        input_fild.classList.add('name_box')
        input_fild.value = guest_name
        this.InputBox = input_fild
        return input_fild
    }
    createMatchList = function(){
        var guests_data = JSON.parse(document.getElementById('map').getAttribute('guests')) 
        var match_list = []
        var input_str = document.getElementById('name_box_input').value
        var search_str = '^'+input_str
        if(input_str.length != 0){
            var search_reg = new RegExp(search_str)
            for(var corrent of guests_data){
                corrent.name = corrent.last_name+' '+corrent.first_name
                if(search_reg.test(corrent.name)){
                    match_list.push(corrent)
                }
            }
        }
        this.matchList = match_list
        return match_list
    }
    createGuestsList = function(){
        var seat = this.box.getAttribute('seat_id')           
        var guestsList = document.createElement('ul')
        guestsList.setAttribute('id', 'guestsList')
        for(let corrent of this.matchList()){
            corrent.name = corrent.last_name+' '+corrent.first_name
            var li = document.createElement('li') 
            li.innerHTML = corrent.name+' <span class="group_name">'+corrent.guest_group+'   |</span>'
            li.classList.add('match_list')
            li.setAttribute('guest_id', corrent.id)
            li.setAttribute('guest_name', corrent.name)
            li.setAttribute('guest_group', corrent.guest_group.replace("_"," "))
            li.setAttribute('seat', seat)
            li.addEventListener('click', (e)=> onAddGuest(e.target))                                       
            guestsList.append(li)
        }
        this.guestsList = guestsList
        return guestsList
    }
}