<!-- 
https://api.dictionaryapi.dev/api/v2/entries/en/anesthesia
https://api.api-ninjas.com/v1/randomword 
-->

<!-- aktualnie nie dziala -->
<script defer>
  import { loadWord, words, definitions } from "./../cross.js";


  $: arrayWords = [...$words];
  $: solutionCrossword = $loadWord;
  $: arrayDefinitions = [...$definitions];

  let timer1 = 0;
  let timer_interval;

  function isNumber(n) {
    if (!isNaN(n)) {
      return true;
    } else {
      return false;
    }
  }

  function isUpper(n) {
    if(n.toUpperCase() == n){
      return true;
    }
    return false;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  //setTimeout(overlay_loading, 20000); - ładuje krzyżówkę
  function overlay_loading(){    
    let rows_now = document.querySelectorAll('.result');
    let rows = document.querySelectorAll('tr');
    if(rows_now.length == Math.floor(rows.length/2))
    {
      timer_interval = setInterval(function(){
        timer1++;
      }, 1000);
      alph_fun();
      open3random();
      inputs_moving();
      document.getElementById("overlay-loading").style.display = "none";
    }
    else{
      location.reload();
    }
  }

  function open3random(){
    let rows = document.querySelectorAll('tr');
    for(let i = 0; i<(rows.length/2)-1; i++){
      let hm = getRandomInt(0,3);
      let hm_already = 0;
      let tds = rows[i];
      let children_no = tds.childElementCount;
      while(hm_already <= hm){
        let open = tds.children[getRandomInt(1,children_no-1)];
        if(open != null){
          open_el(open);
        }
        hm_already++;
      }
    }
  }

  function open_el(element){
    if(!element.classList.contains('opened')){
      element.classList.add('opened');
      if(element.children[0].classList[0] != undefined){
        let inp = element.children[0];
        let letter = inp.classList[0];
        inp.remove();
        let new1 = document.createElement('span');
        new1.classList.add(`${letter}`);
        new1.innerHTML = letter;
        if(element.children[0] != undefined){
          element.insertBefore(new1, element.children[0]);
          check_word(element.parentNode);
          if(!element.classList.contains("result")){
            let res = document.querySelector(`.result-${element.children[0].innerHTML}`);
            open_el(res);
          }
        }
        else{
          element.appendChild(new1);
          check_word(element.parentNode);
        }
      }
    }
    check_result();
  }

  function alph_fun(){
    let alph = document.querySelectorAll('#alphabet > div');
    alph.forEach(el => {
      el.addEventListener("click", (e) => {
        let l = el.innerHTML;
        el.classList.add("disable");
        let letters_arr = document.querySelectorAll(`.${l}`);
        letters_arr.forEach(el1 => {
          if(el1.parentNode != null){
            open_el(el1.parentNode);
          }
        });
      });
    });
  }

  function inputs_moving(){
    let inp = document.querySelectorAll("input");
    inp.forEach((element, key) => {
        element.addEventListener("keyup", (e) => {
          if(e.keyCode >= 65 && e.keyCode <= 90){
              inp[key].value = e.key
              if (element.value.length == element.maxLength + 1) {
                  if(key + 1 != inp.length) {
                      inp[key+1].focus()
                  }else
                  {
                      inp[key].blur()
                  }
              }
              let parent = element.parentNode.parentNode;
              check_word(parent);
          }
        });
        element.addEventListener("keypress", (e) => {
          if(e.key === "Enter"){
            let index = parseInt(element.parentElement.parentElement.classList[0]);
            let i = 0;
            let next = undefined;
            while(next == undefined){
              i++;
              if(index+i > Math.floor(document.querySelectorAll("tr").length/2)-1){
                index = 0;
                i = 0;
                next = document.getElementsByClassName(`${index+i}`)[0].querySelectorAll("input")[0];
              }
              else{
                next = document.getElementsByClassName(`${index+i}`)[0].querySelectorAll("input")[0];
              }
            }
            next.focus();
          }
        });
        element.addEventListener( 'keydown', ( event ) => {
          let currentInput = document.activeElement;
          let no_input = currentInput.id.slice(-1);
          let currentTd = currentInput.parentElement;
          let currentTr = currentTd.parentElement;
          let no_word = currentTr.classList[0];
          let next;
          let i = 0;
          switch (event.key) {
            case "ArrowLeft":
              while(i <= currentTr.childElementCount-1){
                i++;
                next = document.getElementById(`input-${no_word}-${parseInt(no_input)-i}`);
                if(next != undefined){
                  break;
                }
              }
              if(next != undefined){  
                next.focus();
              }
              break;
            case "ArrowRight":
              while(i <= currentTr.childElementCount-1){
                i++;
                next = document.getElementById(`input-${no_word}-${parseInt(no_input)+i}`);
                if(next != undefined){
                  break;
                }
              }
              if(next != undefined){  
                next.focus();
              }
              break;
            case "ArrowUp":
              while(i <= document.querySelectorAll("tr").length-2){
                i++;
                next = document.getElementById(`input-${parseInt(no_word)-i}-${no_input}`);
                if(next != undefined){
                  break;
                }
              }
              if(next != undefined){  
                next.focus();
              }
              break;
            case "ArrowDown":
              while(i <= document.querySelectorAll("tr").length-2){
                i++;
                next = document.getElementById(`input-${parseInt(no_word)+i}-${no_input}`);
                if(next != undefined){
                  break;
                }
              }
              if(next != undefined){  
                next.focus();
              }
              break;
          }
        });
    });
  }

    
  function check_word(p){
    let letters = p.children;
    if(letters.length > 0){
      for(let k = 0; k<letters.length; k++)
      {
        if(letters[k].tagName === "SUB"){
          letters.remove(letters[k]);
        }
      }
      let l = letters.length;
      let i_check = 0;
      let i_real = letters.length-1;
      for(let k = 1; k<letters.length; k++)
      {
        if(check_letter(letters[k].children[0])){
          i_check++;
        }
      }
      if(i_check == i_real){
        for(let k = 1; k<l; k++)
        {
          letters[k].classList.add("correct");
          open_el(letters[k]);
        }
      }
    }
    
  }

  function check_letter(l){
    if(l.tagName === "INPUT"){
      if(l.classList[0] == l.value){
        return true;
      }
    }
    else{
      if(l.classList[0] == l.innerHTML){
        return true;
      }
    }
    return false;
  }

  function check_result(){
    let letters_all = document.querySelectorAll(".not-result").length;
    let letters_correct = document.querySelectorAll(".correct").length;
    if(letters_all == letters_correct){
      win();
    }
  }

  function win(){
    let overlay = document.getElementById("overlay-end");
    overlay.style.display = "block";
    confetti();
    clearInterval(timer_interval);
  }

function confetti(){
  var random = Math.random
    , cos = Math.cos
    , sin = Math.sin
    , PI = Math.PI
    , PI2 = PI * 2
    , timer = undefined
    , frame = undefined
    , confetti = [];

  var particles = 10
    , spread = 40
    , sizeMin = 3
    , sizeMax = 12 - sizeMin
    , eccentricity = 10
    , deviation = 100
    , dxThetaMin = -.1
    , dxThetaMax = -dxThetaMin - dxThetaMin
    , dyMin = .13
    , dyMax = .18
    , dThetaMin = .4
    , dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function() {
      return color(200 * random()|0, 200 * random()|0, 200 * random()|0);
    }, function() {
      var black = 200 * random()|0; return color(200, black, black);
    }, function() {
      var black = 200 * random()|0; return color(black, 200, black);
    }, function() {
      var black = 200 * random()|0; return color(black, black, 200);
    }, function() {
      return color(200, 100, 200 * random()|0);
    }, function() {
      return color(200 * random()|0, 200, 200);
    }, function() {
      var black = 256 * random()|0; return color(black, black, black);
    }, function() {
      return colorThemes[random() < .5 ? 1 : 2]();
    }, function() {
      return colorThemes[random() < .5 ? 3 : 5]();
    }, function() {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];
  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function interpolation(a, b, t) {
    return (1-cos(PI*t))/2 * (b-a) + a;
  }
  var radius = 1/eccentricity, radius2 = radius+radius;
  function createPoisson() {
    var domain = [radius, 1-radius], measure = 1-radius2, spline = [0, 1];
    while (measure) {
      var dart = measure * random(), i, l, interval, a, b, c, d;
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i+1], interval = b-a;
        if (dart < measure+interval) {
          spline.push(dart += a-measure);
          break;
        }
        measure += interval;
      }
      c = dart-radius, d = dart+radius;
      for (i = domain.length-1; i > 0; i -= 2) {
        l = i-1, a = domain[l], b = domain[i];
        if (a >= c && a < d)
          if (b > d) domain[l] = d; 
          else domain.splice(l, 2);
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; 
          else domain.splice(i, 0, c, d); 
      }
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i+1]-domain[i];
    }
    return spline.sort();
  }
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top      = '0';
  container.style.left     = '0';
  container.style.width    = '100%';
  container.style.height   = '0';
  container.style.overflow = 'visible';
  container.style.zIndex   = '9999';
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);
    var outerStyle = this.outer.style, innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width  = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width  = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();
    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';
    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top  = this.y + 'px';
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length-1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();
    this.update = function(height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;
      var phi = this.frame % 7777 / 7777, i = 0, j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi-this.splineX[i]) / (this.splineX[j]-this.splineX[i])
      );
      phi *= PI2;
      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top  = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height+deviation;
    };
  }
  function poof() {
    if (!frame) {
      document.body.appendChild(container);
      var theme = colorThemes[0]
        , count = 0;
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })();
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = window.innerHeight;
        for (var i = confetti.length-1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }
        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  poof();
};

