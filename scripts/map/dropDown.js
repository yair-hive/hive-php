export default class {
    correntItemIndex = -1
    correntItem = ''
    box = ''
    dropDown = ''
    inputBox = ''
    guestsList = ''
    matchLength = 0
    constructor(){
        this.dropDown = document.getElementById('dropDown')
        this.inputBox = document.getElementById('inputBox')
        document.addEventListener("keydown", (e)=>{
            if(e.keyCode == 38){
                this.onArrowUp()
            }
            if(e.keyCode == 40){
                this.onArrowDown()
            }
        })
        document.getElementById('mainBord')
        .addEventListener('scroll', this.offsetCalculate)
        window.addEventListener('resize', this.offsetCalculate)        
        this.createMatchList = this.createMatchList.bind(this)
        this.createGuestsList = this.createGuestsList.bind(this)
        this.offsetCalculate = this.offsetCalculate.bind(this)
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)     
    }
    open = function(box){
        this.empty()
        this.inputBox.addEventListener('input', ()=>{
            this.empty()
            this.createGuestsList()
            this.guestsList = document.getElementById('guestsList')
        })
        document.getElementById('map').setAttribute('selectables', 'guests')
        this.box = box
        var guest_name = this.box.getAttribute('guest_name')
        this.dropDown.style.display = 'block'
        this.inputBox.style.display = 'inline-block'
        this.inputBox.value = guest_name
        this.inputBox.focus()
        this.offsetCalculate()
    }
    close = function(){
        this.inputBox.style.display = 'none'
        this.dropDown.style.display = 'none'
    }
    rollUp = function(){
        if(this.correntItemIndex < 0) this.correntItemIndex = 0
        if(this.correntItemIndex == 0) return
        this.correntItemIndex--
        this.correntItem = guestsList.childNodes[this.correntItemIndex]
    }
    rollDown = function(){
        if(this.correntItemIndex == this.matchLength - 1) return
        this.correntItemIndex++
        this.correntItem = guestsList.childNodes[this.correntItemIndex]
    }
    empty = function(){
        this.correntItemIndex = -1
        this.correntItem = ''
        this.dropDown.textContent = ''
    }
    offsetCalculate = function(){
        var parent = this.box.getBoundingClientRect()
        var parent_width = this.box.offsetWidth
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
    createMatchList = function(){
        var guests_data = JSON.parse(document.getElementById('map').getAttribute('guests')) 
        var match_list = []
        var input_str = this.inputBox.value
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
        this.matchLength = match_list.length 
        return match_list
    }
    createGuestsList = function(){
        var seat = this.box.getAttribute('seat_id')           
        var guestsList = document.createElement('ul')
        guestsList.setAttribute('id', 'guestsList')
        for(let corrent of this.createMatchList()){
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
        this.dropDown.append(guestsList)
        return guestsList
    }
    onArrowUp = function(){ 
        this.rollUp()
        document.querySelectorAll('.drop_down > ul > li').forEach(e => e.style.backgroundColor = 'rgb(202, 248, 248)')
        this.correntItem.style.backgroundColor = '#4f90f275'
        var list = this.dropDown.getBoundingClientRect()
        var corrent_ele_size = this.correntItem.getBoundingClientRect()
        var list_b = list.top + (corrent_ele_size.height + 15)
        if(this.correntItemIndex-1 >= 0){
            var next_ele = this.guestsList.childNodes[this.correntItemIndex - 1] 
            var next_ele_height = next_ele.getBoundingClientRect().height + 1
            if(corrent_ele_size.bottom < list_b){              
                this.dropDown.scrollTop = this.dropDown.scrollTop-next_ele_height 
            }
        }
    }
    onArrowDown = function(){  
        this.rollDown()   
        document.querySelectorAll('.drop_down > ul > li').forEach(e => e.style.backgroundColor = 'rgb(202, 248, 248)')
        this.correntItem.style.backgroundColor = '#4f90f275'
        var list = this.dropDown.getBoundingClientRect()
        var corrent_ele_size = this.correntItem.getBoundingClientRect()
        var list_b = list.bottom - (corrent_ele_size.height + 15)
        if(this.correntItemIndex+1 <= this.matchLength){
            var next_ele = this.guestsList.childNodes[this.correntItemIndex + 1] 
            var next_ele_height = next_ele.getBoundingClientRect().height + 1
            if(corrent_ele_size.top > list_b){           
                this.dropDown.scrollTop = this.dropDown.scrollTop+next_ele_height 
            }
        }
    }
}