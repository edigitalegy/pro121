/*****************************************firebase********************************************************/
const databasename = "usersid";

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

// Initialize Firebase (Using Compatibility Mode)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();
  const auth = firebase.auth();

  let namearticle;
  let emailarticle;
  const adminbutton = document.getElementById("admin-button");
  adminbutton.disabled = true;
// Check if the user is logged in
auth.onAuthStateChanged(async user => {
  if (user) {
      document.getElementById("user-name").innerHTML = `${user.displayName || user.email}`;
      namearticle = user.displayName; 
      emailarticle = user.email;
      console.log(user.email);

      try {
          // Fetch user role from Firestore
          const userDoc = await db.collection(databasename).doc(user.uid).get();
          
          if (userDoc.exists) {
              const userData = userDoc.data();
              
              // Check if the role is 'admin'
              if (userData.user === "adminsara") {
                  document.getElementById("admin-button").classList.add('show');
                  adminbutton.disabled = false; // Show admin button
              }
          } else {
              console.warn("User document not found in Firestore.");
          }
      } catch (error) {
          console.error("Error fetching user role:", error);
      }
  } else {
      // Redirect to login if no user is found
      window.location.href = "../index.html";
  }
});

adminbutton.addEventListener('click', () => {
    window.open('results.html', '_self');
  });

/***********************************form firebase**************************************************************/
  const formElement = document.getElementById('form-atricle');
  const formname = formElement ? formElement.name : null;  // Ensure no errors if form-atricle is missing
  
  function handleSubmit(event) {
      event.preventDefault();
  
      const opinionText = document.getElementById("opinion")?.value.trim();
      if (!opinionText) {
          alert("يرجى إدخال رأيك قبل الإرسال!");
          return;
      }
  
      // Ensure user data exists
      if (!namearticle || !emailarticle) {
          alert("حدث خطأ في تسجيل الدخول، يرجى المحاولة لاحقًا.");
          return;
      }
  
      // Ensure formname is valid before proceeding
      if (!formname) {
          alert("حدث خطأ، لم يتم العثور على النموذج.");
          return;
      }
  
      const userRef = db.collection("article").doc(emailarticle); // Using email as a unique identifier
  
      userRef.get().then((doc) => {
          if (doc.exists) {
              const userData = doc.data();
              const userOpinions = userData.opinions || [];
  
              // Check if the user has already submitted an opinion for this article
              const hasSubmitted = userOpinions.some(opinion => opinion.articleId === formname);
  
              if (hasSubmitted) {
                  alert("لقد قمت بإرسال رأيك بالفعل على هذا المقال، لا يمكنك الإرسال مرة أخرى.");
                  return Promise.reject("User already submitted opinion");  // Stop execution
              }
  
              // Append new opinion to the existing array
              return userRef.update({
                  opinions: firebase.firestore.FieldValue.arrayUnion({
                      articleId: formname,
                      opinion: opinionText,
                      timestamp: new Date().toISOString()  // Use ISO string timestamp
                  })
              });
          } else {
              // If the user document doesn't exist, create a new one
              return userRef.set({
                  name: namearticle,
                  email: emailarticle,
                  opinions: [{
                      articleId: formname,
                      opinion: opinionText,
                      timestamp: new Date().toISOString()  // Use ISO string timestamp
                  }]
              });
          }
      })
      .then(() => {
          alert("تم إرسال رأيك بنجاح، شكرًا لمشاركتك!");
          document.getElementById("opinion").value = ""; // Clear input field
          console.log("تم الإرسال من:", namearticle);
      })
      .catch((error) => {
          if (error !== "User already submitted opinion") { // Ignore if the user already submitted
              console.error("Error:", error);
              alert("حدث خطأ أثناء إرسال رأيك. حاول مرة أخرى.");
          }
      });
  }
/***********************************sign out**************************************************************/
  function logout() {
    auth.signOut()
    .then(() => {
      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
       console.log(123456);
      // Redirect back to login page
      window.location.href = "../index.html";
    })
    .catch(error => {
      alert("خطأ: " + error.message);
    });
  }
  
