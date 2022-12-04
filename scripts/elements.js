import api from './api/api.js'

export function loginForm(){
    var form_cont = document.createElement('div')
    form_cont.classList.add('form_cont')
    var form = document.createElement('form')
    form.setAttribute('id', 'user_form')
    form.innerHTML = '<label for="user_name"> שם משתמש </label><br /><input type="text" name="user_name"><br /><label for="password"> סיסמה </label><br /><input type="text" name="password"><br />'
    var button = document.createElement('div')
    button.classList.add('hive-button')
    button.textContent = 'התחבר'
    button.addEventListener('click', ()=>{api.user.login().then(json => {alert(json.msg); closePopUp()})})
    form.append(button)
    form_cont.append(form)
    return form_cont
}
function closePopUp(){
    document.getElementById('blur').style.display = 'none'
}
export function addPopUp(){
    var blur = document.createElement('div')
    var popUp = document.createElement('div')
    var popUpHead = document.createElement('div')
    var popUpBody = document.createElement('div')
    popUpBody.setAttribute('id', 'popUpBody')
    popUpBody.classList.add('popUpBody')
    popUpHead.classList.add('popUpHead')
    popUpHead.setAttribute('id', 'popUpHead')
    popUpHead.addEventListener('click', closePopUp)
    blur.setAttribute('id', 'blur')
    blur.classList.add('blur')
    popUp.setAttribute('id', 'popUp')
    popUp.classList.add('popUp')
    popUp.append(popUpHead)
    popUp.append(popUpBody)
    blur.append(popUp)
    document.body.append(blur)
    blur.style.display = 'none'
}
export function openPopUp(title, msg){
    document.getElementById('popUpBody').innerHTML = ''
    document.getElementById('blur').style.display = 'block'
    document.getElementById('popUpBody').append(msg)
    document.getElementById('popUpHead').textContent = title
}
