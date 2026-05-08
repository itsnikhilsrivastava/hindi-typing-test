const passages = [
    "भारत एक महान देश है जहाँ विभिन्न धर्मों के लोग मिलजुल कर रहते हैं। इसकी संस्कृति बहुत पुरानी और समृद्ध है। हिमालय पहाड़ उत्तर में इसकी रक्षा करता है।",
    "डिजिटल इंडिया मिशन ने भारत के कोने कोने में इंटरनेट पहुँचा दिया है। अब सरकारी सेवाएँ ऑनलाइन उपलब्ध हैं जिससे भ्रष्टाचार कम हुआ है और पारदर्शिता बढ़ी है।",
    "सफलता पाने के लिए कठिन परिश्रम और निरंतर अभ्यास की आवश्यकता होती है। टाइपिंग की परीक्षा में धैर्य बनाए रखना सबसे महत्वपूर्ण है ताकि गलतियाँ कम हों।",
    "हिंदी हमारे देश की राजभाषा है। मंगल फोंट का प्रयोग कंप्यूटर पर टाइपिंग के लिए अत्यंत सरल और प्रभावी है। हमें अपनी भाषा का सम्मान करना चाहिए।"
];

let words = [];
let currentWordIndex = 0;
let timer, timeLeft, totalTime;
let errors = 0, correctWords = 0;
let isStarted = false;

const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');

// शुरुआत करना
function startTest() {
    const name = document.getElementById('user-name').value.trim();
    if (!name) return alert("नाम लिखें!");

    totalTime = parseInt(document.getElementById('time-limit').value);
    timeLeft = totalTime;
    document.getElementById('display-name').innerText = name;
    
    // रैंडम पैसेज चुनना
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    words = randomPassage.split(' ');
    
    renderWords();
    
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('test-screen').classList.remove('hidden');
    textInput.focus();
}

function renderWords() {
    textDisplay.style.fontSize = document.getElementById('font-size-select').value;
    textDisplay.innerHTML = words.map((word, i) => `<span class="word" id="word-${i}">${word}</span>`).join('');
    highlightWord();
}

function highlightWord() {
    const prevWord = document.getElementById(`word-${currentWordIndex - 1}`);
    const activeWord = document.getElementById(`word-${currentWordIndex}`);
    
    if(prevWord) prevWord.classList.remove('current-word');
    if(activeWord) {
        activeWord.classList.add('current-word');
        // ऑटो स्क्रॉल लॉजिक
        activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

textInput.addEventListener('keydown', (e) => {
    if (!isStarted) {
        startTimer();
        isStarted = true;
    }

    // जब यूजर स्पेस दबाता है
    if (e.code === 'Space') {
        e.preventDefault();
        const typedValue = textInput.value.trim();
        const targetWord = words[currentWordIndex];
        const wordElement = document.getElementById(`word-${currentWordIndex}`);

        if (typedValue === targetWord) {
            wordElement.classList.add('correct');
            correctWords++;
        } else {
            wordElement.classList.add('incorrect');
            errors++;
        }

        textInput.value = "";
        currentWordIndex++;
        
        if (currentWordIndex >= words.length) {
            endTest();
        } else {
            highlightWord();
        }
    }
});

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0'+sec : sec}`;
        
        // लाइव WPM गणना
        let timePassed = (totalTime - timeLeft) / 60;
        let liveWpm = Math.round(correctWords / timePassed);
        document.getElementById('live-wpm').innerText = isFinite(liveWpm) ? liveWpm : 0;

        if (timeLeft <= 0) endTest();
    }, 1000);
}

document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('submit-btn').addEventListener('click', endTest);

function endTest() {
    clearInterval(timer);
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    // सरकारी नियम: 5 गलती माफ, फिर 1 गलती = -5 शब्द
    let penalty = errors > 5 ? (errors - 5) * 5 : 0;
    let netWords = Math.max(0, correctWords - penalty);
    let speed = Math.round(netWords / (totalTime / 60));

    document.getElementById('result-data').innerHTML = `
        <div>नाम: <strong>${document.getElementById('user-name').value}</strong></div>
        <div>कुल शब्द: <strong>${correctWords + errors}</strong></div>
        <div>सही शब्द: <strong>${correctWords}</strong></div>
        <div>गलत शब्द: <strong>${errors}</strong></div>
        <div>पेनल्टी: <strong>-${penalty}</strong></div>
        <div>नेट स्पीड: <strong style="font-size:24px; color:blue;">${speed} WPM</strong></div>
    `;

    const statusMsg = document.getElementById('status-message');
    if (speed >= 25) {
        statusMsg.innerText = "परीक्षा में पास! (Qualified)";
        statusMsg.style.color = "green";
    } else {
        statusMsg.innerText = "असफल! (Not Qualified)";
        statusMsg.style.color = "red";
    }
}
