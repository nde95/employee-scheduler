# Employee Scheduler

A React and TypeScript app for planning one recurring workweek.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Use `npm run build` to type-check and build the production app.

- **Employees** lets you add, edit, and remove staff and set their availability and limits.
- Pick a day and use **Add shift** or click an empty hour on a workstation row. Click an existing shift to change or remove it.
- **Generate schedule** assigns staff across the whole week. Changes to employees or shifts clear the old assignments so that the displayed result cannot refer to stale data. Edits and generated schedules are saved in the current browser.

Each shift covers one workstation and needs one employee. Use different workstation names for simultaneous coverage. Shifts start and end within the same day, with half-hour increments. Period restrictions and preferences apply to the shift's start time. The app opens with sample data.

The generator first considers shifts with the fewest eligible employees. It enforces role, availability, daily hours, weekly days, and time overlap. It ranks eligible employees by preferences and then by scheduled hours. The greedy algorithm can leave a shift open even if an alternative assignment would cover it. The timeline labels open shifts after generation.

The app is a standalone implementation based on the components and types shared in discussion. Component styles are in `src/App.css` so it runs without additional styling configuration.
