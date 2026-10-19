// ---------- Speicher ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("cali-" + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("cali-" + key, JSON.stringify(value)); } catch {}
  },
};

const state = {
  workouts: store.get("workouts", DEFAULT_WORKOUTS),
  history: store.get("history", []),
  food: store.get("food", {}),
  goals: store.get("goals", { kcal: 2500, protein: 150 }),
  skillProgress: store.get("skills", {}),
  live: null,
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

// ---------- Navigation ----------
document.querySelectorAll(".tabs button").forEach((btn) =>
  btn.addEventListener("click", () => showView(btn.dataset.view)));

function showView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
}

// ---------- Workouts ----------
function renderWorkouts() {
  $("#workout-list").innerHTML = state.workouts.map((w) => `
    <div class="item">
      <div><b>${esc(w.name)}</b><br>
        <small>${w.exercises.map((e) => `${esc(e.name)} ${e.sets}×${e.reps}`).join(" · ")}</small></div>
      <div class="stack" style="margin:0">
        <button class="small" data-start="${w.id}">Start</button>
        <button class="small ghost" data-del="${w.id}">Löschen</button>
      </div>
    </div>`).join("") || `<p class="muted">Noch keine Workouts.</p>`;
}

$("#workout-list").addEventListener("click", (e) => {
  const start = e.target.dataset.start, del = e.target.dataset.del;
  if (start) startSession(+start);
  if (del && confirmDelete()) {
    state.workouts = state.workouts.filter((w) => w.id !== +del);
    store.set("workouts", state.workouts); renderWorkouts();
  }
});
function confirmDelete() { return true; }

