// Skill-Bibliothek: Progressionen von leicht nach schwer
const SKILLS = [
  { name: "Klimmzug", cat: "Pull", level: "Grundlage",
    steps: ["Dead Hang 30 s", "Scapula Pulls", "Negative Klimmzüge", "Australian Pull-ups", "1 sauberer Klimmzug", "10 Klimmzüge"] },
  { name: "Dip", cat: "Push", level: "Grundlage",
    steps: ["Bench Dips", "Support Hold 30 s", "Negative Dips", "1 Dip am Barren", "15 Dips"] },
  { name: "Liegestütz", cat: "Push", level: "Grundlage",
    steps: ["Wand-Liegestütz", "Erhöhter Liegestütz", "Knie-Liegestütz", "Voller Liegestütz", "Diamond Push-up", "Archer Push-up"] },
  { name: "Pistol Squat", cat: "Beine", level: "Mittel",
    steps: ["Tiefe Kniebeuge halten", "Box Pistol", "Assisted Pistol", "Negative Pistol", "Voller Pistol Squat"] },
  { name: "L-Sit", cat: "Core", level: "Mittel",
    steps: ["Tuck Sit", "Ein Bein gestreckt", "L-Sit 5 s", "L-Sit 15 s", "L-Sit 30 s"] },
  { name: "Handstand", cat: "Balance", level: "Mittel",
    steps: ["Pike Hold", "Wand-Handstand (Bauch zur Wand) 30 s", "Schulter-Taps an der Wand", "Freistehend 5 s", "Freistehend 30 s"] },
  { name: "Muscle-up", cat: "Pull", level: "Fortgeschritten",
    steps: ["10 Klimmzüge", "Explosive Chest-to-Bar", "Straight Bar Dips", "Negative Muscle-up", "Kipping Muscle-up", "Strikter Muscle-up"] },
  { name: "Front Lever", cat: "Pull", level: "Fortgeschritten",
    steps: ["Tuck Front Lever", "Advanced Tuck", "One Leg", "Straddle", "Full Front Lever"] },
  { name: "Planche", cat: "Push", level: "Fortgeschritten",
    steps: ["Planche Lean", "Frog Stand", "Tuck Planche", "Advanced Tuck", "Straddle Planche", "Full Planche"] },
  { name: "Human Flag", cat: "Core", level: "Fortgeschritten",
    steps: ["Seitstütz 60 s", "Vertical Flag", "Tuck Flag", "Straddle Flag", "Full Human Flag"] },
];

// Beispiel-Workouts beim ersten Start
const DEFAULT_WORKOUTS = [
  { id: 1, name: "Push Day", exercises: [
    { name: "Liegestütz", sets: 4, reps: 12 },
    { name: "Dips", sets: 3, reps: 8 },
    { name: "Pike Push-ups", sets: 3, reps: 10 },
  ]},
  { id: 2, name: "Pull Day", exercises: [
    { name: "Klimmzüge", sets: 4, reps: 6 },
    { name: "Australian Pull-ups", sets: 3, reps: 12 },
    { name: "Hanging Knee Raises", sets: 3, reps: 15 },
  ]},
  { id: 3, name: "Beine & Core", exercises: [
    { name: "Kniebeugen", sets: 4, reps: 20 },
    { name: "Ausfallschritte", sets: 3, reps: 12 },
    { name: "Hollow Body Hold (s)", sets: 3, reps: 30 },
  ]},
];
