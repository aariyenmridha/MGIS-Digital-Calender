// ---------------------------
// Local events object
// ---------------------------
const events = {
  "2026-02-24": { news: "Sanskrit Exam (50 marks)", holiday: "", special: "" },
  "2026-02-26": { news: "English Exam (50 marks)", holiday: "", special: "" },
  "2026-02-28": { news: "Hindi Exam (50 marks)", holiday: "", special: "" },
  "2026-03-02": { news: "Math Exam (50 marks)", holiday: "", special: "" },
  "2026-03-05": { news: "Bio Exam (50 marks)", holiday: "", special: "" },
  "2026-03-07": { news: "Physics/Chemistry Exam (50 marks)", holiday: "", special: "" },
  "2026-03-09": { news: "History Exam (50 marks)", holiday: "", special: "" },
  "2026-03-11": { news: "Geography/Civics Exam (50 marks)", holiday: "", special: "" },
  "2026-03-13": { news: "Computer Exam (50 marks)", holiday: "", special: "" },
  "2026-02-25": { news: "", holiday: "Weekend", special: "" },
  "2026-03-03": { news: "", holiday: "Weekend", special: "" }
};

// ---------------------------
// Elements
// ---------------------------
const calendarEl = document.getElementById('calendarContainer');
const newsBox = document.getElementById('newsBox');
const holidayBox = document.getElementById('holidayBox');
const specialBox = document.getElementById('specialBox');

// ---------------------------
// Render calendar
// ---------------------------
function renderCalendar() {
  calendarEl.innerHTML = "";

  const year = 2026;
  const month = 1; // February = 1 (0-based)
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const btn = document.createElement('button');
    btn.innerText = day;
    btn.className = 'dateBtn';

    // Color based on event
    if (events[dateStr]) {
      if (events[dateStr].holiday) btn.classList.add('holiday');
      if (events[dateStr].news) btn.classList.add('exam');
      if (events[dateStr].special) btn.classList.add('special');
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
document.addEventListener('DOMContentLoaded', renderCalendar);
