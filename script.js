let surveyFlow = [];
let currentStep = 0;
let answers = {};

// ----- Welcome Screen -----
function showWelcome() {
  document.getElementById("formArea").innerHTML = `
    <h2>🐾 Welcome to Pettxo!</h2>
    <p>This 2-minute survey helps us build the future of pet care. Your answers shape Pettxo.</p>
    <button onclick="startSurvey()" id="startBtn">Start</button>
  `;
  document.getElementById("prevBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
}

// ----- Start Survey -----
function startSurvey() {
  surveyFlow = ["q1"]; // Always start from Q1
  currentStep = 0;
  renderQuestion(surveyFlow[currentStep]);

  // hide Start button permanently
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("prevBtn").style.display = "none";
}

// ----- Render a Question -----
function renderQuestion(qId) {
  const q = questions[qId];
  if (!q) return;

  let optionsHTML = "";
  if (q.type === "multiple") {
    q.options.forEach(opt => {
      optionsHTML += `<div><input type="radio" name="${qId}" value="${opt}" 
        ${answers[qId]===opt ? "checked" : ""}> ${opt}</div>`;
    });
  } else if (q.type === "multi") {
    q.options.forEach(opt => {
      const checked = answers[qId] && answers[qId].includes(opt) ? "checked" : "";
      optionsHTML += `<div><input type="checkbox" name="${qId}" value="${opt}" ${checked}> ${opt}</div>`;
    });
  } else if (q.type === "text") {
    optionsHTML = `<input type="text" name="${qId}" value="${answers[qId]||""}">`;
  } else if (q.type === "longtext") {
    optionsHTML = `<textarea name="${qId}">${answers[qId]||""}</textarea>`;
  }

  document.getElementById("formArea").innerHTML = `
    <h3>${q.text}</h3>
    <div>${optionsHTML}</div>
  `;

  document.getElementById("prevBtn").style.display = currentStep > 0 ? "inline-block" : "none";
  document.getElementById("nextBtn").style.display = "inline-block";
}

// ----- Save Answer -----
function saveAnswer() {
  const qId = surveyFlow[currentStep];
  const q = questions[qId];

  if (q.type === "multiple") {
    const selected = document.querySelector(`input[name="${qId}"]:checked`);
    if (selected) answers[qId] = selected.value;
  } else if (q.type === "multi") {
    const selected = [...document.querySelectorAll(`input[name="${qId}"]:checked`)].map(el => el.value);
    answers[qId] = selected;
  } else if (q.type === "text" || q.type === "longtext") {
    const input = document.querySelector(`[name="${qId}"]`);
    answers[qId] = input.value;
  }
}

// ----- Next -----
function goNext() {
  saveAnswer();

  // if last question, show thank you
  if (currentStep === surveyFlow.length - 1) {
    showThankYou();
    return;
  }

  currentStep++;
  renderQuestion(surveyFlow[currentStep]);
}

// ----- Previous -----
function goBack() {
  saveAnswer();
  if (currentStep > 0) {
    currentStep--;
    renderQuestion(surveyFlow[currentStep]);
  }
}

// ----- Thank You -----
function showThankYou() {
  document.getElementById("formArea").innerHTML = `
    <h2>🎉 Thank you for helping shape Pettxo!</h2>
    <p>We’ll keep you updated. Follow us on Instagram <b>@pettxo</b> for sneak peeks.</p>
    <a href="https://pettxo.com" target="_blank"><button>Visit Pettxo.com</button></a>
  `;
  document.getElementById("prevBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";

  console.log("Survey Answers:", answers);
}

// ----- Questions Tree (simplified for demo) -----
const questions = {
  q1: {
    text: "Do you currently own a pet?",
    type: "multiple",
    options: ["Yes", "No, but planning to get one soon", "No, and not planning to get one"]
  }
  // You can extend full tree flow here...
};

// Load welcome on page load
window.onload = showWelcome;