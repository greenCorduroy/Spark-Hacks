import { Stethoscope, Heart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

interface ModeSelectionProps {
  onSelectMode: (mode: 'doctor' | 'patient') => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HealthCare Appointments</h1>
          <p className="text-lg text-gray-600">Please select your role to continue</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onSelectMode('doctor')}>
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Doctor Portal</CardTitle>
              <CardDescription className="text-base">
                Manage appointments and view patient schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => onSelectMode('doctor')}>
                Continue as Doctor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onSelectMode('patient')}>
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Patient Portal</CardTitle>
              <CardDescription className="text-base">
                View and schedule your appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" variant="outline" onClick={() => onSelectMode('patient')}>
                Continue as Patient
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
