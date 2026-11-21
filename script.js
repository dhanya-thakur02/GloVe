/* =========================
   GLOVE PAGE DATA
   All windows, counts, probabilities and ratios were checked in Python.
========================= */

const PAGE = {
    name: "GloVe",
    all:  "Excellent! You can build co-occurrence counts, turn them into probabilities, and explain how GloVe differs from Word2Vec.",
    good: "Good job! Review the questions you missed and try again.",
    low:  "Keep practicing! Remember: GloVe counts how often words appear near each other across the whole corpus, then learns vectors from those counts."
};

/* Warm-up: "the dog barks loudly", target word "dog", window size 1 -> the, barks */
const practice = {
    words: ["the", "dog", "barks", "loudly"],
    answer: [0, 2],
    correctHtml: "With window size 1, <strong>dog</strong> co-occurs with <strong>the</strong> and <strong>barks</strong>.",
    wrongHtml: "Window size 1 means one word on each side of \"dog\". Pick the word just before it and the word just after it.",
    result: {
        label: "Co-occurrence counts for \"dog\" (window size 1):",
        items: [{ text: "dog – the: 1", hot: true }, { text: "dog – barks: 1", hot: true }]
    }
};

const WHO_OPTIONS = ["Word2Vec", "GloVe", "Both"];

