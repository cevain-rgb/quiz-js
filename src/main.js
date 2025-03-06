import './style.css'

import { Questions }  from  './questions';

const app = document.querySelector('#app');

const startButton = document.querySelector('#start');

startButton.addEventListener('click', startQuiz);


function startQuiz(event) {
    let currentQuestion = 0;
    let score = 0;

    displayQuestion(currentQuestion);

    function clean(){
        while (app.firstElementChild) {
            app.firstElementChild.remove();
            // console.log("supprimer");
        }
        const progress = getProgressBar(Questions.length, currentQuestion);
        app.appendChild(progress);
    }

    function getProgressBar(max, value) {
        const progress = document.createElement("progress");
        progress.setAttribute("max", max);
        progress.setAttribute("value", value);
        return progress;
    }

    function displayQuestion(index){
        clean();
        const question = Questions[index];

        if(!question) {
            //finish quiz
            displayFinishMessage();
            return;
        }

        const title = getTitleElement(question.question);
        app.appendChild(title);
        const answerDiv = creatAnswers(question.answers);
        app.appendChild(answerDiv);

        const submitButton = getSubmitButton();

        submitButton.addEventListener('click', submit);

        app.appendChild(submitButton);
    }

    function displayFinishMessage() {
        const h1 = document.createElement('h1');
        h1.innerText = 'Bravo tu as terminé le quiz';
        const p = document.createElement('p');
        p.innerText = `Tu as eu ${score} sur ${Questions.length} points!`;

        app.appendChild(h1);
        app.appendChild(p);
    }

    function submit() {
        const selectAnswer = app.querySelector('input[name="answer"]:checked');

        const question = Questions[currentQuestion];
        
        const value = selectAnswer.value;

        const isCorrect = question.correct === value;
        
        if (isCorrect) {
            score ++;
        }
        displayNextQuestionButton( () => {
            currentQuestion ++;
            displayQuestion(currentQuestion);
        });

        showFeedBack(isCorrect, question.correct, value);
        const feedBack = getFeedBackMessage(isCorrect, question.correct);
        app.appendChild(feedBack);

    }

    function creatAnswers(answers) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add("answers");

        for (const answer of answers) {
            const label = getAnswerElement(answer);
            answerDiv.appendChild(label);
        }

        return answerDiv;
    }
}

function getTitleElement(text) {
    const title = document.createElement('h3');
    title.innerHTML = text;

    return title;
}

function formatId(text) {
    return text.replaceAll(" ", "-").toLowerCase();
    
}
function getAnswerElement(text) {
    const label = document.createElement("label");
    label.innerHTML = text;
    const input = document.createElement("input");
    let id = formatId(text);
    input.id = id;
    label.htmlFor = id;
    input.setAttribute("type", "radio");
    input.setAttribute("name", "answer");
    input.setAttribute("value", text);
    label.appendChild(input);
    return label;
}

function getSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.id = 'submit';
    submitButton.innerText = 'valider';
    return submitButton;
}

function showFeedBack(isCorrect, correct, answer) {
    const correctAnswerId = formatId(correct);
    const correctElement = document.querySelector(
        `label[for='${correctAnswerId}']`
    );
    
    const selectedAnswerId = formatId(answer);
    const selectedElement = document.querySelector(
        `label[for='${selectedAnswerId}']`
    );

    correctElement.classList.add("correct");
    selectedElement.classList.add(isCorrect? "correct" : "incorrect");
}

function getFeedBackMessage(isCorrect, correct) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = isCorrect
    ? "Tu as eu la bonne reponse" 
    : `Desole... mais la bonne reponse etait ${correct}`;
    return paragraph;
}

function displayNextQuestionButton(callBack) {
    const TIMEOUT = 4000;
    let remainingTimeout  = TIMEOUT;
    disableAllAnswer();

    document.querySelector('button').remove();

    const getNextButtonText = () => `Next (${remainingTimeout / 1000})`;

    const nextButton = document.createElement('button');
    nextButton.innerText = getNextButtonText();
    app.appendChild(nextButton);

    const interval = setInterval(() => {
        remainingTimeout -= 1000;
        nextButton.innerText = `${getNextButtonText()}`;
    }, 1000);

    const timeout = setTimeout(() => {
        handleNextQuestion();
    }, TIMEOUT);

    const handleNextQuestion = () => {
        clearInterval(interval);
        clearTimeout(timeout);
        callBack();
    };

    nextButton.addEventListener('click', handleNextQuestion);
}

function disableAllAnswer() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');

    for(const radio of radioInputs)
        radio.disabled = true;

}