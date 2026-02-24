// ---------------------------
// Firebase imports
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5LmONt-L_kyC6zHHihn-hAFyMYxW0pqA",
  authDomain: "school-hub-8ead9.firebaseapp.com",
  databaseURL: "https://school-hub-8ead9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "school-hub-8ead9",
  storageBucket: "school-hub-8ead9.firebasestorage.app",
  messagingSenderId: "326440268613",
  appId: "1:326440268613:web:7b6d53f78f666fc37fc42c"
};

// ---------------------------
// Initialize Firebase
// ---------------------------
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ---------------------------
// Event storage
// ---------------------------
let events = {}; // { "YYYY-MM-DD": {news:"", holiday:"", special:""} }

// ---------------------------
// Elements
// ---------------------------
const calendarEl = document.getElementById('calendarContainer');
const newsBox = document.getElementById('newsBox');
const holidayBox = document.getElementById('holidayBox');
const specialBox = document.getElementById('specialBox');
const adminBtn = document.getElementById('adminBtn');

// ---------------------------
// Fetch data from Firebase
// ---------------------------
const eventsRef = ref(database, 'events');
onValue(eventsRef, (snapshot) => {
  events = snapshot.val() || {};
  renderCalendar(); // refresh calendar buttons with colors
});

// ---------------------------
// Admin button
// ---------------------------
adminBtn.addEventListener('click', () => {
  const date = prompt("Enter date (YYYY-MM-DD):");
  if (!date) return;
  const newsText = prompt("Enter news (leave blank if none):");
  const holidayText = prompt("Enter holiday (leave blank if none):");
  const specialText = prompt("Enter special event (leave blank if none):");

  set(ref(database, 'events/' + date), {
    news: newsText || "",
    holiday: holidayText || "",
    special: specialText || ""
  });
  alert('Data saved for ' + date);
});

// ---------------------------
// Render calendar buttons
// ---------------------------
function renderCalendar() {
  if (!calendarEl) return;
  calendarEl.innerHTML = '';

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDay = new Date(year, month + 1, 0);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const btn = document.createElement('button');
    btn.innerText = day;
    btn.className = 'dateBtn';

    // Color based on event type
    if (events[dateStr]) {
      if (events[dateStr].holiday) btn.classList.add('holiday');
      else if (events[dateStr].special) btn.classList.add('special');
      else if (events[dateStr].news) btn.classList.add('news');
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('.dateBtn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      newsBox.innerText = "News: " + (events[dateStr]?.news || "None");
      holidayBox.innerText = "Holiday: " + (events[dateStr]?.holiday || "None");
      specialBox.innerText = "Special: " + (events[dateStr]?.special || "None");
    });

    calendarEl.appendChild(btn);
  }
}

// ---------------------------
// Initial render
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
});