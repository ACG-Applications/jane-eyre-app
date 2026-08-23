// ============================================================
// Jane Eyre - Read & Understand
// Complete Application Logic with Practice Mode
// ============================================================

// ----- Application State -----
const state = {
  lessons: [],
  currentLessonId: null,
  completedLessons: [],
  isLoading: true,
};

// ----- DOM References -----
const DOM = {
  lessonList: document.getElementById("lesson-list"),
  lessonContent: document.getElementById("lesson-content"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
};

// ----- Track Answered Questions -----
let answeredQuestions = {};

// ----- Local Storage Helpers -----
function loadProgress() {
  try {
    const saved = localStorage.getItem("janeEyreProgress");
    if (saved) {
      state.completedLessons = JSON.parse(saved);
    } else {
      state.completedLessons = [];
    }
  } catch (e) {
    state.completedLessons = [];
  }
}

function saveProgress() {
  try {
    localStorage.setItem(
      "janeEyreProgress",
      JSON.stringify(state.completedLessons),
    );
  } catch (e) {
    console.warn("Could not save progress:", e);
  }
}

// ============================================================
// Sequential Logic Helpers
// ============================================================

function canCompleteLesson(lessonId) {
  if (lessonId === 1) return true;
  const previousId = lessonId - 1;
  return state.completedLessons.includes(previousId);
}

// ============================================================
// Toast Notification
// ============================================================

function showToast(message, isError = true) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    toast.style.background = isError ? "#333" : "#4a8a5a";
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// ============================================================
// Multiple Choice Questions - Practice Mode
// ============================================================

function getMultipleChoiceOptions(question, lessonId) {
  // Define options for each question based on lesson
  const questionMap = {
    // Lesson 1 questions
    "How old was Jane in 1825?": {
      options: ["8 years old", "10 years old", "12 years old", "15 years old"],
      correct: 1,
    },
    "Where did Jane live after her parents died?": {
      options: [
        "With her grandparents",
        "With her aunt and uncle",
        "At a school",
        "Alone",
      ],
      correct: 1,
    },
    "Was Jane happy at Gateshead Hall?": {
      options: [
        "Yes, she was very happy",
        "No, she was unhappy",
        "Sometimes happy",
        "She didn't care",
      ],
      correct: 1,
    },
    // Lesson 2 questions
    "What did John do to Jane?": {
      options: [
        "He hugged her",
        "He hit her with a book",
        "He gave her a gift",
        "He ignored her",
      ],
      correct: 1,
    },
    "How did Jane react when John hit her?": {
      options: [
        "She cried",
        "She fought back",
        "She ran away",
        "She told her aunt",
      ],
      correct: 1,
    },
    "What did Jane say she wanted to do?": {
      options: [
        "Stay at Gateshead",
        "Leave Gateshead",
        "Go to school",
        "Run away",
      ],
      correct: 1,
    },
    // Lesson 3 questions
    "Who was Mr. Brocklehurst?": {
      options: [
        "A teacher",
        "The owner of the school",
        "Jane's uncle",
        "A doctor",
      ],
      correct: 1,
    },
    "What did Mr. Brocklehurst say about bad children?": {
      options: [
        "He liked them",
        "God punishes them",
        "They are funny",
        "He ignores them",
      ],
      correct: 1,
    },
    "Did Jane want to go to Lowood School? Why?": {
      options: [
        "Yes, she wanted to leave Gateshead",
        "No, she was scared",
        "She didn't care",
        "She wanted to stay",
      ],
      correct: 0,
    },
    // Lesson 4 questions
    "What was Lowood School like?": {
      options: [
        "Warm and comfortable",
        "Cold and strict",
        "Fun and exciting",
        "Very luxurious",
      ],
      correct: 1,
    },
    "What did the girls wear at Lowood?": {
      options: [
        "Pretty dresses",
        "Plain brown dresses",
        "Fancy uniforms",
        "Colorful clothes",
      ],
      correct: 1,
    },
    "How many girls were at Lowood School?": {
      options: ["About 20", "About 50", "About 80", "About 100"],
      correct: 2,
    },
    // Lesson 5 questions
    "Who was Miss Temple?": {
      options: ["The head teacher", "A student", "Jane's cousin", "A servant"],
      correct: 0,
    },
    "Why did Mr. Brocklehurst punish Jane?": {
      options: [
        "She was late",
        "She dropped her book",
        "She was a liar",
        "She was lazy",
      ],
      correct: 2,
    },
    "How did Miss Temple treat Jane?": {
      options: [
        "She was unkind",
        "She was kind",
        "She ignored her",
        "She punished her",
      ],
      correct: 1,
    },
    // Lesson 6 questions - FIXED Q3
    "What happened to many of the girls at Lowood?": {
      options: [
        "They became sick",
        "They left happily",
        "They got rich",
        "They moved away",
      ],
      correct: 0,
    },
    "What did Mr. Brocklehurst have to do after the girls got sick?": {
      options: [
        "Buy better food and clothes",
        "Close the school",
        "Run away",
        "Become a teacher",
      ],
      correct: 0,
    },
    "How long was Jane at Lowood School?": {
      options: ["2 years", "4 years", "6 years", "8 years"],
      correct: 2,
    },
    // Lesson 7 questions
    "What job did Jane want?": {
      options: ["A teacher", "A governess", "A nurse", "A servant"],
      correct: 1,
    },
    "Who was Mrs. Fairfax?": {
      options: ["The owner", "The housekeeper", "A teacher", "Jane's aunt"],
      correct: 1,
    },
    "How did Jane feel when she arrived at Thornfield Hall?": {
      options: ["Sad", "Happy", "Scared", "Angry"],
      correct: 1,
    },
    // Lesson 8 questions
    "Who was Adele Varens?": {
      options: [
        "Jane's pupil",
        "Mrs. Fairfax's daughter",
        "Mr. Rochester's wife",
        "A servant",
      ],
      correct: 0,
    },
    "Who was Mr. Rochester?": {
      options: [
        "The owner of Thornfield",
        "A teacher",
        "A doctor",
        "Jane's cousin",
      ],
      correct: 0,
    },
    "What was Thornfield Hall like?": {
      options: [
        "Small and old",
        "Beautiful with large windows",
        "Dark and scary",
        "Modern and new",
      ],
      correct: 1,
    },
    // Lesson 9 questions
    "What happened to the man on the horse?": {
      options: [
        "He fell and hurt his foot",
        "He lost his horse",
        "He was angry",
        "He ran away",
      ],
      correct: 0,
    },
    "Where was Jane going that day?": {
      options: ["To the village", "To the city", "To church", "To a party"],
      correct: 0,
    },
    "What did Jane offer to do?": {
      options: ["Help the man", "Call a doctor", "Fetch a horse", "Go home"],
      correct: 0,
    },
    // Lesson 10 questions
    "What did Mr. Rochester look like?": {
      options: [
        "Handsome and young",
        "Strong face, dark eyes",
        "Tall and thin",
        "Short and fat",
      ],
      correct: 1,
    },
    "How did Jane help Mr. Rochester?": {
      options: [
        "She gave him water",
        "She helped him onto his horse",
        "She called a doctor",
        "She went to get help",
      ],
      correct: 1,
    },
    "Who was the man on the horse?": {
      options: ["Mr. Rochester", "A stranger", "Mr. Brocklehurst", "John Reed"],
      correct: 0,
    },
    // Lesson 11 questions
    "What did Jane hear in the night?": {
      options: [
        "A strange laugh",
        "A door slamming",
        "Someone crying",
        "A fire alarm",
      ],
      correct: 0,
    },
    "Where was the smoke coming from?": {
      options: [
        "The kitchen",
        "Mr. Rochester's room",
        "The garden",
        "The library",
      ],
      correct: 1,
    },
    "Who did Jane think started the fire?": {
      options: ["Mr. Rochester", "Grace Poole", "Mrs. Fairfax", "Adele"],
      correct: 1,
    },
    // Lesson 12 questions
    "What did Mr. Rochester ask Jane in the garden?": {
      options: [
        "To leave Thornfield",
        "To marry him",
        "To find a new job",
        "To help Adele",
      ],
      correct: 1,
    },
    "Why did Jane think she had to leave Thornfield?": {
      options: [
        "She was fired",
        "Mr. Rochester was marrying Miss Ingram",
        "She was homesick",
        "She found a better job",
      ],
      correct: 1,
    },
    "Did Mr. Rochester love Jane?": {
      options: ["Yes", "No", "He didn't know", "He loved Miss Ingram"],
      correct: 0,
    },
    // Lesson 13 questions
    "What happened on Jane's wedding day?": {
      options: [
        "She got married",
        "The wedding was stopped",
        "She ran away",
        "Mr. Rochester didn't show up",
      ],
      correct: 1,
    },
    "Who stopped the wedding?": {
      options: [
        "A lawyer named Briggs",
        "The clergyman",
        "Mrs. Fairfax",
        "Grace Poole",
      ],
      correct: 1,
    },
    "What did the man in the church say?": {
      options: [
        "The couple must not marry",
        "The wedding can go on",
        "Mr. Rochester is not rich",
        "Jane is too young",
      ],
      correct: 0,
    },
    // Lesson 14 questions
    "What secret did Mr. Rochester have?": {
      options: [
        "He was poor",
        "He had a wife",
        "He was a criminal",
        "He was not the owner",
      ],
      correct: 1,
    },
    "Who was Richard Mason?": {
      options: [
        "Mr. Rochester's brother",
        "Bertha Mason's brother",
        "The clergyman",
        "A lawyer",
      ],
      correct: 1,
    },
    "Where was Mrs. Rochester living?": {
      options: [
        "In London",
        "At Thornfield Hall",
        "In the West Indies",
        "At Gateshead Hall",
      ],
      correct: 1,
    },
    // Lesson 15 questions
    "What happened to Thornfield Hall?": {
      options: [
        "It was sold",
        "It burned down",
        "It was rebuilt",
        "It was abandoned",
      ],
      correct: 1,
    },
    "What happened to Mr. Rochester?": {
      options: [
        "He died in the fire",
        "He was blinded and lost a hand",
        "He ran away",
        "He went to London",
      ],
      correct: 1,
    },
    "Did Jane and Mr. Rochester get married in the end?": {
      options: ["Yes", "No", "They never met again", "They became friends"],
      correct: 0,
    },
  };

  const mapped = questionMap[question];
  if (mapped) {
    return mapped;
  }

  // For questions not in the map, generate generic options
  return {
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0,
  };
}

function renderMultipleChoice(question, index, lessonId) {
  const qData = getMultipleChoiceOptions(question, lessonId);
  const options = qData.options;
  const correctIndex = qData.correct;

  const answerKey = `${lessonId}-q${index}`;
  const userAnswer = answeredQuestions[answerKey];
  const isAnswered = userAnswer !== undefined;

  let optionsHtml = "";
  const labels = ["A", "B", "C", "D"];

  options.forEach((opt, optIndex) => {
    let className = "mc-option";
    let icon = "○";

    if (isAnswered) {
      if (optIndex === correctIndex) {
        className += " mc-correct";
        icon = "✅";
      } else if (optIndex === userAnswer && optIndex !== correctIndex) {
        className += " mc-wrong";
        icon = "❌";
      } else {
        className += " mc-disabled";
        icon = "○";
      }
    } else {
      className += " mc-unanswered";
    }

    optionsHtml += `
            <div class="${className}" 
                 data-answer="${optIndex}"
                 onclick="${!isAnswered ? `checkAnswer(${lessonId}, ${index}, ${optIndex}, ${correctIndex})` : ""}"
                 style="${isAnswered ? "cursor: default;" : "cursor: pointer;"}">
                <span class="mc-icon">${icon}</span>
                <span class="mc-label">${labels[optIndex]})</span>
                <span class="mc-text">${opt}</span>
            </div>
        `;
  });

  let feedbackHtml = "";
  if (isAnswered) {
    const isCorrect = userAnswer === correctIndex;
    const correctText = options[correctIndex];
    feedbackHtml = `
            <div class="mc-feedback ${isCorrect ? "mc-feedback-correct" : "mc-feedback-wrong"}">
                ${isCorrect ? "✅ Correct!" : "❌ Not quite."}
                The correct answer was: <strong>${correctText}</strong>
                ${isCorrect ? " Great job!" : " Read that part again and try the next question!"}
            </div>
        `;
  }

  return `
        <div class="question-block mc-question" data-question="${index}">
            <p><span class="label">Q${index + 1}:</span> ${question}</p>
            <div class="mc-options">
                ${optionsHtml}
            </div>
            ${feedbackHtml}
        </div>
    `;
}

function checkAnswer(lessonId, questionIndex, selected, correct) {
  const answerKey = `${lessonId}-q${questionIndex}`;
  if (answeredQuestions[answerKey] !== undefined) {
    return;
  }

  answeredQuestions[answerKey] = selected;

  const lesson = state.lessons.find((l) => l.id === lessonId);
  if (lesson) {
    renderLesson(lesson);
  }

  if (selected === correct) {
    showToast("✅ Correct! Well done!", false);
  } else {
    showToast("❌ Not quite. Check the story again!");
  }
}

// ============================================================
// Load Lessons - FIXED for GitHub Pages (relative path)
// ============================================================

async function loadLessons() {
  try {
    // Use relative path for GitHub Pages compatibility
    const response = await fetch("./data/lessons.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    state.lessons = data.lessons;
    state.isLoading = false;

    loadProgress();
    renderLessonList();
    updateProgress();

    const savedLesson = localStorage.getItem("janeEyreCurrentLesson");
    let lessonId = 1;

    if (savedLesson) {
      const parsed = parseInt(savedLesson);
      if (state.lessons.some((l) => l.id === parsed)) {
        lessonId = parsed;
      } else {
        localStorage.removeItem("janeEyreCurrentLesson");
        lessonId = 1;
      }
    }

    loadLesson(lessonId);
  } catch (error) {
    console.error("Error loading lessons:", error);
    DOM.lessonList.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #cc0000; font-weight: 600;">
                ❌ Sorry, couldn't load the lessons.<br>
                Please check your internet connection and try again.
            </div>
        `;
  }
}

// ============================================================
// Render Lesson List
// ============================================================

function renderLessonList() {
  if (state.lessons.length === 0) {
    DOM.lessonList.innerHTML = "<p>No lessons available.</p>";
    return;
  }

  let html =
    '<h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">📚 Lessons</h3>';

  state.lessons.forEach((lesson) => {
    const isCompleted = state.completedLessons.includes(lesson.id);
    const isActive = state.currentLessonId === lesson.id;
    const isLocked =
      !isCompleted &&
      lesson.id > 1 &&
      !state.completedLessons.includes(lesson.id - 1);

    let statusIcon = "⬜";
    let statusClass = "";

    if (isCompleted) {
      statusIcon = "✅";
      statusClass = "completed";
    } else if (isLocked) {
      statusIcon = "🔒";
      statusClass = "locked";
    }
    if (isActive) {
      statusClass += " active";
    }

    const isClickable = isCompleted || isActive || canCompleteLesson(lesson.id);

    html += `
            <div class="lesson-item ${statusClass}" 
                 data-lesson-id="${lesson.id}"
                 data-clickable="${isClickable}"
                 ${isClickable ? `onclick="loadLesson(${lesson.id})"` : 'style="cursor: not-allowed;"'}>
                <span class="status">${statusIcon}</span>
                <span class="title">${lesson.title}</span>
                <span class="badge">${lesson.sentences.length}</span>
            </div>
        `;
  });

  DOM.lessonList.innerHTML = html;
}

// ============================================================
// Load Lesson - WITH SCROLL TO TOP OF PAGE
// ============================================================

function loadLesson(lessonId) {
  const lesson = state.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    console.warn(`Lesson ${lessonId} not found`);
    return;
  }

  const isCompleted = state.completedLessons.includes(lessonId);
  const isCurrent = state.currentLessonId === lessonId;
  const isPreviousCompleted =
    lessonId === 1 || state.completedLessons.includes(lessonId - 1);

  if (!isCompleted && !isCurrent && !isPreviousCompleted) {
    showToast(`🔒 Please complete Lesson ${lessonId - 1} first.`);
    return;
  }

  state.currentLessonId = lessonId;
  localStorage.setItem("janeEyreCurrentLesson", lessonId.toString());

  document.querySelectorAll(".lesson-item").forEach((item) => {
    item.classList.remove("active");
    if (parseInt(item.dataset.lessonId) === lessonId) {
      item.classList.add("active");
    }
  });

  updateCurrentLessonDisplay(lessonId);
  renderLesson(lesson);
  DOM.lessonContent.classList.add("visible");

  // ============================================================
  // SCROLL TO TOP OF PAGE
  // ============================================================
  setTimeout(function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 150);

  const list = document.getElementById("lesson-list");
  const button = document.querySelector(".lesson-list-toggle .btn");

  if (list && list.classList.contains("lesson-list-expanded")) {
    list.classList.remove("lesson-list-expanded");
    list.classList.add("lesson-list-collapsed");
    lessonListVisible = false;
    if (button) button.textContent = "📚 Show Lessons List";
  }
}

// ============================================================
// Render Lesson Content
// ============================================================

function renderLesson(lesson) {
  const isCompleted = state.completedLessons.includes(lesson.id);
  const isFirst = lesson.id === 1;
  const isLast = lesson.id === state.lessons.length;
  const canComplete = canCompleteLesson(lesson.id);
  const isLocked = !canComplete && !isCompleted;
  const canGoNext = canComplete && !isLast;

  // Build sentence HTML
  let sentencesHtml = "";
  lesson.sentences.forEach((sentence) => {
    sentencesHtml += `<p>${sentence}</p>`;
  });

  // Build comprehension questions with MULTIPLE CHOICE
  let comprehensionHtml = "";
  lesson.comprehension.forEach((q, index) => {
    comprehensionHtml += renderMultipleChoice(q, index, lesson.id);
  });

  // Build discussion questions
  let discussionHtml = "";
  lesson.discussion.forEach((q, index) => {
    discussionHtml += `
            <div class="question-block">
                <p><span class="label">Q${index + 1}:</span> ${q}</p>
            </div>
        `;
  });

  // Count answered questions
  const totalQuestions = lesson.comprehension.length;
  let answeredCount = 0;
  let correctCount = 0;
  for (let i = 0; i < totalQuestions; i++) {
    const key = `${lesson.id}-q${i}`;
    if (answeredQuestions[key] !== undefined) {
      answeredCount++;
      const qData = getMultipleChoiceOptions(
        lesson.comprehension[i],
        lesson.id,
      );
      if (answeredQuestions[key] === qData.correct) {
        correctCount++;
      }
    }
  }

  // Practice note
  const practiceNote = `
        <div class="mc-practice-note">
            <span class="emoji">💡</span> 
            These questions are for practice and discussion. 
            You can mark this lesson complete anytime!
        </div>
    `;

  // Score display
  let scoreHtml = "";
  if (answeredCount > 0) {
    scoreHtml = `
            <div class="mc-score">
                📊 ${correctCount} / ${answeredCount} correct
                ${answeredCount === totalQuestions ? " 🎉 All answered!" : ""}
            </div>
        `;
  }

  // Locked warning
  let warningHtml = "";
  if (isLocked) {
    warningHtml = `
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin: 12px 0; color: #856404;">
                ⚠️ Please complete <strong>Lesson ${lesson.id - 1}</strong> before you can mark this lesson complete.
            </div>
        `;
  }

  // Completion message
  let completeMessageHtml = "";
  if (canComplete && !isCompleted && lesson.id > 1) {
    completeMessageHtml = `
            <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 12px 16px; margin: 12px 0; color: #155724;">
                ✅ Lesson ${lesson.id - 1} completed! You can now mark this lesson complete.
            </div>
        `;
  }

  // Build navigation buttons
  let navHtml = `
        <div class="lesson-nav">
            <button class="btn" onclick="loadLesson(${lesson.id - 1})" ${isFirst ? "disabled" : ""}>
                ← Previous
            </button>
            <button class="btn ${isCompleted ? "btn-success completed" : canComplete ? "btn-success" : "btn-disabled"}" 
                    onclick="${canComplete ? `toggleComplete(${lesson.id})` : ""}"
                    ${!canComplete && !isCompleted ? "disabled" : ""}>
                ${isCompleted ? "✅ Completed" : canComplete ? "☐ Mark Complete" : "🔒 Locked"}
            </button>
            <button class="btn btn-primary" onclick="loadLesson(${lesson.id + 1})" 
                    ${(!canGoNext && !isLast) || isLast ? "disabled" : ""}>
                Next →
            </button>
        </div>
    `;

  // Progress info
  const progressInfo = `
        <div style="text-align: center; margin-top: 16px; font-size: 14px; color: #666;">
            ${state.completedLessons.length} of ${state.lessons.length} lessons completed
        </div>
    `;

  // Assemble full lesson HTML
  const html = `
        <div class="lesson-header">
            <h3>${lesson.title}</h3>
            <span class="lesson-number">Lesson ${lesson.id} of ${state.lessons.length}</span>
        </div>
        
        ${warningHtml}
        ${completeMessageHtml}
        
        <div class="text-container">
            ${sentencesHtml}
        </div>
        
        <div class="questions-section comprehension">
            <h4>📝 Comprehension Questions</h4>
            <p style="margin-bottom: 12px; font-weight: 500; color: #000000; font-size: 15px;">
                Choose the best answer for each question.
            </p>
            ${practiceNote}
            ${comprehensionHtml}
            ${scoreHtml}
        </div>
        
        <div class="questions-section discussion">
            <h4>💬 Let's Discuss</h4>
            <p style="margin-bottom: 12px; font-weight: 500; color: #000000; font-size: 15px;">
                Think about these questions. Share your ideas.
            </p>
            ${discussionHtml}
        </div>
        
        ${navHtml}
        ${progressInfo}
    `;

  DOM.lessonContent.innerHTML = html;
}

// ============================================================
// Toggle Complete
// ============================================================

function toggleComplete(lessonId) {
  if (!canCompleteLesson(lessonId)) {
    showToast(`⚠️ Please complete Lesson ${lessonId - 1} first.`);
    return;
  }

  const index = state.completedLessons.indexOf(lessonId);
  if (index === -1) {
    state.completedLessons.push(lessonId);
    showToast(`✅ Lesson ${lessonId} completed!`, false);
  } else {
    state.completedLessons.splice(index, 1);
    showToast(`↩️ Lesson ${lessonId} un-completed.`, false);
  }

  saveProgress();
  renderLessonList();
  updateProgress();

  const lesson = state.lessons.find((l) => l.id === lessonId);
  if (lesson) {
    renderLesson(lesson);
  }

  updateCurrentLessonDisplay(state.currentLessonId);
}

// ============================================================
// Update Progress Bar
// ============================================================

function updateProgress() {
  const total = state.lessons.length;
  const completed = state.completedLessons.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (DOM.progressText)
    DOM.progressText.textContent = `${completed} / ${total} lessons`;
  if (DOM.progressFill) DOM.progressFill.style.width = `${percentage}%`;

  const stickyText = document.getElementById("sticky-progress-text");
  const stickyFill = document.getElementById("sticky-progress-fill");

  if (stickyText) stickyText.textContent = `${completed} / ${total}`;
  if (stickyFill) stickyFill.style.width = `${percentage}%`;
}

// ============================================================
// Update Current Lesson Display
// ============================================================

function updateCurrentLessonDisplay(lessonId) {
  const total = state.lessons.length;

  const indicator = document.getElementById("current-lesson-indicator");
  if (indicator) {
    indicator.textContent = `Lesson ${lessonId} of ${total}`;
  }

  const stickyCurrent = document.getElementById("sticky-current-lesson-text");
  if (stickyCurrent) {
    const lesson = state.lessons.find((l) => l.id === lessonId);
    const title = lesson ? lesson.title : `Lesson ${lessonId}`;
    const displayTitle =
      title.length > 30 ? title.substring(0, 27) + "..." : title;
    stickyCurrent.textContent = `${lessonId}: ${displayTitle}`;
  }
}

// ============================================================
// Lesson List Toggle
// ============================================================

let lessonListVisible = false;

function toggleLessonList() {
  const list = document.getElementById("lesson-list");
  const button = document.querySelector(".lesson-list-toggle .btn");

  lessonListVisible = !lessonListVisible;

  if (lessonListVisible) {
    list.classList.remove("lesson-list-collapsed");
    list.classList.add("lesson-list-expanded");
    button.textContent = "📚 Hide Lessons List";
  } else {
    list.classList.remove("lesson-list-expanded");
    list.classList.add("lesson-list-collapsed");
    button.textContent = "📚 Show Lessons List";
  }
}

// ============================================================
// Toggle Video
// ============================================================

function toggleVideo() {
  const container = document.getElementById("video-container");
  const icon = document.getElementById("video-toggle-icon");
  const text = document.getElementById("video-toggle-text");

  if (container.classList.contains("collapsed")) {
    container.classList.remove("collapsed");
    container.classList.add("expanded");
    icon.textContent = "▼";
    text.textContent = "Hide Video";
  } else {
    container.classList.remove("expanded");
    container.classList.add("collapsed");
    icon.textContent = "▶";
    text.textContent = "Show Video";
  }
}

// ============================================================
// Reset Progress
// ============================================================

function resetProgress() {
  if (confirm("Reset all progress? This cannot be undone.")) {
    localStorage.clear();
    state.completedLessons = [];
    state.currentLessonId = null;
    answeredQuestions = {};

    renderLessonList();
    updateProgress();
    updateCurrentLessonDisplay(1);
    loadLesson(1);

    localStorage.removeItem("janeEyreProgress");
    localStorage.removeItem("janeEyreCurrentLesson");

    setTimeout(function () {
      const check = localStorage.getItem("janeEyreCurrentLesson");
      if (check && check !== "1") {
        localStorage.clear();
        localStorage.setItem("janeEyreCurrentLesson", "1");
        state.currentLessonId = 1;
        loadLesson(1);
      }
      showToast("🔄 Progress has been reset!", false);
    }, 100);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
window.resetProgress = resetProgress;

// ============================================================
// Help Modal
// ============================================================

function openHelp() {
  const modal = document.getElementById("help-modal");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeHelp() {
  const modal = document.getElementById("help-modal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("help-modal");
  if (e.target === modal) {
    closeHelp();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeHelp();
  }
});

// ============================================================
// Print Full Story
// ============================================================

function printFullStory() {
  if (state.lessons.length === 0) {
    alert("Please wait for the lessons to load.");
    return;
  }

  let storyHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Jane Eyre - Full Story</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: white;
                    color: black;
                    line-height: 1.9;
                    padding: 60px 80px;
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    font-size: 32px;
                    text-align: center;
                    margin-bottom: 8px;
                    font-weight: 700;
                }
                .subtitle {
                    text-align: center;
                    font-size: 18px;
                    color: #4a4a4a;
                    margin-bottom: 40px;
                    font-style: italic;
                }
                .lesson-divider {
                    border-top: 3px solid #2a2a2a;
                    margin: 40px 0 30px 0;
                    padding-top: 20px;
                }
                .lesson-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: #1a1a1a;
                }
                .sentence {
                    font-size: 17px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    color: black;
                }
                .sentence:last-child {
                    margin-bottom: 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 2px solid #ccc;
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                }
                @media print {
                    body { padding: 40px; }
                    .lesson-divider { page-break-after: avoid; }
                }
                @media (max-width: 600px) {
                    body { padding: 20px; }
                    h1 { font-size: 24px; }
                    .lesson-title { font-size: 18px; }
                    .sentence { font-size: 16px; }
                }
            </style>
        </head>
        <body>
            <h1>📖 Jane Eyre</h1>
            <p class="subtitle">by Charlotte Brontë — Beginner Level</p>
    `;

  state.lessons.forEach((lesson) => {
    storyHtml += `
            <div class="lesson-divider">
                <div class="lesson-title">Lesson ${lesson.id}: ${lesson.title}</div>
        `;
    lesson.sentences.forEach((sentence) => {
      storyHtml += `<div class="sentence">${sentence}</div>`;
    });
    storyHtml += `</div>`;
  });

  storyHtml += `
            <div class="footer">
                The End — Read & Understand Edition
            </div>
        </body>
        </html>
    `;

  const printWindow = window.open("", "_blank", "width=900,height=800");
  if (!printWindow) {
    alert("Please allow pop-ups to print the story.");
    return;
  }

  printWindow.document.write(storyHtml);
  printWindow.document.close();

  printWindow.onload = function () {
    setTimeout(function () {
      printWindow.print();
    }, 500);
  };
}
window.printFullStory = printFullStory;

// ============================================================
// Keyboard Navigation
// ============================================================

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("help-modal");
  if (modal.classList.contains("show")) {
    return;
  }

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    const current = state.currentLessonId;
    if (current && current < state.lessons.length) {
      if (state.completedLessons.includes(current)) {
        e.preventDefault();
        loadLesson(current + 1);
      } else {
        showToast(
          "📚 Complete this lesson first before moving to the next one.",
        );
      }
    }
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    const current = state.currentLessonId;
    if (current && current > 1) {
      e.preventDefault();
      loadLesson(current - 1);
    }
  }
});