const questions = [
    /* ---------- EASY ---------- */
    {
        level: "easy",
        type: "choice",
        title: "Local or global?",
        instruction: "Word2Vec learns from small windows of text, one window at a time. GloVe first counts word pairs over the whole corpus and learns from those global counts.",
        prompt: "Complete each statement.",
        items: [
            { label: "Word2Vec learns by",                                        options: ["predicting words inside a local window", "using corpus-wide co-occurrence counts"], answer: "predicting words inside a local window" },
            { label: "GloVe learns from",                                         options: ["predicting words inside a local window", "corpus-wide co-occurrence counts"],       answer: "corpus-wide co-occurrence counts" },
            { label: "Which one builds a co-occurrence matrix first?",            options: ["Word2Vec", "GloVe"],                                                                answer: "GloVe" },
            { label: "GloVe stands for",                                          options: ["Global Vectors", "Graph Vectors", "General Vocabulary"],                            answer: "Global Vectors" }
        ],
        explain: "<strong>Word2Vec</strong> slides a window over the text and learns by predicting words. " +
                 "<strong>GloVe</strong> (Global Vectors) first counts how often every pair of words appears together across the <strong>whole corpus</strong>, then learns vectors from that table of counts."
    },
    {
        level: "easy",
        type: "select",
        title: "Find the co-occurring pairs",
        instruction: "Two words co-occur when they appear within the window of each other. With window size 1, only neighbouring words count. Click every valid pair.",
        prompt: "Which pairs co-occur in \"ice is cold and steam is hot\" with window size 1?",
        sentence: ["ice – is", "ice – cold", "cold – and", "steam – hot", "steam – is", "is – hot", "cold – steam"],
        answers: [0, 2, 4, 5],
        explain: "Neighbouring words co-occur: <strong>ice – is, cold – and, steam – is, is – hot</strong>. " +
                 "<strong>ice – cold</strong>, <strong>steam – hot</strong> and <strong>cold – steam</strong> have a word between them, so they are 2 positions apart and outside window size 1."
    },
    {
        level: "easy",
        type: "choice",
        title: "Read the co-occurrence table",
        instruction: "Each number says how many times a word appeared near \"ice\" or \"steam\" in a large corpus. Read the table and answer.",
        prompt: "ice: solid 80, gas 2, water 18  |  steam: solid 3, gas 70, water 17",
        items: [
            { label: "Which word appears most often near \"ice\"?",           options: ["solid", "gas", "water"], answer: "solid" },
            { label: "Which word appears most often near \"steam\"?",         options: ["solid", "gas", "water"], answer: "gas" },
            { label: "Total co-occurrences of \"ice\" (add up its row)",      options: ["90", "100", "110"],      answer: "100" },
            { label: "Total co-occurrences of \"steam\" (add up its row)",    options: ["80", "90", "100"],       answer: "90" }
        ],
        explain: "\"ice\" is near <strong>solid</strong> 80 times, and \"steam\" is near <strong>gas</strong> 70 times, which matches what we know about them. " +
                 "Row totals: ice = 80 + 2 + 18 = <strong>100</strong>, steam = 3 + 70 + 17 = <strong>90</strong>. We will need these totals for probabilities later."
    },
    {
        level: "easy",
        type: "choice",
        title: "Pre-trained GloVe vectors",
        instruction: "Training GloVe on a huge corpus takes a long time, so people usually download ready-made vectors. Their file names tell you the size, such as glove.6B.100d.",
        prompt: "Answer each question.",
        items: [
            { label: "Pre-trained GloVe vectors are trained on",                options: ["a very large text corpus", "only your small class dataset", "image datasets"], answer: "a very large text corpus" },
            { label: "\"glove.6B.100d\" means every word has a vector of",       options: ["6 numbers", "100 numbers", "6 billion numbers"],                              answer: "100 numbers" },
            { label: "Words with similar meanings have vectors that are",       options: ["close together", "far apart", "identical"],                                   answer: "close together" }
        ],
        explain: "The 6B in the name is the number of words in the training text and <strong>100d</strong> means <strong>100 dimensions</strong>, so each word is a vector of 100 numbers. " +
                 "As with Word2Vec, words used in similar ways end up <strong>close together</strong>."
    },

    /* ---------- MEDIUM ---------- */
    {
        level: "medium",
        type: "choice",
        title: "Count the co-occurrences",
        instruction: "Count how many times each pair is neighbours (window size 1). Order does not matter: (I, like) and (like, I) are the same pair.",
        prompt: "Corpus: \"I like cats and I like dogs\"",
        items: [
            { label: "How many times do \"I\" and \"like\" co-occur?",                       options: ["1", "2", "3"], answer: "2" },
            { label: "How many times do \"like\" and \"dogs\" co-occur?",                    options: ["0", "1", "2"], answer: "1" },
            { label: "How many times do \"like\" and \"and\" co-occur?",                     options: ["0", "1", "2"], answer: "0" },
            { label: "Total co-occurrences of \"like\" with all its neighbours",            options: ["3", "4", "6"], answer: "4" }
        ],
        explain: "The neighbouring pairs are: <strong>I–like, like–cats, cats–and, and–I, I–like, like–dogs</strong>. " +
                 "So I–like appears <strong>2</strong> times and like–dogs <strong>1</strong> time. " +
                 "\"like\" and \"and\" are 2 positions apart, so with window size 1 they never co-occur: <strong>0</strong>. " +
                 "\"like\" has I (2 times), cats (1) and dogs (1), which is <strong>4</strong> in total."
    },
    {
        level: "medium",
        type: "choice",
        title: "Turn counts into probabilities",
        instruction: "P(j | i) = X(i, j) ÷ X(i): the count of j near i, divided by the total count for i. Use the table: ice (solid 80, gas 2, water 18, total 100) and steam (solid 3, gas 70, water 17, total 90).",
        prompt: "Find each probability.",
        items: [
            { label: "P(solid | ice)",  options: ["0.2", "0.8", "0.08"],    answer: "0.8" },
            { label: "P(gas | ice)",    options: ["0.02", "0.2", "0.002"],  answer: "0.02" },
            { label: "P(gas | steam)",  options: ["7/9", "7/10", "2/9"],    answer: "7/9" },
            { label: "P(water | ice)",  options: ["0.18", "0.018", "0.82"], answer: "0.18" }
        ],
        explain: "<strong>P(solid | ice)</strong> = 80 ÷ 100 = <strong>0.8</strong>. <strong>P(gas | ice)</strong> = 2 ÷ 100 = <strong>0.02</strong>. " +
                 "<strong>P(gas | steam)</strong> = 70 ÷ 90 = <strong>7/9</strong> (about 0.78), because steam's row total is 90, not 100. " +
                 "<strong>P(water | ice)</strong> = 18 ÷ 100 = <strong>0.18</strong>."
    },
    {
        level: "medium",
        type: "choice",
        title: "Effect of the window size",
        instruction: "A bigger window counts more pairs. The number of word pairs inside a window of size w in a T-word sentence is (T − 1) + (T − 2) + … + (T − w).",
        prompt: "Corpus: \"I like cats and I like dogs\" (7 words)",
        items: [
            { label: "Word pairs inside a window of size 1",                   options: ["6", "7", "11"],  answer: "6" },
            { label: "Word pairs inside a window of size 2",                   options: ["11", "12", "13"], answer: "11" },
            { label: "Word pairs inside a window of size 3",                   options: ["15", "16", "18"], answer: "15" },
            { label: "Co-occurrences of \"like\" and \"and\" with window size 2", options: ["0", "1", "2"],    answer: "2" }
        ],
        explain: "Window 1: 6 pairs. Window 2 adds the 5 pairs that are 2 apart: 6 + 5 = <strong>11</strong>. Window 3 adds 4 more: 11 + 4 = <strong>15</strong>. " +
                 "With window 2, \"like\" and \"and\" are close enough to count, and they are 2 apart twice in the sentence (positions 2 and 4, and positions 4 and 6), so the count is <strong>2</strong>. " +
                 "Unlike the Word2Vec pair count, each unordered pair is counted once here."
    },

    /* ---------- HARD ---------- */
    {
        level: "hard",
        type: "choice",
        title: "The ratio idea behind GloVe",
        instruction: "GloVe compares P(k | ice) ÷ P(k | steam). Much greater than 1: k relates to ice. Much less than 1: k relates to steam. About 1: k relates to both or to neither. Use P(solid | ice) = 0.8, P(solid | steam) = 1/30, P(gas | ice) = 0.02, P(gas | steam) = 7/9, P(water | ice) = 0.18, P(water | steam) = 17/90.",
        prompt: "What is the ratio for each word k?",
        items: [
            { label: "k = solid  (0.8 ÷ 1/30 = 24)",                          options: ["much greater than 1", "about 1", "much less than 1"], answer: "much greater than 1" },
            { label: "k = gas  (0.02 ÷ 7/9 ≈ 0.03)",                          options: ["much greater than 1", "about 1", "much less than 1"], answer: "much less than 1" },
            { label: "k = water  (0.18 ÷ 17/90 ≈ 0.95)",                      options: ["much greater than 1", "about 1", "much less than 1"], answer: "about 1" },
            { label: "A ratio close to 1 means the word k is",                options: ["related only to ice", "related equally to both (or neither)", "related only to steam"], answer: "related equally to both (or neither)" }
        ],
        explain: "<strong>solid</strong> gives 24, so it separates ice from steam. <strong>gas</strong> gives about 0.03, so it points to steam. " +
                 "<strong>water</strong> gives about 0.95, so it is about 1: water relates to both, which makes it useless for telling them apart. " +
                 "GloVe learns vectors whose differences reproduce these ratios, which is why it uses ratios of probabilities and not raw counts."
    },
    {
        level: "hard",
        type: "select",
        title: "Spot the mistake in the counts",
        instruction: "A student counted the co-occurrences in \"I like cats and I like dogs\" with window size 1. Some entries are wrong. Click every wrong entry.",
        prompt: "Which of the student's entries are wrong?",
        sentence: ["(I, like) = 2", "(like, cats) = 1", "(cats, and) = 1", "(and, I) = 2", "(like, dogs) = 1", "(I, cats) = 1"],
        answers: [3, 5],
        explain: "The correct counts are <strong>(I, like) = 2, (like, cats) = 1, (cats, and) = 1, (and, I) = 1, (like, dogs) = 1</strong>. " +
                 "<strong>(and, I) = 2</strong> is wrong because \"and\" and \"I\" are neighbours only once (the first \"I\" is not next to \"and\"). " +
                 "<strong>(I, cats)</strong> is wrong because \"I\" and \"cats\" have \"like\" between them, so they are outside window size 1. " +
                 "The correct counts add up to 6, which matches the 7 − 1 = 6 pairs in a window of size 1."
    },
    {
        level: "hard",
        type: "choice",
        title: "Word2Vec, GloVe, or both?",
        instruction: "Decide which method each statement describes. Choose \"Both\" if it is true for Word2Vec and for GloVe.",
        prompt: "Which method does each statement describe?",
        items: [
            { label: "Learns by predicting words inside a small window",                  options: WHO_OPTIONS, answer: "Word2Vec" },
            { label: "Builds a corpus-wide co-occurrence matrix before training",         options: WHO_OPTIONS, answer: "GloVe" },
            { label: "Gives each word one fixed vector, whatever sentence it appears in", options: WHO_OPTIONS, answer: "Both" },
            { label: "Needs a window size setting",                                       options: WHO_OPTIONS, answer: "Both" }
        ],
        explain: "<strong>Word2Vec</strong> predicts words in a local window. <strong>GloVe</strong> builds the global co-occurrence matrix first. " +
                 "<strong>Both</strong> produce a single fixed (static) vector per word, so \"bank\" has the same vector in \"river bank\" and \"bank loan\", " +
                 "and <strong>both</strong> need a window size to decide which words count as being near each other."
    }
];

