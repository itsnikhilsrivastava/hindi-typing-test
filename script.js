const sampleText = "भारत एक विशाल लोकतांत्रिक देश है जहाँ विभिन्न धर्मों और संस्कृतियों के लोग प्रेम और सद्भाव के साथ रहते हैं। हिंदी भाषा हमारी एकता का प्रतीक है। सरकारी कार्यों में मंगल फोंट का प्रयोग अनिवार्य हो गया है। टाइपिंग में गति के साथ शुद्धता का होना अत्यंत आवश्यक है क्योंकि एक छोटी सी गलती पूरे वाक्य का अर्थ बदल सकती है। नियमित अभ्यास ही सफलता की कुंजी है।";

let timer, timeLeft, totalTimeInSeconds;
let isStarted = false;

const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');

// लोड टेक्स्ट
function init() {
    textDisplay.innerHTML = sampleText.split(' ').map(word => `<span>${word}</span>`).join(' ');
}

document.getElementById('start-btn').addEventListener('click', () => {
    const name = document.getElementById('user-name').value;
    if (!name) return alert("नाम भरें!");
    
    totalTimeInSeconds = parseInt(document.getElementById('time-limit').value);
    timeLeft = totalTimeInSeconds;
    
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('test-screen').classList.remove('hidden');
    init();
});

textInput.addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTimer();
    }
    matchWords();
});

function matchWords() {
    const wordsInDisplay = textDisplay.querySelectorAll('span');
    const typedWords = textInput.value.trim().split(/\s+/);
    let errors = 0;

    wordsInDisplay.forEach((span, i) => {
        const typedWord = typedWords[i];
        if (typedWord == null) {
            span.className = '';
        } else if (typedWord === span.innerText) {
            span.className = 'correct';
        } else {
            span.className = 'incorrect';
            errors++;
        }
    });
    
    document.getElementById('error-count').innerText = errors;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0'+sec : sec}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

function showResult() {
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const typedWords = textInput.value.trim().split(/\s+/);
    const grossWords = typedWords.length;
    const errorCount = parseInt(document.getElementById('error-count').innerText);
    
    // गणना नियम: 5 गलती माफ़, उसके बाद हर गलती पर 5 शब्द की कटौती
    let penaltyCount = 0;
    if (errorCount > 5) {
        penaltyCount = (errorCount - 5) * 5;
    }

    const netWords = Math.max(0, grossWords - penaltyCount);
    const timeInMinutes = totalTimeInSeconds / 60;
    const netSpeed = Math.round(netWords / timeInMinutes);

    // पासिंग नियम: 5 मिनट में 125 शब्द (यानी 25 WPM)
    const statusText = document.getElementById('status-text');
    if (netWords >= 125 && totalTimeInSeconds === 300) {
        statusText.innerText = "🎉 आप पास हो गए!";
        statusText.className = "pass";
    } else if (netSpeed >= 25) {
        statusText.innerText = "🎉 अच्छी स्पीड! (Pass)";
        statusText.className = "pass";
    } else {
        statusText.innerText = "❌ आप फेल हो गए! (मेहनत करें)";
        statusText.className = "fail";
    }

    document.getElementById('res-name').innerText = document.getElementById('user-name').value;
    document.getElementById('res-gross').innerText = grossWords;
    document.getElementById('res-errors').innerText = errorCount;
    document.getElementById('res-penalty').innerText = penaltyCount;
    document.getElementById('res-net').innerText = netWords;
    document.getElementById('res-speed').innerText = netSpeed;
}
