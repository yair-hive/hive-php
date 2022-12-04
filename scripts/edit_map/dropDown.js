export default class {
    correntItemIndex = -1
    matchLength = 0
    status = 'close'
    constructor(){
        this.dropDown = document.getElementById('dropDown')
        this.inputBox = document.getElementById('inputBox')  
        this.createMatchList = this.createMatchList.bind(this)
        this.createGuestsList = this.createGuestsList.bind(this)
        this.offsetCalculate = this.offsetCalculate.bind(this)
        this.roll = this.roll.bind(this)
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)  
        this.onInput = this.onInput.bind(this)   
        this.reset = this.reset.bind(this)
    }
    onInput = function(){
        this.empty()
        this.reset()
        this.createGuestsList()
        this.guestsList = document.getElementById('guestsList')
    }
    open = function(box){
        this.status = 'open'
        this.box = box
        box.textContent = ''
        this.empty()
        this.reset()
        var guest_name = this.box.getAttribute('guest_name')
        this.dropDown.style.display = 'block'
        this.inputBox.style.display = 'inline-block'
        this.inputBox.value = guest_name
        this.offsetCalculate()
        this.inputBox.focus()
        this.inputBox.addEventListener('input', this.onInput)
        document.getElementById('mainBord').addEventListener('scroll', this.offsetCalculate)
        window.addEventListener('resize', this.offsetCalculate)  
        document.getElementById('map').setAttribute('selectables', 'guests')
    }
    close = function(){
        this.status = 'close'
        document.getElementById('mainBord').removeEventListener('scroll', this.offsetCalculate)
        window.removeEventListener('resize', this.offsetCalculate)  
        this.inputBox.style.display = 'none'
        this.dropDown.style.display = 'none'
    }
    rollUp = function(){
        if(this.correntItemIndex < 0) this.correntItemIndex = 0
        if(this.correntItemIndex == 0) return
        this.correntItemIndex--
        this.roll()
        if(this.correntItemIndex - 1 >= 0) {
            this.nextItem = this.guestsList.childNodes[this.correntItemIndex - 1]
            this.nextItemHeight = this.nextItem.getBoundingClientRect().height + 1
        }
    }
    rollDown = function(){
        if(this.correntItemIndex == -1) this.dropDown.scrollTop = 0
        if(this.correntItemIndex == this.matchLength - 1) return
        this.correntItemIndex++
        this.roll()
        this.correntItem = guestsList.childNodes[this.correntItemIndex]
        if(this.correntItemIndex + 1 < this.matchLength) {
            this.nextItem = this.guestsList.childNodes[this.correntItemIndex + 1]
            this.nextItemHeight = this.nextItem.getBoundingClientRect().height + 1
        } 
    }
    roll = function(){
        this.correntItem = guestsList.childNodes[this.correntItemIndex]
        this.dropDownBounding = this.dropDown.getBoundingClientRect()
        this.correntItemBounding = this.correntItem.getBoundingClientRect()
        document.querySelectorAll('.drop_down > ul > li').forEach(e => e.style.backgroundColor = 'rgb(202, 248, 248)')
        this.correntItem.style.backgroundColor = '#4f90f275'
    }
    empty = function(){
        this.dropDown.textContent = ''
    }
    reset = function(){
        this.correntItemIndex = -1
        this.correntItem = false
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
            li.addEventListener('mouseover', (e)=> {
                if(e.target.getAttribute('guest_id')) e.target.style.backgroundColor = '#4f90f275'
                if(this.correntItem){
                    this.correntItem.style.backgroundColor = 'rgb(202, 248, 248)'
                    this.reset()
                }
            }) 
            li.addEventListener('mouseout', (e)=> {if(e.target.getAttribute('guest_id'))e.target.style.backgroundColor = 'rgb(202, 248, 248)'})                                      
            guestsList.append(li)
        }
        this.dropDown.append(guestsList)
        return guestsList
    }
    onArrowUp = function(){
        if(this.matchLength > 0){
            this.rollUp()
            var dropDownTop = this.dropDownBounding.top + (this.correntItemBounding.height + 15)
            if(this.correntItemBounding.bottom < dropDownTop) this.dropDown.scrollTop = this.dropDown.scrollTop - this.nextItemHeight 
        }
    }
    onArrowDown = function(){ 
        if(this.matchLength > 0){
            this.rollDown()   
            var dropDownBottom = this.dropDownBounding.bottom - (this.correntItemBounding.height + 15)
            if(this.correntItemBounding.top > dropDownBottom) this.dropDown.scrollTop = this.dropDown.scrollTop + this.nextItemHeight 
        }
    }
}