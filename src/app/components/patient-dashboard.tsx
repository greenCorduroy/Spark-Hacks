import { useState } from "react";
import { Calendar, Clock, Plus, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { compareAsc, format } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  completed?: boolean;
}

interface PatientDashboardProps {
  onLogout: () => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onDeleteAppointment: (id: string) => void;
  missedAppointments: Appointment[];
  onMarkCompleted: (id: string) => void;
}

export function PatientDashboard({ onLogout, appointments, onAddAppointment, onDeleteAppointment }: PatientDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: 'Patient',
    date: '',
    time: '',
    reason: '',
    notes: '',
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment(formData);
    setFormData({ patientName: 'Patient', date: '', time: '', reason: '', notes: '', completed: false });
    setIsDialogOpen(false);
  };

  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= new Date();
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Header with large text */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold">My Appointments</h1>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={onLogout}
              className="text-xl px-6 py-3 h-auto"
            >
              <LogOut className="w-6 h-6 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with large spacing */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Large Add Appointment Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="w-full mb-12 h-32 text-3xl font-bold bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-12 h-12 mr-4" />
              Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-3xl mb-4">Book Appointment</DialogTitle>
              <DialogDescription className="text-xl mb-6">Schedule a new appointment with your healthcare provider.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="date" className="text-2xl mb-2 block">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-2xl h-16"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-2xl mb-2 block">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="text-2xl h-16"
                />
              </div>
              <div>
                <Label htmlFor="reason" className="text-2xl mb-2 block">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="text-2xl h-16"
                  placeholder="Check-up, Follow-up, etc."
                />
              </div>
              <Button type="submit" className="w-full h-20 text-2xl bg-green-600 hover:bg-green-700">
                Book Appointment
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Appointments List with large text */}
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Your Upcoming Appointments</h2>
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-4 border-blue-200">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-6">
                      {/* Date */}
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                          <Calendar className="w-12 h-12 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-600">Date</p>
                          <p className="text-4xl font-bold text-gray-900">
                            {format(new Date(appointment.date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-2xl text-gray-600">
                            {format(new Date(appointment.date), 'EEEE')}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-lg">
                          <Clock className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl text-gray-600">Time</p>
                          <p className="text-4xl font-bold text-gray-900">{appointment.time}</p>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-2xl text-gray-600 mb-2">Reason for Visit</p>
                        <p className="text-3xl font-semibold text-gray-900">{appointment.reason}</p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onDeleteAppointment(appointment.id)}
                      className="ml-4 h-20 w-20 border-2 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-8 h-8 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-4 border-gray-200">
            <CardContent className="p-12 text-center">
              <Calendar className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <p className="text-4xl text-gray-600 font-semibold">No appointments scheduled</p>
              <p className="text-2xl text-gray-500 mt-4">Click the green button above to book an appointment</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}