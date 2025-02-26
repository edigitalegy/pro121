import { db, auth } from "./firebasetest.js";
import { quizData } from "./q_writtest.js";

//**************************doc varibales***********************************/
const databasename ="writeposttest";
const backpage ="./cont1.html";
// ========= vaiables =========

let currentQuestionIndex = 0; // Track the current question
let userAnswers = [];         // Store user answers for review
let correctAnswersCount = 0;   // Count correct answers

const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const prevButton = document.getElementById('prev-btn');
const reviewButton = document.getElementById('review-btn');
const homeButton = document.getElementById('home-btn');
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', previousQuestion);
reviewButton.addEventListener('click', reviewQuiz);

// ========= Quiz Flow Functions =========
function loadQuiz() {
 // shuffle(quizData);
  displayQuestion();
}

function displayQuestion() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  const item = quizData[currentQuestionIndex];
  const questionCard = document.createElement('div');
  questionCard.classList.add('mb-3');

  // (Optional) Display header if available.
  if (item.header) {
    const headerElem = document.createElement('h4'); // Use h4 for larger font size
    headerElem.classList.add('text-secondary', 'fw-bold'); // Add Bootstrap bold style
    headerElem.style.fontSize = '20px'; // Set font size explicitly
    headerElem.style.textAlign = 'justify'; // Justify text
    headerElem.style.direction = 'rtl'; // Ensure right-to-left alignment for Arabic text
    headerElem.textContent = item.header;
    questionCard.appendChild(headerElem);
    }

  // Create the question title.
  const questionTitle = document.createElement('h5');
  questionTitle.textContent = `س${currentQuestionIndex + 1}: ${item.question}`;
  questionCard.appendChild(questionTitle);

  // Check if the question requires an input field (i.e., no multiple-choice options).
  if (item.options.length === 0) {
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
  quizContainer.appendChild(questionCard);
}
  quizContainer.appendChild(questionCard);
  // Update Next button text.
  nextButton.disabled = (currentQuestionIndex === quizData.length - 1);
  // Update Previous button state.
  prevButton.disabled = (currentQuestionIndex === 0);
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
  nextButton.disabled = false; 
  submitButton.classList.add('hidden');
  reviewButton.classList.add('hidden'); 
}

function nextQuestion() {
    // If the current question uses an input field (header is ""), capture the input value.
    if (quizData[currentQuestionIndex].options.length === 0) {
      const inputField = document.getElementById('answer-input');
    if (inputField) {
      userAnswers[currentQuestionIndex] = inputField.value.trim();
    }
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    displayQuestion();
  }   if (currentQuestionIndex === quizData.length - 1) {
    nextButton.disabled = true;
    submitButton.classList.remove('hidden');
  }
}

// Attach event listener to Submit button
submitButton.addEventListener('click', () => {
  finishtest();
  storeQuizResults();  // ✅ Save answers to Firestore
});
function finishtest()
{
  nextButton.classList.add('hidden');
  prevButton.classList.add('hidden');
  submitButton.classList.add('hidden');
  reviewButton.classList.remove('hidden'); // Show Review button
  showResults();
};


