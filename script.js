// बहुत बड़ा पैसेज (इसे आप और भी बढ़ा सकते हैं)
const largePassage = "भारत एक प्राचीन और महान देश है। यहाँ की मिट्टी में त्याग और तपस्या की महक बसी है। आधुनिक भारत आज विज्ञान और तकनीक के क्षेत्र में नए आयाम स्थापित कर रहा है। हिंदी भाषा हमारी संस्कृति की संवाहक है और मंगल फोंट का उपयोग आजकल डिजिटल इंडिया के दौर में बहुत महत्वपूर्ण हो गया है। कंप्यूटर पर हिंदी टाइपिंग सीखना न केवल सरकारी नौकरियों के लिए आवश्यक है बल्कि यह हमारे विचारों को मातृभाषा में व्यक्त करने का एक सशक्त माध्यम भी है। टाइपिंग में गति और शुद्धता प्राप्त करने के लिए नियमित अभ्यास की आवश्यकता होती है। यदि आप प्रतिदिन कम से कम एक घंटा अभ्यास करते हैं, तो आपकी टाइपिंग स्पीड में निश्चित ही सुधार होगा। परीक्षा के समय घबराना नहीं चाहिए और अपनी एकाग्रता को बनाए रखना चाहिए। याद रखें कि अभ्यास ही सफलता की एकमात्र कुंजी है। भारत की विविधता में एकता ही हमारी सबसे बड़ी शक्ति है। हमें अपने देश की विरासत पर गर्व होना चाहिए और इसे और बेहतर बनाने के लिए निरंतर कार्य करना चाहिए। डिजिटल युग में भाषा की कोई सीमा नहीं है और हिंदी वैश्विक स्तर पर अपनी पहचान बना रही है।";

let timer, timeLeft, totalTimeAllowed;
let isStarted = false;

// Elements
const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');
const fontSizeSelect = document.getElementById('font-size-select');

function initTest() {
    const fontSize = fontSizeSelect.value;
    textDisplay.style.fontSize = fontSize;
    textDisplay.innerHTML = largePassage.split(' ').map(word => `<span>${word}</span>`).join(' ');
    textInput.value = "";
}

document.getElementById('start-btn').addEventListener('click', () => {
    const name = document.getElementById('user-name').value.trim();
    if (!name) return alert("कृपया अपना नाम लिखें!");
    
    totalTimeAllowed = parseInt(document.getElementById('time-limit').value);
    timeLeft = totalTimeAllowed;
    document.getElementById('display-name').innerText = name;
    
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('test-screen').classList.remove('hidden');
    initTest();
});

textInput.addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTimer();
    }
    compareText();
});

// मैनुअल सबमिट बटन
document.getElementById('submit-btn').addEventListener('click', () => {
    if(confirm("क्या आप टेस्ट समाप्त करना चाहते हैं?")) {
        endTest();
    }
});

function compareText() {
    const spans = textDisplay.querySelectorAll('span');
    const typedWords = textInput.value.trim().split(/\s+/);
    let errors = 0;

    spans.forEach((span, i) => {
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
    document.getElementById('live-errors').innerText = errors;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0'+sec : sec}`;
        
        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const typedWords = textInput.value.trim().split(/\s+/);
    const grossWords = typedWords[0] === "" ? 0 : typedWords.length;
    const errorCount = parseInt(document.getElementById('live-errors').innerText);
    
    // पेनल्टी नियम: 5 गलती की छूट, उसके बाद 1 गलती = 5 शब्द की कटौती
    let penalty = 0;
    if (errorCount > 5) {
        penalty = (errorCount - 5) * 5;
    }

    const netWords = Math.max(0, grossWords - penalty);
    const timeSpentMin = (totalTimeAllowed - timeLeft) / 60;
    const wpm = timeSpentMin > 0 ? Math.round(netWords / timeSpentMin) : 0;

    // रिजल्ट प्रदर्शन
    document.getElementById('res-name').innerText = document.getElementById('user-name').value;
    document.getElementById('res-gross').innerText = grossWords;
    document.getElementById('res-errors').innerText = errorCount;
    document.getElementById('res-penalty').innerText = penalty;
    document.getElementById('res-net').innerText = netWords;
    document.getElementById('res-speed').innerText = wpm;

    // पास/फेल लॉजिक (5 मिनट में 125 नेट शब्द = 25 WPM)
    const statusIcon = document.getElementById('status-icon');
    const statusMsg = document.getElementById('status-message');
    
    if (netWords >= 125 && totalTimeAllowed >= 300) {
        statusIcon.innerText = "🏆";
        statusMsg.innerText = "बधाई हो! आप परीक्षा में पास हो गए।";
        statusMsg.style.color = "green";
    } else {
        statusIcon.innerText = "📑";
        statusMsg.innerText = "प्रयास जारी रखें! आपको और अभ्यास की जरूरत है।";
        statusMsg.style.color = "red";
    }
}