/* =========================
   QUIZ ENGINE
   Expects these globals from the data section above:
   practice  - warm-up config
   questions - the 10 questions
   PAGE      - text for the final screen
========================= */

const LEVEL_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };
const practiceAnswer = new Set(practice.answer);
let practiceSelection = new Set();

let currentQuestionIndex = 0;
let selections = questions.map(q =>
    q.type === "select" ? new Set() : q.items.map(() => null)
);
let questionResults = new Array(questions.length).fill(null);

/* =========================
   SHARED HELPERS
========================= */

function makeChip(text, isSelected, onClick) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "word-chip" + (isSelected ? " selected" : "");
    chip.textContent = text;
    chip.setAttribute("aria-pressed", isSelected ? "true" : "false");
    chip.addEventListener("click", onClick);
    return chip;
}

function setChipSelected(chip, isSelected) {
    chip.classList.toggle("selected", isSelected);
    chip.setAttribute("aria-pressed", isSelected ? "true" : "false");
}

function sameSet(a, b) {
    return a.size === b.size && [...a].every(v => b.has(v));
}

/* =========================
   WARM-UP
========================= */

function renderPractice() {
    const container = document.getElementById("practiceSentence");
    container.innerHTML = "";
    practiceSelection = new Set();

    practice.words.forEach((word, index) => {
        const chip = makeChip(word, false, () => {
            if (practiceSelection.has(index)) practiceSelection.delete(index);
            else practiceSelection.add(index);
            setChipSelected(chip, practiceSelection.has(index));
        });
        container.appendChild(chip);
    });
}