function addExerciseRow() {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<input placeholder="Übung" class="ex-name" required>
    <input type="number" min="1" value="3" class="ex-sets" title="Sätze">
    <input type="number" min="1" value="10" class="ex-reps" title="Wdh.">
    <button type="button" class="small ghost">✕</button>`;
  row.querySelector("button").onclick = () => row.remove();
  $("#exercise-rows").append(row);
}
$("#add-row").onclick = addExerciseRow;
addExerciseRow();

$("#workout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const exercises = [...document.querySelectorAll("#exercise-rows .row")].map((r) => ({
    name: r.querySelector(".ex-name").value.trim(),
    sets: +r.querySelector(".ex-sets").value || 1,
    reps: +r.querySelector(".ex-reps").value || 1,
  })).filter((x) => x.name);
  if (!exercises.length) return;
  state.workouts.push({ id: Date.now(), name: e.target.name.value.trim(), exercises });
  store.set("workouts", state.workouts);
  e.target.reset(); $("#exercise-rows").innerHTML = ""; addExerciseRow();
  renderWorkouts();
});

// ---------- Live-Session ----------
let tick = null;

function startSession(id) {
  const w = state.workouts.find((x) => x.id === id);
  if (!w) return;
  state.live = {
    name: w.name, start: Date.now(), restUntil: 0,
    exercises: w.exercises.map((e) => ({ ...e, done: Array(e.sets).fill(false) })),
  };
  clearInterval(tick);
  tick = setInterval(updateClock, 500);
  renderLive(); showView("live");
}

function updateClock() {
  if (!state.live) return;
  $("#live-clock").textContent = fmt(Math.floor((Date.now() - state.live.start) / 1000));
  const rest = Math.ceil((state.live.restUntil - Date.now()) / 1000);
  $("#rest-clock").hidden = rest <= 0;
  if (rest > 0) $("#rest-clock").textContent = `Pause: ${rest} s`;
}

function renderLive() {
  const on = !!state.live;
  $("#live").hidden = !on; $("#live-empty").hidden = on;
  if (!on) return;
  $("#live-name").textContent = state.live.name;
  $("#live-sets").innerHTML = state.live.exercises.map((ex, i) => `
    <div class="card"><b>${esc(ex.name)}</b> <small class="muted">${ex.reps} Wdh.</small>
      <div class="set-row">${ex.done.map((d, j) =>
        `<button class="small ${d ? "done" : "ghost"}" data-ex="${i}" data-set="${j}">${j + 1}</button>`).join("")}
      </div></div>`).join("");
  updateClock();
}

$("#live-sets").addEventListener("click", (e) => {
  const { ex, set } = e.target.dataset;
  if (ex === undefined) return;
  const arr = state.live.exercises[ex].done;
  arr[set] = !arr[set];
  if (arr[set]) state.live.restUntil = Date.now() + 90 * 1000; // 90 s Pause
  renderLive();
});

$("#finish").onclick = () => {
  const l = state.live;
  const sets = l.exercises.reduce((n, e) => n + e.done.filter(Boolean).length, 0);
  state.history.unshift({ date: today(), name: l.name, minutes: Math.round((Date.now() - l.start) / 60000), sets });
  store.set("history", state.history.slice(0, 100));
  state.live = null; clearInterval(tick);
  renderLive(); renderHistory(); renderStreak();
};

function renderHistory() {
  $("#history").innerHTML = state.history.slice(0, 15).map((h) => `
    <div class="item"><div><b>${esc(h.name)}</b><br><small>${h.date}</small></div>
    <small>${h.minutes} min · ${h.sets} Sätze</small></div>`).join("") || `<p class="muted">Noch keine Sessions.</p>`;
}

function renderStreak() {
  const days = new Set(state.history.map((h) => h.date));
  let streak = 0; const d = new Date();
  if (!days.has(today())) d.setDate(d.getDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  $("#streak").textContent = streak ? `🔥 ${streak} Tag${streak > 1 ? "e" : ""} Streak` : "";
}

// ---------- Ernährung ----------
function todaysFood() { return state.food[today()] || []; }

function renderFood() {
  const items = todaysFood();
  const sum = (k) => items.reduce((n, x) => n + (+x[k] || 0), 0);
  const pct = (v, g) => Math.min(100, g ? (v / g) * 100 : 0);
  $("#macros").innerHTML = `
    <div class="macro"><b>${sum("kcal")}</b><small>/ ${state.goals.kcal} kcal</small>
      <div class="bar"><i style="width:${pct(sum("kcal"), state.goals.kcal)}%"></i></div></div>
    <div class="macro"><b>${sum("protein")} g</b><small>/ ${state.goals.protein} g Protein</small>
      <div class="bar"><i style="width:${pct(sum("protein"), state.goals.protein)}%"></i></div></div>
    <div class="macro"><b>${sum("carbs")} g</b><small>KH</small></div>
    <div class="macro"><b>${sum("fat")} g</b><small>Fett</small></div>`;
  $("#food-list").innerHTML = items.map((f, i) => `
    <div class="item"><div><b>${esc(f.name)}</b><br>
      <small>${f.kcal} kcal · P ${f.protein || 0} · KH ${f.carbs || 0} · F ${f.fat || 0}</small></div>
      <button class="small ghost" data-food="${i}">✕</button></div>`).join("");
  $("#goal-form").kcal.value = state.goals.kcal;
  $("#goal-form").protein.value = state.goals.protein;
}

$("#food-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  state.food[today()] = [...todaysFood(), f];
  store.set("food", state.food); e.target.reset(); renderFood();
});

$("#food-list").addEventListener("click", (e) => {
  const i = e.target.dataset.food;
  if (i === undefined) return;
  state.food[today()] = todaysFood().filter((_, j) => j !== +i);
  store.set("food", state.food); renderFood();
});

$("#goal-form").addEventListener("submit", (e) => {
  e.preventDefault();
  state.goals = { kcal: +e.target.kcal.value || 0, protein: +e.target.protein.value || 0 };
  store.set("goals", state.goals); renderFood();
});

// ---------- Skills ----------
let skillFilter = "Alle";

function renderSkills() {
  const cats = ["Alle", ...new Set(SKILLS.map((s) => s.cat))];
  $("#skill-filter").innerHTML = cats.map((c) =>
    `<button class="small ${c === skillFilter ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
  $("#skill-list").innerHTML = SKILLS.filter((s) => skillFilter === "Alle" || s.cat === skillFilter).map((s) => {
    const reached = state.skillProgress[s.name] ?? -1;
    return `<div class="card skill">
      <header><b>${s.name}</b><span class="level">${s.level}</span></header>
      <small class="muted">${s.cat} · ${reached + 1}/${s.steps.length} Stufen</small>
      <ol class="steps">${s.steps.map((st, i) =>
        `<li class="${i <= reached ? "got" : ""}" data-skill="${s.name}" data-step="${i}">${st}</li>`).join("")}</ol>
    </div>`;
  }).join("");
}

$("#skill-filter").addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  skillFilter = e.target.dataset.cat; renderSkills();
});

$("#skill-list").addEventListener("click", (e) => {
  const { skill, step } = e.target.dataset;
  if (!skill) return;
  const cur = state.skillProgress[skill] ?? -1;
  state.skillProgress[skill] = cur === +step ? +step - 1 : +step; // erneutes Klicken = zurücksetzen
  store.set("skills", state.skillProgress); renderSkills();
});

// ---------- Start ----------
renderWorkouts(); renderLive(); renderHistory(); renderStreak(); renderFood(); renderSkills();
