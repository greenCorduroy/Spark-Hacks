import { useState } from "react";
import { Stethoscope, Heart, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import logo from "./logo.png";

interface LoginProps {
  mode: 'doctor' | 'patient';
  onLogin: (username: string, password: string) => boolean;
  onBack: () => void;
}

export function Login({ mode, onLogin, onBack }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isPatient = mode === 'patient';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      
      // Get existing users
      const usersKey = mode === 'doctor' ? 'doctorUsers' : 'patientUsers';
      const existingUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      
      // Check if username already exists
      if (existingUsers.some((u: any) => u.username === username)) {
        setError('Username already exists');
        return;
      }
      
      // Create new user
      existingUsers.push({ username, password });
      localStorage.setItem(usersKey, JSON.stringify(existingUsers));
      
      // Auto login after signup
      const success = onLogin(username, password);
      if (!success) {
        setError('Failed to create account');
      }
    } else {
      // Login
      const success = onLogin(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isPatient ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-4`}>
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className={`mb-4 ${isPatient ? 'text-2xl h-auto py-3' : ''}`}
        >
          <ArrowLeft className={`mr-2 ${isPatient ? 'w-6 h-6' : 'w-4 h-4'}`} />
          Back
        </Button>

        <Card className={isPatient ? 'border-4 border-blue-200' : ''}>
          <CardHeader>
            <img src={logo} alt="HealthClear Logo" className={`${isPatient ? 'w-20 h-20' : 'w-16 h-16'} mx-auto mb-4`} />
            <CardTitle className={`text-center ${isPatient ? 'text-4xl' : 'text-2xl'}`}>
              HealthClear {mode === 'doctor' ? 'Doctor' : 'Patient'} Portal
            </CardTitle>
            <CardDescription className={`text-center ${isPatient ? 'text-2xl' : 'text-base'}`}>
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className={`grid w-full grid-cols-2 ${isPatient ? 'h-16' : ''}`}>
                <TabsTrigger value="login" className={isPatient ? 'text-xl' : ''}>Login</TabsTrigger>
                <TabsTrigger value="signup" className={isPatient ? 'text-xl' : ''}>Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className={isPatient ? 'text-2xl' : ''}>Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={isPatient ? 'text-2xl h-16 mt-2' : ''}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className={isPatient ? 'text-2xl' : ''}>Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={isPatient ? 'text-2xl h-16 mt-2 pr-12' : 'pr-10'}
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute ${isPatient ? 'right-2 top-3' : 'right-0 top-0'} h-full px-3`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className={isPatient ? 'w-6 h-6' : 'w-4 h-4'} />
                        ) : (
                          <Eye className={isPatient ? 'w-6 h-6' : 'w-4 h-4'} />
                        )}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <p className={`text-red-500 ${isPatient ? 'text-xl' : 'text-sm'}`}>{error}</p>
                  )}
                  <Button 
                    type="submit" 
                    className={`w-full ${isPatient ? 'h-20 text-2xl bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="new-username" className={isPatient ? 'text-2xl' : ''}>Username</Label>
                    <Input
                      id="new-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={isPatient ? 'text-2xl h-16 mt-2' : ''}
                      placeholder="Choose a username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className={isPatient ? 'text-2xl' : ''}>Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={isPatient ? 'text-2xl h-16 mt-2 pr-12' : 'pr-10'}
                        placeholder="Choose a password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute ${isPatient ? 'right-2 top-3' : 'right-0 top-0'} h-full px-3`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className={isPatient ? 'w-6 h-6' : 'w-4 h-4'} />
                        ) : (
                          <Eye className={isPatient ? 'w-6 h-6' : 'w-4 h-4'} />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className={isPatient ? 'text-2xl' : ''}>Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={isPatient ? 'text-2xl h-16 mt-2' : ''}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {error && (
                    <p className={`text-red-500 ${isPatient ? 'text-xl' : 'text-sm'}`}>{error}</p>
                  )}
                  <Button 
                    type="submit" 
                    className={`w-full ${isPatient ? 'h-20 text-2xl bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Accounts Info */}
            <div className={`mt-6 p-4 bg-gray-100 rounded-lg ${isPatient ? 'text-xl' : 'text-sm'}`}>
              <p className="font-semibold mb-2">Demo Accounts:</p>
              {mode === 'doctor' ? (
                <p>Username: <span className="font-mono">doctor1</span><br />Password: <span className="font-mono">pass</span></p>
              ) : (
                <p>Username: <span className="font-mono">patient1</span><br />Password: <span className="font-mono">pass</span></p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}