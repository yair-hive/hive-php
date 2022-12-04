function test(){
    var score, map, map_rows, map_cols, as_decimal, seat, cols_middle, i
    map = document.getElementById('map')
    map_rows = map.getAttribute('rows')
    map_cols = map.getAttribute('cols')
    cols_middle = Math.round(map_cols / 2)
    as_decimal = (map_cols / 2) % 1 != 0
    i = 0
    for(let col = 1; col <= map_cols; col++){
        document.querySelectorAll('.cell_cont[col="'+col+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            if(seat.children[1]) seat.children[1].append(score)
        })
        if(as_decimal){
            if(col > cols_middle) {i++; score = Math.abs(i);}
            if(col < cols_middle) {i--; score = Math.abs(i);}
            if(col == cols_middle) {i++; score = Math.abs(i);}
        }
    }
    i = 0
    for(let row = map_rows; row != 0 ; row--){
        i++
        document.querySelectorAll('.cell_cont[row="'+row+'"]').forEach(cell_cont => {
            seat = cell_cont.children[0]
            score = i
            if(seat.children[1]) seat.children[1].append(' & '+score)
        })

    }
}
var mneu = document.getElementById('mneu')
var button = document.createElement('div')
button.classList.add('hive-button')
button.textContent = 'test'
mneu.append(button)
button.addEventListener('click', test)