function handleAnswer(selectedValue) {
  const item = quizData[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = selectedValue; // Store user's answer

  // Highlight selected answer and show feedback
  const selectedInput = document.querySelector('input[name="question"]:checked');
  const feedbackContainer = document.createElement('div');
  feedbackContainer.classList.add('feedback', 'alert');

  if (selectedValue === item.answer) {
    correctAnswersCount++; // Increment correct answers
    /*
    selectedInput.parentElement.classList.add('correct-answer');
    selectedInput.parentElement.innerHTML += '<span class="icon check-icon">✔</span>'; // Add check icon
    feedbackContainer.textContent = "صحيح! " + item.feedback; // Show feedback
    feedbackContainer.classList.add('alert-success');
    */
  } else {
    /*
    selectedInput.parentElement.classList.add('wrong-answer');
    selectedInput.parentElement.innerHTML += '<span class="icon cross-icon">✘</span>'; // Add cross icon
    feedbackContainer.textContent = "خطأ! " + item.feedback; // Show feedback
    feedbackContainer.classList.add('alert-danger');
    const correctOption = [...document.getElementsByName('question')].find(input => input.value === item.answer);
    correctOption.parentElement.classList.add('correct-answer'); // Highlight correct option
    correctOption.parentElement.innerHTML += '<span class="icon check-icon">✔</span>'; // Add check icon
    */
  }

 // const quizContainer = document.getElementById('quiz-container');
//  quizContainer.appendChild(feedbackContainer);
}



function showResults() {
  const resultContainer = document.getElementById('result');
  resultContainer.classList.remove('hidden');

  // Generate recommendations based on the score
  let recommendations;
  if (correctAnswersCount === quizData.length) {
    recommendations = "أحسنت! استمر في المذاكرة بشكل جيد.";
  } else if (correctAnswersCount >= quizData.length / 2) {
    recommendations = "جيد، لكن يمكنك تحسين أدائك. حاول مراجعة المواد التي لم تجب عليها بشكل صحيح.";
  } else {
    recommendations = "يبدو أنك بحاجة إلى مزيد من الممارسة. حاول التركيز على الموضوعات التي لم تفهمها جيدًا.";
  }

  resultContainer.innerHTML = `
    <div class="text-center text-danger">
      <p>لقد أجبت بشكل صحيح على <strong>${correctAnswersCount}</strong> من <strong>${quizData.length}</strong> أسئلة.</p>
      <p class="mt-3 text-dark">${recommendations}</p>
    </div>
  `;
  // Show the home button now that it's already in the HTML
  //homeButton.classList.remove('hidden');

  // Store the result and review data in Firestore
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
  reviewButton.classList.add('hidden');
  nextButton.classList.add('hidden');
}

// ========= Helper Function =========

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ========= Firestore Storage Function =========
function storeQuizResults() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  const quizResultRef = db.collection(databasename).doc(currentUser.email);

  // Disable the home button initially
  if (homeButton) {
    homeButton.disabled = true;
  }

  quizResultRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        displayQuizResult("لقد قمت بالإجابة على الاختبار مسبقاً ولا يمكنك المحاولة مرة أخرى.", true);
     //   const submitButton = document.querySelector("#submit-btn");
        if (submitButton) {
          submitButton.disabled = true;
        }
        return;
      } else {
        // Store the full quiz details (question, user answer, and correct answer)
        let quizResponses = quizData.map((item, index) => ({
          question: item.question,
          correctAnswer: item.answer,
          userAnswer: userAnswers[index] || "لم يتم اختيار إجابة"
        }));

        const resultData = {
          uid: currentUser.uid,
          name: currentUser.displayName || "غير متوفر",
          email: currentUser.email,
          score: correctAnswersCount,
          total: quizData.length,
          responses: quizResponses, // ✅ Store full question details
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        quizResultRef.set(resultData, { merge: true })
          .then(() => {
            displayQuizResult("تم حفظ إجاباتك بنجاح.");
          //  const submitButton = document.querySelector("#submit-btn");
            if (submitButton) {
              submitButton.disabled = true;
            }
            // ✅ Enable home button after successful save
            if (homeButton) {
              homeButton.disabled = false;
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
  resultDiv.innerHTML = `<p>${message}</p>`;

  resultDiv.classList.remove('hidden', 'alert-success', 'alert-danger');
  resultDiv.classList.add(isError ? 'alert-danger' : 'alert-success');

  // Show the home button
  //homeButton.classList.remove('hidden');
}

  homeButton.addEventListener('click', () => {
  window.location.href = backpage; // Redirects to the specified page
});


// Initialize Quiz on Page Load.
window.onload = loadQuiz;