function checkPractice() {
    const feedback = document.getElementById("practiceFeedback");
    const result = document.getElementById("practiceResult");
    const isCorrect = sameSet(practiceSelection, practiceAnswer);

    feedback.className = isCorrect ? "feedback show correct" : "feedback show wrong";
    feedback.innerHTML = isCorrect
        ? "<strong>🎉 Correct!</strong><br>" + practice.correctHtml
        : "<strong>❌ Not quite.</strong><br>" + practice.wrongHtml;

    result.className = "practice-result show";
    result.innerHTML = `
        <div class="result-label">${practice.result.label}</div>
        <div class="result-chips">
            ${practice.result.items.map(t => `<span class="result-chip${t.hot ? " changed" : ""}">${t.text}</span>`).join("")}
        </div>
    `;

    document.querySelectorAll("#practiceSentence .word-chip").forEach((chip, index) => {
        chip.classList.remove("correct", "missed", "wrong-selected");
        if (practiceAnswer.has(index)) {
            chip.classList.add(practiceSelection.has(index) ? "correct" : "missed");
        } else if (practiceSelection.has(index)) {
            chip.classList.add("wrong-selected");
        }
    });
}

/* =========================
   PROGRESS STRIP
========================= */

function buildProgressStrip() {
    const strip = document.getElementById("progressStrip");
    strip.innerHTML = "";
    questions.forEach((q, i) => {
        const seg = document.createElement("button");
        seg.type = "button";
        seg.className = "progress-seg seg-" + q.level;
        seg.textContent = i + 1;
        seg.addEventListener("click", () => {
            currentQuestionIndex = i;
            renderQuestion();
        });
        strip.appendChild(seg);
    });
}

function updateProgressStrip() {
    document.querySelectorAll("#progressStrip .progress-seg").forEach((seg, i) => {
        const r = questionResults[i];
        seg.classList.toggle("seg-correct", r === true);
        seg.classList.toggle("seg-wrong", r === false);
        seg.classList.toggle("seg-current", i === currentQuestionIndex);
        const status = r === true ? "correct" : r === false ? "incorrect" : "not checked";
        seg.setAttribute("aria-label", `Question ${i + 1}, ${LEVEL_LABEL[questions[i].level]}, ${status}`);
        if (i === currentQuestionIndex) seg.setAttribute("aria-current", "step");
        else seg.removeAttribute("aria-current");
    });
}

