<script defer>
    let solution_array = [];
    
    let numbersDone_dict = {}; 

    let hint_array = [];

    let sudoku_array = [];

    let file = false;
    
    function zero_dict(){
        for(let i = 1; i<=9; i++){
            numbersDone_dict[i] = 0;
        }
    }

    function randomInt(min, max){
        return Math.round(Math.random()*(max-min)+min);
    }

    zero_dict();

/* Backtracking solver */

const indexToRowCol = (index) => {
return { row: Math.floor(index / 9), col: index % 9 }
}

const RowColToindex = (row, col) => (row * 9 + col)

const acceptable = (board, index, value) => {
    let { row, col } = indexToRowCol(index)
    for (let r = 0; r < 9; ++r) {
        if (board[RowColToindex(r, col)] == value) return false
    }
    for (let c = 0; c < 9; ++c) {
        if (board[RowColToindex(row, c)] == value) return false
    }

    let r1 = Math.floor(row / 3) * 3
    let c1 = Math.floor(col / 3) * 3
    for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
            if (board[RowColToindex(r, c)] == value) return false
        }
    }
    return true
}

const getChoices = (board, index) => {
    let choices = []
    for (let value = 1; value <= 9; ++value) {
        if (acceptable(board, index, value)) {
            choices.push(value)
        }
    }
    return choices
}

const bestBet = (board) => {
    let index, moves, bestLen = 100
    for (let i = 0; i < 81; ++i) {
        if (!board[i]) {
            let m = getChoices(board, i)
            if (m.length < bestLen) {
                bestLen = m.length
                moves = m
                index = i
                if (bestLen == 0) break
            }
        }
    }
    return { index, moves }
}

const solve = () => {
    let { index, moves } = bestBet(solution_array)
    if (index == null) return true
    for (let m of moves) {
        solution_array[index] = m

        if (solve()) return true
    }
    solution_array[index] = 0

    return false
}


function populateValues() {
    const inputs = document.querySelectorAll('input')
    let i = 0;
    inputs.forEach((input) => {
        if(input.getAttribute('type') =="text"){
            input.value = solution_array[i];
            i++;
        }
    });
}

