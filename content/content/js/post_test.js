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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ========= Quiz Data and Variables =========
const quizData = [
  {
    header: "article",    
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
    header: "اختبار المعرفة العامة",
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
    header: "اختبار المعرفة العامة",
    question: "ما هي عملة اليابان؟",
    options: ["ين", "دولار", "يورو", "وون"],
    answer: "ين",
    feedback: "عملة اليابان هي الين."
  }
];

let currentQuestionIndex = 0; // Track the current question
let userAnswers = [];         // Store user answers for review
let correctAnswersCount = 0;   // Count correct answers

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

  // (Optional) Display header if available.
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




  // Shuffle and display options.
  if (item.header === "article") 
    {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList.add('form-control');
    inputField.placeholder = 'اكتب إجابتك هنا...';
    inputField.id = 'answer-input';
    questionCard.appendChild(inputField);
  } else 
  {
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
    // User clicked "إرسال" on the last question.
    // Hide next and previous buttons.
    document.getElementById('next-btn').classList.add('d-none');
    document.getElementById('prev-btn').classList.add('d-none');
    // Show the review button.
    document.getElementById('review-btn').classList.remove('d-none');
    // Optionally, call showResults() or any final result display function.
    showResults();
  }
}

function handleAnswer(selectedValue) {
  const item = quizData[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = selectedValue; // Store user's answer

  // Highlight selected answer and show feedback
  const selectedInput = document.querySelector('input[name="question"]:checked');
  const feedbackContainer = document.createElement('div');
  feedbackContainer.classList.add('feedback', 'alert');

  if (selectedValue === item.answer) {
    correctAnswersCount++; // Increment correct answers
    selectedInput.parentElement.classList.add('correct-answer');
    selectedInput.parentElement.innerHTML += '<span class="icon check-icon">✔</span>'; // Add check icon
    feedbackContainer.textContent = "صحيح! " + item.feedback; // Show feedback
    feedbackContainer.classList.add('alert-success');
  } else {
    selectedInput.parentElement.classList.add('wrong-answer');
    selectedInput.parentElement.innerHTML += '<span class="icon cross-icon">✘</span>'; // Add cross icon
    feedbackContainer.textContent = "خطأ! " + item.feedback; // Show feedback
    feedbackContainer.classList.add('alert-danger');
    const correctOption = [...document.getElementsByName('question')].find(input => input.value === item.answer);
    correctOption.parentElement.classList.add('correct-answer'); // Highlight correct option
    correctOption.parentElement.innerHTML += '<span class="icon check-icon">✔</span>'; // Add check icon
  }

  const quizContainer = document.getElementById('quiz-container');
  quizContainer.appendChild(feedbackContainer);
}



function showResults() {
  const resultContainer = document.getElementById('result');
  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `لقد أجبت بشكل صحيح على ${correctAnswersCount} من ${quizData.length} أسئلة.`;
  giveRecommendations(correctAnswersCount);
  // Store the result and review data in Firestore
  storeQuizResults();
}

function giveRecommendations(correctCount) {
  const recommendationsContainer = document.getElementById('recommendations');
  recommendationsContainer.innerHTML = ''; // Clear previous recommendations

  let recommendations;
  if (correctCount === quizData.length) {
    recommendations = "أحسنت! استمر في المذاكرة بشكل جيد.";
  } else if (correctCount >= quizData.length / 2) {
    recommendations = "جيد، لكن يمكنك تحسين أدائك. حاول مراجعة المواد التي لم تجب عليها بشكل صحيح.";
  } else {
    recommendations = "يبدو أنك بحاجة إلى مزيد من الممارسة. حاول التركيز على الموضوعات التي لم تفهمها جيدًا.";
  }

  const recommendationText = document.createElement('p');
  recommendationText.textContent = recommendations;
  recommendationsContainer.appendChild(recommendationText);
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

    const userAnswer = userAnswers[index] || "لم يتم اختيار إجابة"; // Get user's answer
    const resultText = document.createElement('p');
    resultText.classList.add(userAnswer === item.answer ? 'correct-answer' : 'wrong-answer');
    resultText.innerHTML = `إجابتك: <strong>${userAnswer}</strong>`;
    reviewCard.appendChild(resultText);

    const correctText = document.createElement('p');
    correctText.innerHTML = `الإجابة الصحيحة: <strong>${item.answer}</strong>`;
    correctText.classList.add('correct-answer');
    reviewCard.appendChild(correctText);

    quizContainer.appendChild(reviewCard);
  });

  // Hide the review and next buttons after reviewing
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
}

// ========= Helper Function =========

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ========= Firestore Storage Function =========

// This function stores the overall quiz result along with the review data in Firestore.
// It uses the current user's email as the document ID to update (or create) a single record per user.
function storeQuizResults() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("الرجاء تسجيل الدخول أولاً.");
    return;
  }
  
  // Reference to the quiz result document for the current user using their email as the document ID.
  const quizResultRef = db.collection("posttest").doc(currentUser.email);
  
  // Check if a result document already exists.
  quizResultRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        // If a document exists, the user has already attempted the test.
        displayQuizResult("لقد قمت بالإجابة على الاختبار مسبقاً ولا يمكنك المحاولة مرة أخرى.", true);
        // Optionally, disable the submit button to prevent further submissions.
        const submitButton = document.querySelector("#next-btn"); // Adjust the selector to match your submit button.
        if (submitButton) {
          submitButton.disabled = true;
        }
        return; // Stop further execution.
      } else {
        // If no document exists, prepare the result object.
        const resultData = {
          uid: currentUser.uid,
          name: currentUser.displayName || "غير متوفر",
          email: currentUser.email,
          score: correctAnswersCount,     // Assuming you have a variable that holds the quiz score.
          total: quizData.length,          // Assuming quizData holds your quiz questions.
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
  
        // Save (or update) the document in the "quizResults" collection.
        quizResultRef.set(resultData, { merge: true })
          .then(() => {
            displayQuizResult("تم حفظ إجاباتك بنجاح.");
            // Optionally disable the submit button after a successful submission.
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
// ========= Initialize Quiz on Page Load =========

window.onload = loadQuiz;