/* =========================
   TASK RENDERING
========================= */

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const area = document.getElementById("taskArea");
    area.innerHTML = "";

    document.getElementById("currentQuestion").textContent = currentQuestionIndex + 1;
    document.getElementById("questionInstruction").textContent = q.instruction;

    const box = document.getElementById("questionBox");
    box.innerHTML = "";
    const meta = document.createElement("div");
    meta.className = "question-meta";
    const title = document.createElement("span");
    title.className = "question-title";
    title.textContent = q.title;
    const level = document.createElement("span");
    level.className = "level level-" + q.level;
    level.textContent = LEVEL_LABEL[q.level];
    meta.append(title, level);
    const prompt = document.createElement("div");
    prompt.className = "question-prompt";
    prompt.textContent = q.prompt;
    box.append(meta, prompt);

    if (q.type === "select") renderSelectQuestion(q, area);
    else renderChoiceQuestion(q, area);

    resetFeedback();

    if (questionResults[currentQuestionIndex] !== null) {
        applyMarks();
        showFeedback(true);
    }

    updateSelectionStatus();
    updateNavigationButtons();
    updateProgressStrip();
}

function renderSelectQuestion(q, area) {
    const wrap = document.createElement("div");
    wrap.className = "task-word-area";
    wrap.id = "taskWords";
    const selection = selections[currentQuestionIndex];

    q.sentence.forEach((word, index) => {
        const chip = makeChip(word, selection.has(index), () => {
            if (selection.has(index)) selection.delete(index);
            else selection.add(index);
            setChipSelected(chip, selection.has(index));
            onSelectionChanged();
        });
        wrap.appendChild(chip);
    });
    area.appendChild(wrap);
}

function renderChoiceQuestion(q, area) {
    const list = document.createElement("div");
    list.className = "choice-list";
    const picks = selections[currentQuestionIndex];

    q.items.forEach((item, rowIndex) => {
        const row = document.createElement("div");
        row.className = "choice-row";
        row.dataset.row = rowIndex;

        const label = document.createElement("div");
        label.className = "choice-label";
        label.textContent = item.label;

        const options = document.createElement("div");
        options.className = "choice-options";

        item.options.forEach(option => {
            const chip = makeChip(option, picks[rowIndex] === option, () => {
                picks[rowIndex] = option;
                options.querySelectorAll(".word-chip").forEach(c => setChipSelected(c, c === chip));
                onSelectionChanged();
            });
            chip.dataset.option = option;
            options.appendChild(chip);
        });

        row.append(label, options);
        list.appendChild(row);
    });
    area.appendChild(list);
}

function onSelectionChanged() {
    // Changing an answer after checking clears the old result so it can be checked again.
    if (questionResults[currentQuestionIndex] !== null) {
        questionResults[currentQuestionIndex] = null;
        clearMarks();
        resetFeedback();
        updateProgressStrip();
    }
    updateSelectionStatus();
}

function updateSelectionStatus() {
    const q = questions[currentQuestionIndex];
    const status = document.getElementById("selectionStatus");
    if (q.type === "select") {
        const count = selections[currentQuestionIndex].size;
        status.textContent = `${count} item${count === 1 ? "" : "s"} selected`;
    } else {
        const answered = selections[currentQuestionIndex].filter(v => v !== null).length;
        status.textContent = `${answered} of ${q.items.length} answered`;
    }
}

/* =========================
   CHECKING
========================= */

function checkAnswer() {
    const q = questions[currentQuestionIndex];
    const feedback = document.getElementById("feedback");
    let isCorrect;

    if (q.type === "select") {
        const selected = selections[currentQuestionIndex];
        if (selected.size === 0) {
            feedback.className = "feedback show wrong";
            feedback.innerHTML = "<strong>Select at least one item first.</strong><br>Click the items you think match, then check again.";
            return;
        }
        isCorrect = sameSet(selected, new Set(q.answers));
    } else {
        const picks = selections[currentQuestionIndex];
        if (picks.some(p => p === null)) {
            feedback.className = "feedback show wrong";
            feedback.innerHTML = "<strong>Answer every row first.</strong><br>Pick one option in each row, then check again.";
            return;
        }
        isCorrect = q.items.every((item, i) => picks[i] === item.answer);
    }

    questionResults[currentQuestionIndex] = isCorrect;
    applyMarks();
    showFeedback(false);
    updateProgressStrip();
}

