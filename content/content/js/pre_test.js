// Check if the user is still logged in
// Firebase Configuration
const firebaseConfig = 
{
apiKey: "AIzaSyBrBLIYoqy09phhRa1RbViQO8BlaLMblRo",
authDomain: "pro121-bcffe.firebaseapp.com",
projectId: "pro121-bcffe",
storageBucket: "pro121-bcffe.firebasestorage.app",
messagingSenderId: "507255926995",
appId: "1:507255926995:web:ca1794ed489bac38ab2426" 
};

/*************************************************************************************************/
// ========= Firebase Initialization =========
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// ========= Quiz Data and Variables =========
const quizData = [
  {
    header: "اختبار المعرفة العامة",
    question: "ما هي عاصمة فرنسا؟",
    options: ["باريس", "لندن", "برلين", "مدريد"],
    answer: "باريس",
    feedback: "باريس هي عاصمة فرنسا."
  },
  {
    header: "اختبار المعرفة العامة",
    question: "من كتب 'هاملت'؟",
    options: ["ويليام شكسبير", "تشارلز ديكنز", "مارك توين", "جي. كي. رولينغ"],
    answer: "ويليام شكسبير",
    feedback: "ويليام شكسبير مشهور بكتابة 'هاملت'."
  },
  {
    header: "article",    
    question: "ما هو أكبر كوكب في نظامنا الشمسي؟",
    options: ["المشتري", "زحل", "الأرض", "المريخ"],
    answer: "المشتري",
    feedback: "المشتري هو أكبر كوكب في نظامنا الشمسي."
  },
  {
    header: "اختبار المعرفة العامة",
    question: "ما العنصر الذي يرمز له بالحرف 'O'؟",
    options: ["الأكسجين", "الهيدروجين", "الكربون", "النيتروجين"],
    answer: "الأكسجين",
    feedback: "الأكسجين يرمز له بالحرف 'O'."
  },
  {
    header: "article",
    question: "ما هي عملة اليابان؟",
    options: ["ين", "دولار", "يورو", "وون"],
    answer: "ين",
    feedback: "عملة اليابان هي الين."
  }
];

let currentQuestionIndex = 0; // Track the current question
let userAnswers = [];         // Store user answers for review
let correctAnswersCount = 0;   // Count correct answers

// ========= Helper Function =========
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ========= Quiz Flow Functions =========

function loadQuiz() {
  shuffle(quizData);
  displayQuestion();
}

function displayQuestion() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  const item = quizData[currentQuestionIndex];
  const questionCard = document.createElement('div');
  questionCard.classList.add('mb-3');

  // Display header only if it exists and is not "article".
  if (item.header && item.header !== "article") {
    const headerElem = document.createElement('h6');
    headerElem.classList.add('text-secondary');
    headerElem.textContent = item.header;
    questionCard.appendChild(headerElem);
  }

  // Create the question title.
  const questionTitle = document.createElement('h5');
  questionTitle.textContent = `س${currentQuestionIndex + 1}: ${item.question}`;
  questionCard.appendChild(questionTitle);

  // Check if the question should use an input field (if header equals "article").
  if (item.header === "article") {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList.add('form-control');
    inputField.placeholder = 'اكتب إجابتك هنا...';
    inputField.id = 'answer-input';
    questionCard.appendChild(inputField);
  } else {
    // Otherwise, display radio button options.
    shuffle(item.options);
    item.options.forEach((option) => {
      const optionLabel = document.createElement('label');
      optionLabel.classList.add('form-check-label');

      const optionInput = document.createElement('input');
      optionInput.classList.add('form-check-input');
      optionInput.setAttribute('type', 'radio');
      optionInput.setAttribute('name', 'question');
      optionInput.setAttribute('value', option);
      optionInput.onclick = () => handleAnswer(option);

      // Append radio input before the text.
      optionLabel.appendChild(optionInput);
      optionLabel.append(` ${option}`);

      const optionWrapper = document.createElement('div');
      optionWrapper.classList.add('form-check');
      optionWrapper.appendChild(optionLabel);

      questionCard.appendChild(optionWrapper);
    });
  }

  quizContainer.appendChild(questionCard);

  // Update Next button text.
  document.getElementById('next-btn').textContent =
    currentQuestionIndex === quizData.length - 1 ? "إرسال" : "التالي";

  // Update Previous button state.
  const prevButton = document.getElementById('prev-btn');
  prevButton.disabled = (currentQuestionIndex === 0);
}


function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function nextQuestion() {
  // If the current question uses an input field (header is "article"), capture the input value.
  if (quizData[currentQuestionIndex].header === "article") {
    const inputField = document.getElementById('answer-input');
    if (inputField) {
      userAnswers[currentQuestionIndex] = inputField.value.trim();
    }
  }
  
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    displayQuestion();
  } else {
    document.getElementById('next-btn').classList.add('hidden'); // Hide Next button
    document.getElementById('prev-btn').classList.add('hidden'); // Hide Previous button
    document.getElementById('review-btn').classList.remove('hidden'); // Show Review button
    showResults();
  }
}

function handleAnswer(selectedValue) {
  // For radio buttons (questions after the first two), store the answer.
  userAnswers[currentQuestionIndex] = selectedValue;
  // (No immediate feedback is shown.)
}

function showResults() {
  const resultContainer = document.getElementById('result');
  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `لقد أجبت بشكل صحيح على ${correctAnswersCount} من ${quizData.length} أسئلة.`;
  // Store the result in Firestore.
  storeQuizResults();
}

function reviewQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  quizData.forEach((item, index) => {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('mb-3');

    const questionTitle = document.createElement('h5');
    questionTitle.textContent = `س${index + 1}: ${item.question}`;
    reviewCard.appendChild(questionTitle);

    // Display only the user's answer.
    const userAnswer = userAnswers[index] || "لم يتم اختيار إجابة";
    const answerDisplay = document.createElement('p');
    answerDisplay.innerHTML = `إجابتك: <strong>${userAnswer}</strong>`;
    reviewCard.appendChild(answerDisplay);

    quizContainer.appendChild(reviewCard);
  });

  // Hide the review and navigation buttons after reviewing.
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
}

function storeQuizResults() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  const quizResultRef = db.collection("pretest").doc(currentUser.email);

  quizResultRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        displayQuizResult("لقد قمت بالإجابة على الاختبار مسبقاً ولا يمكنك المحاولة مرة أخرى.", true);
        const submitButton = document.querySelector("#next-btn");
        if (submitButton) {
          submitButton.disabled = true;
        }
        return;
      } else {
        const resultData = {
          uid: currentUser.uid,
          name: currentUser.displayName || "غير متوفر",
          email: currentUser.email,
          score: correctAnswersCount,
          total: quizData.length,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        quizResultRef.set(resultData, { merge: true })
          .then(() => {
            displayQuizResult("تم حفظ إجاباتك بنجاح.");
            const submitButton = document.querySelector("#next-btn");
            if (submitButton) {
              submitButton.disabled = true;
            }
          })
          .catch((error) => {
            displayQuizResult("حدث خطأ أثناء حفظ الإجابات: " + error.message, true);
          });
      }
    })
    .catch((error) => {
      displayQuizResult("حدث خطأ أثناء التحقق من المحاولة السابقة: " + error.message, true);
    });
}

function displayQuizResult(message, isError = false) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = message;
  resultDiv.classList.remove('hidden');
  resultDiv.classList.remove('alert-success', 'alert-danger');
  resultDiv.classList.add(isError ? 'alert-danger' : 'alert-success');
}

// Initialize Quiz on Page Load.
window.onload = loadQuiz;
