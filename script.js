// ---------------------------
// Teacher Panel with Firebase
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ---------------------------
// Firebase config
// ---------------------------
const firebaseConfig = {
  apiKey: "AIzaSyA5LmONt-L_kyC6zHHihn-hAFyMYxW0pqA",
  authDomain: "school-hub-8ead9.firebaseapp.com",
  databaseURL: "https://school-hub-8ead9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "school-hub-8ead9",
  storageBucket: "school-hub-8ead9.firebasestorage.app",
  messagingSenderId: "326440268613",
  appId: "1:326440268613:web:0e3a26cc2a8584d17fc42c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------------------
// Teacher Panel Functions
// ---------------------------
const password = "MGIS123"; // same for add/view

window.toggleTeacherButtons = function() {
    const div = document.getElementById("teacherButtons");
    div.style.display = div.style.display === "block" ? "none" : "block";
}

window.showAddNote = function() {
    document.getElementById("addNoteDiv").style.display = "block";
    document.getElementById("viewNotesDiv").style.display = "none";
}

window.showViewNotes = function() {
    document.getElementById("viewNotesDiv").style.display = "block";
    document.getElementById("addNoteDiv").style.display = "none";
}

// Add note to Firebase
window.submitTeacherNote = async function() {
    const pass = document.getElementById("addPass").value;
    const comment = document.getElementById("teacherComment").value.trim();

    if(pass !== password) { alert("Wrong password"); return; }
    if(!comment) return;

    try {
        await addDoc(collection(db, "notes"), {
            text: comment,
            timestamp: Date.now()
        });
        alert("Note added!");
        document.getElementById("teacherComment").value = "";
    } catch(e) {
        console.error("Error adding note:", e);
        alert("Error adding note");
    }
}

// View notes from Firebase
window.displayNotes = async function() {
    const pass = document.getElementById("viewPass").value;
    if(pass !== password) { alert("Wrong password"); return; }

    const displayDiv = document.getElementById("notesDisplay");
    displayDiv.innerHTML = "<p>Loading...</p>";

    try {
        const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const now = Date.now();
        const THIRTY_DAYS = 30*24*60*60*1000;
        displayDiv.innerHTML = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            if(now - data.timestamp < THIRTY_DAYS) {
                const p = document.createElement("p");
                p.textContent = data.text;
                displayDiv.appendChild(p);
            }
        });

        if(displayDiv.innerHTML === "") {
            displayDiv.innerHTML = "<i>No notes in the last 30 days</i>";
        }

    } catch(e) {
        console.error("Error fetching notes:", e);
        displayDiv.innerHTML = "<i>Error loading notes</i>";
    }
}

// ---------------------------
// Calendar + Google Sheet CSV
// ---------------------------
const calendarEl = document.getElementById('calendarContainer');
const newsBox = document.getElementById('newsBox');
const holidayBox = document.getElementById('holidayBox');
const specialBox = document.getElementById('specialBox');

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH2be5QfxwCWJGzRN1dlFRibCvXf2ecbJ_c_AH0M_kld_smRK3Ss5rmqPsXXs5l8rOylDh8q18JIGH/pub?output=csv";
let events = {};

// Fetch sheet CSV
fetch(SHEET_URL)
  .then(res => res.text())
  .then(csvText => {
    const lines = csvText.split("\n").slice(1);
    lines.forEach(line => {
      const [date, news, holiday, special] = line.split(",");
      if(date) {
        events[date.trim()] = {
          news: news?.trim() || "",
          holiday: holiday?.trim() || "",
          special: special?.trim() || ""
        };
      }
    });
    renderCalendar();
  })
  .catch(err => console.error("Error fetching sheet:", err));

// Render calendar
function renderCalendar() {
  calendarEl.innerHTML = "";
  const year = 2026;
  const todayStr = new Date().toISOString().split('T')[0];

  for(let month=0; month<12; month++) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month';

    const monthName = new Date(year, month, 1).toLocaleString('default', { month:'long' });
    const monthTitle = document.createElement('div');
    monthTitle.className = 'month-name';
    monthTitle.innerText = monthName;
    monthDiv.appendChild(monthTitle);

    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    const lastDay = new Date(year, month+1, 0).getDate();

    for(let day=1; day<=lastDay; day++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const btn = document.createElement('button');
      btn.innerText = day;
      btn.className = 'dateBtn';

      if(events[dateStr]) {
        if(events[dateStr].holiday) btn.classList.add('holiday');
        if(events[dateStr].news) btn.classList.add('exam');
        if(events[dateStr].special) btn.classList.add('special');
      }

      if(dateStr === todayStr) btn.classList.add('today');

      btn.addEventListener('click', () => {
        document.querySelectorAll('.dateBtn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        newsBox.innerText = "News: " + (events[dateStr]?.news || "None");
        holidayBox.innerText = "Holiday: " + (events[dateStr]?.holiday || "None");
        specialBox.innerText = "Special: " + (events[dateStr]?.special || "None");
      });

      calendar.appendChild(btn);
    }

    monthDiv.appendChild(calendar);
    calendarEl.appendChild(monthDiv);
  }
}

// Initial render
renderCalendar();
