import { useState, useEffect } from "react";
import { ModeSelection } from "@/app/components/mode-selection";
import { DoctorDashboard } from "@/app/components/doctor-dashboard";
import { PatientDashboard } from "@/app/components/patient-dashboard";


interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  completed?: boolean;
}

type Mode = 'selection' | 'doctor' | 'patient';

export default function App() {
  const [mode, setMode] = useState<Mode>('selection');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const handleLogout = () => {
    setMode('selection');
  };

  
  function getMissedAppointments() {
  const now = new Date();
  return appointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    return aptDate < now && !apt.completed;
  });
}
const missedAppointments = getMissedAppointments();


const handleMarkCompleted = async (id: string) => {
  try {
    await fetch(`http://localhost:8000/api/appointments/${id}/complete`, {
      method: "PUT"
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, completed: true } : apt
      )
    );
  } catch (err) {
    console.error("Failed to mark appointment as completed:", err);
  }
};

  return (
    <div className="size-full">
      {mode === 'selection' && (
        <ModeSelection onSelectMode={setMode} />
      )}
      
      {mode === 'doctor' && (
        <DoctorDashboard
          onLogout={handleLogout}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onMarkCompleted={handleMarkCompleted}
          missedAppointments={missedAppointments}
        />
      )}
      
      {mode === 'patient' && (
        <PatientDashboard
          onLogout={handleLogout}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onMarkCompleted={handleMarkCompleted}
          missedAppointments={missedAppointments}
        />
      )}
    </div>
  );
}