// ============================================================
// Service Worker
// ============================================================

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Service Worker updated.");
  });
}

// ============================================================
// Initialize App
// ============================================================

function init() {
  console.log("📖 Jane Eyre - Read & Understand");
  console.log("🧠 Goal: Train your brain to understand English naturally.");
  console.log(
    "⌨️ Keyboard shortcuts: ← / ↑ = Previous lesson, → / ↓ = Next lesson (if completed)",
  );
  console.log("❓ Click the Help button for the user guide.");
  loadLessons();
}

document.addEventListener("DOMContentLoaded", init);

// ----- Expose functions globally -----
window.loadLesson = loadLesson;
window.toggleComplete = toggleComplete;
window.toggleLessonList = toggleLessonList;
window.toggleVideo = toggleVideo;
window.openHelp = openHelp;
window.closeHelp = closeHelp;
window.resetProgress = resetProgress;
window.printFullStory = printFullStory;
window.checkAnswer = checkAnswer;

window.addEventListener("online", () => {
  console.log("🟢 You are back online!");
});

window.addEventListener("offline", () => {
  console.log("🔴 You are offline. The app will still work from cache.");
});

function showWelcomeMessage() {
  const hasVisited = localStorage.getItem("janeEyreVisited");
  if (!hasVisited) {
    console.log("👋 Welcome to Jane Eyre - Read & Understand!");
    console.log(
      "📚 Complete lessons in order. Each lesson unlocks the next one.",
    );
    console.log("✅ Mark each lesson as complete when you finish.");
    localStorage.setItem("janeEyreVisited", "true");
  }
}

setTimeout(showWelcomeMessage, 1000);
