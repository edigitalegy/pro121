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
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
// Function to load opinion results from the "article" collection and display them in a table.
function loadEssayResults() {
  const essayResultsContainer = document.getElementById("essayResultsTable");
  
  db.collection("article")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        essayResultsContainer.innerHTML = "<p class='text-center'>لا توجد نتائج للمقال لعرضها.</p>";
        return;
      }
      
      // Build the HTML table header.
      let tableHTML = `
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الآراء</th>
              <th>آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Extract latest timestamp from opinions array
        let latestTimestamp = "غير متاح";
        if (data.opinions && Array.isArray(data.opinions) && data.opinions.length > 0) {
          const sortedOpinions = data.opinions
            .filter(opinion => opinion.timestamp) // Ensure timestamp exists
            .sort((a, b) => b.timestamp - a.timestamp); // Sort by latest timestamp

          if (sortedOpinions.length > 0) {
            latestTimestamp = new Date(sortedOpinions[0].timestamp).toLocaleString("ar-EG");
          }
        }
        
        // Button to view opinions.
        tableHTML += `
          <tr>
            <td>${data.name || "غير متوفر"}</td>
            <td>${data.email || "غير متوفر"}</td>
            <td>
              <button class="btn btn-info btn-sm" onclick="showOpinions('${doc.id}')">
                عرض الآراء
              </button>
            </td>
            <td>${latestTimestamp}</td>
          </tr>
        `;
      });
      
      tableHTML += "</tbody></table>";
      essayResultsContainer.innerHTML = tableHTML;
    })
    .catch(error => {
      essayResultsContainer.innerHTML = `<p class="text-danger text-center">حدث خطأ أثناء تحميل نتائج المقال: ${error.message}</p>`;
    });
}

// Function to show opinions in a modal.
function showOpinions(docId) {
  db.collection("article").doc(docId).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        let modalContent = "";

        if (data.opinions && Array.isArray(data.opinions) && data.opinions.length > 0) {
          data.opinions.forEach((item, index) => {
            const opinionTimestamp = item.timestamp 
              ? new Date(item.timestamp).toLocaleString("ar-EG") 
              : "غير متاح";

            modalContent += `
              <div class="mb-3">
                <h6>درس ${index + 1}:</h6>
                <p><strong>موضوع:</strong> ${item.articleId || "غير متوفر"}</p>
                <p><strong>الأجابة:</strong> ${item.opinion || "غير متاح"}</p>
                <p><strong>التاريخ والوقت:</strong> ${opinionTimestamp}</p>
              </div>
            `;
          });
        } else {
          modalContent = "<p class='text-center'>لا توجد آراء متوفرة.</p>";
        }
        
        // Inject the content into the modal body.
        document.getElementById("essayAnswersModalBody").innerHTML = modalContent;
        
        // Show the modal using Bootstrap's Modal API.
        const essayModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("essayAnswersModal"));
        essayModal.show();
      } else {
        alert("لا توجد تفاصيل متوفرة.");
      }
    })
    .catch(error => {
      alert("حدث خطأ: " + error.message);
    });
}

// Load opinions when the page loads.
window.onload = loadEssayResults;
/*************************************************************************************************/

// Function to redirect to the home page.
function goHome() {
  window.location.href = "home.html"; // Adjust this path as needed.
}