</script>

<h1 style="padding: 10px; text-align: center; font-size: 36px;">Crossword</h1>

<div id="overlay-loading">
  <h2>Loading...</h2>
</div>
<div id="overlay-end">
  <h2>Congratulations!</h2>
  <p id="time">Time: {timer1}s</p>
  <div class="js-container container" style="top:0px !important;"></div>
</div>

<main>

  <section id="left">
      <table id="crossword">
        {#each arrayWords as word, i}
          <tr class="{i.toString()}">
            <td class="td-number">{i + 1}.</td>
            {#each word as letter, j}
              {#if !isNumber(letter)}
                {#if j == word.length-1}
                  {#if isUpper(letter)}
                    <td class="indexed not-result"><input class="{letter.toLowerCase()} word{i} indexed last input-{i}" id="input-{i}-{j}" maxlength="0" /><sub>{i+1}</sub></td>
                  {:else}
                    <td class="not-result"><input class="{letter} word{i} last input-{i}" id="input-{i}-{j}" maxlength="0" /></td> 
                  {/if}
                {:else}
                  {#if isUpper(letter)}
                    <td class="indexed not-result"><input class="{letter.toLowerCase()} word{i} indexed input-{i}" id="input-{i}-{j}" maxlength="0" /><sub>{i+1}</sub></td>
                  {:else}
                    <td class="not-result"><input class="{letter} word{i} input-{i}" id="input-{i}-{j}" maxlength="0" /></td> 
                  {/if}
                {/if}
              {/if}
            {/each}
          </tr>
        {/each}
      </table>

  </section>

  <section id="right">

      <table id="defins">
        {#each arrayDefinitions as def, i}
          <tr><td>{i + 1}. {def}</td></tr>
        {/each}
      </table>
  
  </section>

</main>
<table id="word">
  <tr>
    {#each solutionCrossword as letter, i}
      <td class="result result-{letter} result-{i+1}"><span class="{letter}">&nbsp;&nbsp;</span><sub>&nbsp;&nbsp;{i + 1}</sub></td>
    {/each}
  </tr>
</table>
<div id="alphabet">
  <div id="letter-a">a</div>
  <div id="letter-b">b</div>
  <div id="letter-c">c</div>
  <div id="letter-d">d</div>
  <div id="letter-e">e</div>
  <div id="letter-f">f</div>
  <div id="letter-g">g</div>
  <div id="letter-h">h</div>
  <div id="letter-i">i</div>
  <div id="letter-j">j</div>
  <div id="letter-k">k</div>
  <div id="letter-l">l</div>
  <div id="letter-m">m</div>
  <div id="letter-n">n</div>
  <div id="letter-o">o</div>
  <div id="letter-p">p</div>
  <div id="letter-q">q</div>
  <div id="letter-r">r</div>
  <div id="letter-s">s</div>
  <div id="letter-t">t</div>
  <div id="letter-u">u</div>
  <div id="letter-v">v</div>
  <div id="letter-w">w</div>
  <div id="letter-x">x</div>
  <div id="letter-y">y</div>
  <div id="letter-z">z</div>
</div>

<style>
  #alphabet{
    display: flex;
    flex-direction: row;
    font-size: 24px;
    flex-wrap: wrap;
    width: 700px;
    margin: auto;
    margin-top: 50px;
    text-align: center;
    justify-content: center;
    font-weight: bold;
  }
  #alphabet > div{
    margin: 10px;
    width: 50px;
    padding: 10px;
    background-color: antiquewhite;
    border-radius: 20px;
    align-content: center;
    justify-content: center;
  }
  .disable{
    background-color: lightgray !important;
  }
  .disable:hover{
    background-color: lightgray !important;
    cursor:not-allowed !important;
  }
  #alphabet > div:hover{
    background-color: rgb(255, 215, 166);
    cursor: pointer;
  }
  .opened{
    background-color: rgb(223, 223, 223);
  }
  td {
    border: 1px solid black;
  }
  table {
    margin: auto;
  }
  input {
    width: 40px;
    text-align: center;
  }
  input:focus {
    outline: none;
  }
  td {
    width: 70px;
    height: 70px;
    text-align: center;
    font-size: 24px;
    background-color: white;
  }
  #word {
    margin-top: 40px;
  }
  #word td, .correct{
    background-color: rgb(211, 255, 145) !important;
  }
  .td-number{
    background-color: rgb(66, 66, 66);
    color: white !important;
  }
  #defins td {
    width: 700px;
    font-size: 18px;
    text-align: left;
    padding: 10px;
    border: none;
  }
  #crossword,
  #defins {
    margin-top: 50px;
  }
  sub {
    font-size: 12px;
  }
  main {
    display: flex;
    justify-content: space-around;
  }
  .indexed{
    background-color: rgb(188, 255, 232);
  }

  #overlay-loading,
  #overlay-end {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      font-size: 36px;
  }

  #overlay-loading h2, #overlay-end h2{
    color: white;
    text-align: center;
    margin-top: 16vw;
  }

  #overlay-loading{
    display: block;
  }

  #overlay-end{
    display: none;
    text-align: center;
    color: white;
  }
</style>
