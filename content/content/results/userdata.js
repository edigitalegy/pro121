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

// Initialize Firebase if not already initialized.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Function to redirect to the home page.

// Function to load essay results from the "essayResults" collection and display them in a table.
function loadEssayResults() {
  const essayResultsContainer = document.getElementById("essayResultsTable");
  
  db.collection("usersid").orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        essayResultsContainer.innerHTML = "<p class='text-center'>لا توجد نتائج بيانات لعرضها.</p>";
        return;
      }
      
      // Build the HTML table header with "العدد" column.
      let tableHTML = `
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>العدد</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>اسم المستخدم</th>
              <th>التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Add rows with index numbers
      let index = 1;  // Start index from 1

      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt 
          ? data.createdAt.toDate().toLocaleString("ar-EG") 
          : "غير متاح";

        tableHTML += `
          <tr>
            <td>${index}</td>  <!-- This is the new "العدد" column -->
            <td>${data.name || "غير متوفر"}</td>
            <td>${data.email || "غير متوفر"}</td>
            <td>${data.user || "غير متوفر"}</td>
            <td>${createdAt}</td>
          </tr>
        `;

        index++;  // Increment the index for each student
      });

      tableHTML += "</tbody></table>";
      essayResultsContainer.innerHTML = tableHTML;
    })
    .catch(error => {
      essayResultsContainer.innerHTML = `<p class="text-danger text-center">حدث خطأ أثناء تحميل نتائج البيانات: ${error.message}</p>`;
    });
}

// Load essay results when the page loads.
window.onload = loadEssayResults;