/* --- */

    async function getSudokuJSON(type){
        let response = await fetch("data/sudoku.json");
        let responseJSON = await response.json();
        let rawsudo = responseJSON.RawSudoku[randSudo];
        let solution = responseJSON.SolvedSudoku[randSudo];
        let list = [];
        if(type == 0){
            return rawsudo;
        }
        else{
            solution.forEach(el => {
                el.forEach(element => {
                    list.push(element);
                    solution_array.push(element);
                });
            });
            return list;
        }
    }

    let randSudo = randomInt(0,26);
    let sudoku = getSudokuJSON(0);  
    let solution = getSudokuJSON(1);

    function loadFromFile(e){
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);
    }

    function onReaderLoad(event){
        let obj = JSON.parse(event.target.result);
        if(obj.Sudoku){
            if(obj.Sudoku[0]){
                file = true;
                sudoku_array = [];
                solution_array = [];
                obj.Sudoku[0].forEach(el => {
                    el.forEach(element => {
                        sudoku_array.push(element);
                        solution_array.push(element);
                    });
                });
                if(solve()){
                    alert("File loaded");
                    let inp_list = document.querySelectorAll('input')
                    let i = 0;
                    let j = 0;
                    while(i<inp_list.length){
                        if(inp_list[i].getAttribute('type') == "text"){
                            if(sudoku_array[j] != 0){
                                inp_list[i].value = sudoku_array[j];
                                inp_list[i].classList.add("default");
                            }
                            else{
                                inp_list[i].value = "";
                                inp_list[i].classList.remove("default");
                            }
                            inp_list[i].style.color = "black";
                            j++;
                        }
                        i++;
                    }
                    for(let k = 0; k<numbersDone_dict.length; k++){
                        numbersDone_dict[k] = 0;
                    }
                    setTimeout(inputs_moving, 100);
                }
                else{
                    alert("Can't solve this puzzle!");
                    location.reload();
                }
            }
        }
        else{
            alert("Wrong file");
        }
    }

    function load(){
        setTimeout(load_done_numbers, 100);
    }

    function load_done_numbers(){
        zero_dict();
        let inp_list = document.querySelectorAll('input');
        inp_list.forEach(inp => {
            let val = inp.value;
            if(val != "" && inp.getAttribute("type") == "text"){
                let n = inp.classList[0].slice(5);
                let correct = solution_array[parseInt(n)-1];
                if(correct == val){
                    if(!inp.classList.contains("default")){
                        inp.style.color = "green";
                    }
                }
                else{
                    if(!inp.classList.contains("default")){
                        inp.style.color = "red";
                    }
                }
                numbersDone_dict[val]++;
            }
            else{
                inp.style.color = "black";
            }

            
            let num_done = document.getElementById(`num-${val}`);
            if(numbersDone_dict[val] >= 9){
                if(num_done) num_done.setAttribute("style","background-color: green");
            }
            else{
                if(num_done) num_done.setAttribute("style","background-color: gray");
            }
        });

        if(isEnd()){
            end();
        }
    }

    function inputs_moving(){
        let inp = document.querySelectorAll("input");
        
        inp.forEach(el => {
            if(el.classList.contains("default")){
                el.disabled = true;
                el.maxLength = 1;
            }
            else{
                el.disabled = false;
                el.maxLength = 0;
            }
        });
        inp.forEach((element, key) => {
            if(element.getAttribute("type") == "text"){
                element.addEventListener("keyup", (e) => {
                if(e.keyCode >= 48 && e.keyCode <= 57){
                    inp[key].value = e.key;
                    if (element.value.length == element.maxLength+1) {
                        let next = 1;
                        if(inp[key+next]){
                            while(inp[key+next] && (inp[key+next].disabled || inp[key+next].getAttribute('type') == "checkbox" || inp[key+next].getAttribute('type') == "file")){
                                next++;
                            }
                            if(inp[key+next]){

                                inp[key+next].focus();
                            }
                            else{
                                key = 1;

                                inp[key].focus();
                            }
                        }
                        else
                        {
                            key = 1;
                            inp[key].focus();
                        }
                    }
                }
                else if(e.keyCode == 13 || e.keyCode == 39){
                    let next = 1;
                    if(inp[key+next]){
                        while(inp[key+next] && (inp[key+next].disabled || inp[key+next].getAttribute('type') == "checkbox" || inp[key+next].getAttribute('type') == "file")){
                            next++;
                        }
                        if(inp[key+next]){
                            inp[key+next].focus();
                        }
                    }
                }
                else if(e.keyCode == 37 || e.keyCode == 8){
                    let next = 1;
                    if(inp[key-next]){
                        while(inp[key-next] && (inp[key-next].disabled || inp[key-next].getAttribute('type') == "checkbox" || inp[key-next].getAttribute('type') == "file")){
                            next++;
                        }
                        if(inp[key-next]){
                            inp[key-next].focus();
                        }
                    }
                }
                else if(e.keyCode == 38){
                    let next = 9;
                    if(inp[key-next]){
                        while(inp[key-next] && (inp[key-next].disabled || inp[key-next].getAttribute('type') == "checkbox" || inp[key-next].getAttribute('type') == "file")){
                            next+=9;
                        }
                        if(inp[key-next]){
                            inp[key-next].focus();
                        }
                    }
                }
                else if(e.keyCode == 40){
                    let next = 9;
                    if(inp[key+next]){
                        while(inp[key+next] && (inp[key+next].disabled || inp[key+next].getAttribute('type') == "checkbox" || inp[key+next].getAttribute('type') == "file")){
                            next+=9;
                        }
                        if(inp[key+next]){
                            inp[key+next].focus();
                        }
                    }
                }
            });
        }
    });
    }

    function hintingArray(){
        for(let i = 0; i<81; i++){
            let rand = randomInt(1,9);
            while(solution_array[i] == rand){
                rand = randomInt(1,9);
            }
            hint_array.push(rand);
        }
    }

    setTimeout(inputs_moving, 100);
    setTimeout(hintingArray, 100);

    function is_hinted(e){
        let inputs = document.querySelectorAll('input');
        let hint_inp = inputs[inputs.length-2];
        let era_inp = inputs[inputs.length-1];
        let this_inp = e.target;
        let td = this_inp.parentElement;
        if(hint_inp.checked){
            let this_num = e.target.classList[0].slice(5);
            let correct = solution_array[parseInt(this_num)-1];
            let randomHint = hint_array[parseInt(this_num)-1];
            let hint = [randomHint, correct];
            hint = shuffle(hint);
            td.children[0].innerText = hint[0];
            td.children[2].innerText = hint[1];
        }
        else if(era_inp.checked){
            td.children[0].innerText = "";
            td.children[2].innerText = "";
        }
    }      

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function auto_solve(){
        let inputs = document.querySelectorAll('input');
        if(file){
            populateValues();
            inputs.forEach(el => {
                el.style.color = "green";
            });
            load();
        }
        else{
        inputs.forEach((el, key) => {
            if(solution_array[key-1] && el.value != solution_array[key-1]){
                el.value = solution_array[key-1];
            }
            el.style.color = "green";
        });
        load();}

    }

    function isEnd(){
        let inputs = document.querySelectorAll('input');
        let is = true;
        for(let i = 1; i<=81; i++){
            if(solution_array[i-1] && inputs[i].value != solution_array[i-1]){
                is = false;
            }
        }

        return is;
    }

    function end(){
        setTimeout(function(){
            let goNext = confirm("Solved. Next?");
            if(goNext){
                location.reload();
            }
        }, 100);
    }
