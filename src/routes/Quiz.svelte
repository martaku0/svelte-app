<script>
    async function getQuestionsJSON(){
        let response = await fetch("data/quiz.json");
        let responseJSON = await response.json();
        shuffle(responseJSON);
        return responseJSON;
    }

    function checkAnswer(answer, correct){
        if(answer == correct){
            score++;
        }
        Q_nr++;
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

    let questions = getQuestionsJSON();
    let Q_nr = 1;
    let score = 0;
</script>

<style>
    #answer-style:hover{
        cursor: pointer;
    }
</style>

<h1 style="padding: 10px; text-align: center; font-size: 36px;">Quiz</h1>

{#await questions}
    <p>loading...</p>
{:then questions}
{#if Q_nr <= questions.length}
    <div class="info" style="display: flex; justify-content: space-around;">
        <p>Pytanie {Q_nr}/{questions.length}</p>
        <p>{score} pkt</p>
    </div>
    <div class="main" style="display: flex; flex-direction: column; width: 50%; margin: auto; text-align: center; padding: 20px;">
        {#each questions.slice(Q_nr -1, Q_nr) as item}  
                <div class="question" style="text-align: center; padding: 20px; font-size: 32px;">
                    <p>{item.question}</p>
                </div>
                <div class="answers" style="display: flex; justify-content: center; justify-content: space-around; text-align: center;">
                    {#each item.answers as answ}
                        <button id="answer-style" on:click={() => checkAnswer(answ, item.correct)}>{answ}</button>
                    {/each}
                </div>
        {/each}
    </div> 
{:else}
    <div class="end-info" style="display: flex; flex-direction: column; width: 50%; margin: auto; text-align: center; padding: 20px;">
        <p style="font-size: 36px;">Koniec gry</p>
        <p>Punkty: {score}</p>
    </div>
{/if}
{/await}