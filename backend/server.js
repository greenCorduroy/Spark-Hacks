import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Path to JSON file
const dataPath = path.join(process.cwd(), "data", "appointments.json");

// Helper: read appointments from file
function loadAppointments() {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading appointments:", err);
    return [];
  }
}

// Helper: write appointments to file
function saveAppointments(appointments) {
  fs.writeFileSync(dataPath, JSON.stringify(appointments, null, 2));
}

// GET all appointments
app.get("/api/appointments", (req, res) => {
  const appointments = loadAppointments();
  res.json(appointments);
});

// POST new appointment
app.post("/api/appointments", (req, res) => {
  const appointments = loadAppointments();

  const newAppointment = {
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ...req.body
  };

  appointments.push(newAppointment);
  saveAppointments(appointments);

  res.json(newAppointment);
});

// DELETE appointment
app.delete("/api/appointments/:id", (req, res) => {
  const appointments = loadAppointments();
  const updated = appointments.filter(a => a.id !== req.params.id);

  saveAppointments(updated);
  res.json({ success: true });
});

app.listen(8000, () => {
  console.log("Backend running on http://localhost:8000");
});

// PUT: mark appointment as completed
app.put("/api/appointments/:id/complete", (req, res) => {
  const appointments = loadAppointments();

  const updated = appointments.map(apt =>
    apt.id === req.params.id
      ? { ...apt, completed: true }
      : apt
  );

  saveAppointments(updated);
  res.json({ success: true });
});
// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Test endpoint
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is working!" });
// });

// // Example: create appointment
// let appointments = [];

// app.post("/api/appointments", (req, res) => {
//   const appointment = { id: Date.now(), ...req.body };
//   appointments.push(appointment);
//   res.json(appointment);
// });

// // Example: get appointments
// app.get("/api/appointments", (req, res) => {
//   res.json(appointments);
// });

// app.listen(8000, () => {
//   console.log("Backend running on http://localhost:8000");
// });