function applyMarks() {
    const q = questions[currentQuestionIndex];

    if (q.type === "select") {
        const selected = selections[currentQuestionIndex];
        const correct = new Set(q.answers);
        document.querySelectorAll("#taskWords .word-chip").forEach((chip, index) => {
            chip.classList.remove("correct", "missed", "wrong-selected");
            if (correct.has(index)) chip.classList.add(selected.has(index) ? "correct" : "missed");
            else if (selected.has(index)) chip.classList.add("wrong-selected");
        });
        return;
    }

    const picks = selections[currentQuestionIndex];
    document.querySelectorAll(".choice-row").forEach(row => {
        const rowIndex = Number(row.dataset.row);
        const item = q.items[rowIndex];
        const rowCorrect = picks[rowIndex] === item.answer;
        row.classList.remove("row-correct", "row-wrong");
        row.classList.add(rowCorrect ? "row-correct" : "row-wrong");

        row.querySelectorAll(".word-chip").forEach(chip => {
            chip.classList.remove("correct", "missed", "wrong-selected");
            if (chip.dataset.option === item.answer) chip.classList.add("correct");
            else if (chip.dataset.option === picks[rowIndex]) chip.classList.add("wrong-selected");
        });
    });
}

function clearMarks() {
    document.querySelectorAll("#taskArea .word-chip").forEach(chip =>
        chip.classList.remove("correct", "missed", "wrong-selected"));
    document.querySelectorAll(".choice-row").forEach(row =>
        row.classList.remove("row-correct", "row-wrong"));
}

function showFeedback(isSaved) {
    const q = questions[currentQuestionIndex];
    const feedback = document.getElementById("feedback");
    const explain = document.getElementById("explainBox");
    const ok = questionResults[currentQuestionIndex] === true;

    feedback.className = ok ? "feedback show correct" : "feedback show wrong";
    if (ok) {
        feedback.innerHTML = isSaved
            ? "<strong>🎉 Correct!</strong><br>You answered this question correctly."
            : "<strong>🎉 Correct!</strong><br>Every answer is right.";
    } else {
        feedback.innerHTML = "<strong>❌ Not quite.</strong><br>The correct answers are highlighted in green. Read the explanation below, then change your answers to try again.";
    }

    explain.className = "explain-box show";
    explain.innerHTML = "<strong>Why:</strong> " + q.explain;
}

function resetFeedback() {
    const feedback = document.getElementById("feedback");
    const explain = document.getElementById("explainBox");
    feedback.className = "feedback";
    feedback.innerHTML = "";
    explain.className = "explain-box";
    explain.innerHTML = "";
}

/* =========================
   NAVIGATION & FINISH
========================= */

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function updateNavigationButtons() {
    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");
    previousButton.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Finish Task ✓";
        nextButton.onclick = finishTask;
    } else {
        nextButton.textContent = "Next →";
        nextButton.onclick = nextQuestion;
    }
}

function finishTask() {
    const score = questionResults.filter(r => r === true).length;
    const total = questions.length;
    const taskCard = document.querySelector(".task-card");

    const levelScores = ["easy", "medium", "hard"].map(level => {
        const idx = questions.map((q, i) => q.level === level ? i : -1).filter(i => i !== -1);
        const got = idx.filter(i => questionResults[i] === true).length;
        return `<li><span><span class="level level-${level}">${LEVEL_LABEL[level]}</span></span><span>${got} / ${idx.length}</span></li>`;
    }).join("");

    const recap = questions.map((q, i) => {
        const status = questionResults[i] === true
            ? '<span class="ok">Correct</span>'
            : questionResults[i] === false
                ? '<span class="no">Incorrect</span>'
                : '<span class="no">Not checked</span>';
        return `<li><span>${i + 1}. ${q.title}</span>${status}</li>`;
    }).join("");

    taskCard.innerHTML = `
        <div class="final-score">
            <div class="score-icon">🎉</div>
            <h2>Task Completed!</h2>
            <p>You completed all ${total} ${PAGE.name} challenges.</p>
            <div class="score-circle">${score}/${total}</div>
            <ul class="recap">${levelScores}</ul>
            <ul class="recap">${recap}</ul>
            <p class="score-message">
                ${score === total
                    ? PAGE.all
                    : score >= Math.ceil(total * 0.7)
                    ? PAGE.good
                    : PAGE.low
                }
            </p>
            <button onclick="restartQuiz()">Try Again</button>
        </div>
    `;
}

function restartQuiz() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("totalQuestions").textContent = questions.length;
    renderPractice();
    buildProgressStrip();
    renderQuestion();
});