</script>

<main>
    <input type="file" name="sudokuFile" id="uploadFile" class="fileUpload not-print" on:change={function(e) {loadFromFile(e)}}>
    {#await sudoku}
        <p>loading...</p>
    {:then sudoku} 
        {#await solution}
            <p>loading...</p> 
        {:then solution} 
            <table id="table-sudoku" class="printable">
                {#each sudoku as row, a}
                    <tr>
                        {#each row as num, a1}
                                {#if num == 0}
                                    <td><sup></sup><input class="ceil-{a1+1+9*a}" type="text" maxlength="0" on:keyup={function(e) {load()}} on:focus={function(e) {is_hinted(e)}}><sup></sup></td>  
                                {:else}
                                    <td><input class="ceil-{a1+1+9*a} default" type="text" value={num} disabled></td>
                                {/if}
                        {/each}
                    </tr>   
                {/each}
            </table>   
        {/await}     
    {/await}
    <section id="right-side-of-the-window" class="not-print">
        <button id="solve-btn" type="button" on:click={function(e) {auto_solve()}}>Solve</button>
        <br>

        <label>Hint: <input type="checkbox" name="hint-erase"></label>
        <br>
        <label>Erase: <input type="checkbox" name="hint-erase"></label>

        <table id="table-numbers">
            <tr>
                <td id="num-1">1</td>
                <td id="num-2">2</td>
                <td id="num-3">3</td>
            </tr>
            <tr>
                <td id="num-4">4</td>
                <td id="num-5">5</td>
                <td id="num-6">6</td>
            </tr>
            <tr>
                <td id="num-7">7</td>
                <td id="num-8">8</td>
                <td id="num-9">9</td>
            </tr>
        </table>
    </section>
</main>

<style media="print">
    main{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }
    #table-sudoku{
        border: 3px solid black;
        border-collapse: collapse;
        margin-bottom: 50px;
        margin-top: 50px;
    }
    #table-sudoku tr:nth-of-type(3n+1){
        border-top: 3px solid black;
    }
    #table-sudoku tr td:nth-of-type(3n){
        border-right: 3px solid black;
    }
    #table-sudoku td{
        border: 1px solid black;
        width: 50px;
        height: 50px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }
    #table-sudoku input{
        width: 30px;
        height: 30px;
        align-self: center;
        justify-self: center;
        font-size: 16px;
        text-align: center;
        font-weight:normal;
    }
    #table-sudoku sup{
        font-size: 10px;
        font-weight: normal;
        color: darkgray;
    }
    #table-sudoku input:focus{
        outline: none;
    }
    #table-sudoku input:disabled{
        font-weight: bold;
    }

    #table-sudoku input{
        background-color: white;
        color:black;
    }

    #table-numbers { 
        border-collapse: separate;
        border-spacing: 10px;
    }
    #table-numbers td{
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 16px;
        border: 1px solid black;
        color: white;
        background-color: gray;
    }

    #right-side-of-the-window{
        text-align: center;
    }
    #solve-btn{
        margin-bottom: 10px;
        font-size: 20px;
        border: 3px solid black;
        padding: 0 20px;
        transition-duration: 0.2s;
    }
    #solve-btn:hover{
        background-color: black;
        color: white;
        transition-duration: 0.2s;
    }

    #uploadFile{
        margin-top: 50px;
        margin-bottom: 50px;
        text-align: center;
        border: 1px solid black;
        padding: 10px;
        font-size: 12px;
    }

    @media print{
        .not-print{
            display: none;
        }
    }
</style>
