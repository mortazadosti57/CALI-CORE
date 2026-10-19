# CALI-CORE 🤸

Calisthenics-Trainings-App: Workout-Planung, Live-Session-Tracking, Ernährungslog und Skill-Bibliothek.

Läuft komplett im Browser, ohne Server, Account oder Build-Schritt. Alle Daten bleiben lokal im Browser (localStorage).

## Features

- **Workouts** – eigene Trainingspläne mit Übungen, Sätzen und Wiederholungen anlegen (3 Beispielpläne inklusive)
- **Live-Session** – Workout-Timer, Sätze abhaken, automatische 90-s-Pause, Verlauf und Trainings-Streak
- **Ernährung** – Mahlzeiten mit kcal und Makros loggen, Fortschritt gegenüber Tageszielen
- **Skill-Bibliothek** – Progressionen für Klimmzug, Muscle-up, Handstand, Front Lever, Planche u. v. m.; erreichte Stufen per Klick markieren

## Starten

Einfach `index.html` im Browser öffnen.

Oder mit einem lokalen Server:

```bash
npx serve .
```

## Projektstruktur

```
CALI-CORE/
├── index.html      # Aufbau der Oberfläche
├── css/style.css   # Dark/Purple-Theme, mobil-first
└── js/
    ├── data.js     # Skill-Progressionen & Beispiel-Workouts
    └── app.js      # App-Logik
```

## Roadmap

- [ ] Als PWA installierbar machen (offline, Homescreen)
- [ ] Export/Import der Daten als JSON
- [ ] Fortschritts-Diagramme
- [ ] Übungsdatenbank mit Anleitungen und GIFs

## Lizenz

MIT – siehe [LICENSE](LICENSE).
