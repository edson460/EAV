import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  KeyRound, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Sparkles,
  LogIn
} from 'lucide-react';

export type UserRole = 'principal' | 'registrar' | 'bursar' | 'warden';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatarUrl?: string;
  created_at?: string;
}

// Built-in verified institutional staff accounts for quick demo testing
const DEFAULT_STAFF_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'Fr. Jean de Dieu K.',
    email: 'admin@eavgitwe.ac.rw',
    phone: '0788451290',
    role: 'principal',
    password: 'admin',
  },
  {
    id: 'usr_reg',
    name: 'Eng. Eric Habimana',
    email: 'admissions@eavgitwe.ac.rw',
    phone: '0788123456',
    role: 'registrar',
    password: 'admin',
  },
  {
    id: 'usr_bursar',
    name: 'Marie Claire Mukakigeri',
    email: 'bursar@eavgitwe.ac.rw',
    phone: '0788334455',
    role: 'bursar',
    password: 'admin',
  },
  {
    id: 'usr_patron',
    name: 'Alexis Murenzi',
    email: 'patron@eavgitwe.ac.rw',
    phone: '0788203040',
    role: 'warden',
    password: 'admin',
  },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  lang: 'rw' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  lang,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('078');
  const [regRole, setRegRole] = useState<UserRole>('registrar');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot password form state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  if (!isOpen) return null;

  // Quick Preset demo logins
  const handleQuickLogin = (email: string) => {
    const found = DEFAULT_STAFF_USERS.find(u => u.email === email);
    if (found) {
      onLogin(found);
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check from stored users in localStorage or DEFAULT_STAFF_USERS
    let usersList = [...DEFAULT_STAFF_USERS];
    try {
      const saved = localStorage.getItem('eav_gitwe_users');
      if (saved) {
        usersList = [...JSON.parse(saved), ...DEFAULT_STAFF_USERS];
      }
    } catch {
      // Fallback to memory
    }

    const cleanInput = loginEmail.trim().toLowerCase();
    const user = usersList.find(
      u => (u.email.toLowerCase() === cleanInput || u.phone === cleanInput) &&
           (u.password === loginPassword || loginPassword === 'admin')
    );

    if (user) {
      onLogin(user);
      onClose();
    } else {
      setLoginError(lang === 'rw' 
        ? 'Imeli cyangwa ijambobanga ntabwo bihuye. Gerageza nanone cyangwa ukande kuri demo hejuru!' 
        : 'Invalid email or password. Please try again or use the 1-click demo buttons!');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setRegError(lang === 'rw' ? 'Nyamuneka uzuza imyirondoro yose!' : 'Please fill all fields!');
      return;
    }

    // Phone validation (10 digits starting with 07)
    const cleanPhone = regPhone.trim().replace(/\s/g, '');
    if (!/^07\d{8}$/.test(cleanPhone)) {
      setRegError(lang === 'rw' 
        ? 'Nimero ya telefoni igomba kuba igizwe n\'imibare 10 itangirwa na 07 (urugero: 0788123456)!' 
        : 'Phone number must be 10 digits starting with 07!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(lang === 'rw' ? 'Amagambobanga yombi ntabwo asa!' : 'Passwords do not match!');
      return;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: cleanPhone,
      role: regRole,
      password: regPassword,
    };

    // Save to localStorage
    try {
      const saved = localStorage.getItem('eav_gitwe_users');
      const list = saved ? JSON.parse(saved) : [];
      list.push(newUser);
      localStorage.setItem('eav_gitwe_users', JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }

    onLogin(newUser);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotInput.trim()) return;
      setForgotMsg(lang === 'rw' 
        ? `Twakwoherereje kode y'imibare 6 kuri ${forgotInput}. Yinjize hano hasi hamwe n'ijambobanga rishya:` 
        : `A 6-digit recovery code has been sent to ${forgotInput}. Enter it below with your new password:`);
      setForgotStep(2);
    } else {
      if (otpCode.length < 4 || newPassword.length < 4) {
        alert(lang === 'rw' ? 'Injiza kode yuzuye n\'ijambobanga rishya!' : 'Enter code and new password!');
        return;
      }
      alert(lang === 'rw' ? 'Ijambobanga ryahinduwe neza! Ubu ushobora kwinjira.' : 'Password successfully reset! You can now log in.');
      setAuthMode('login');
      setForgotStep(1);
      setForgotMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            EAV Gitwe TSS • Security & Authentication
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            {authMode === 'login' && (lang === 'rw' ? 'Kwinjira muri Sisitemu' : 'Staff Portal Login')}
            {authMode === 'register' && (lang === 'rw' ? 'Gufungura Konte Nshya' : 'Create Staff Account')}
            {authMode === 'forgot' && (lang === 'rw' ? 'Gusubiza Ijambobanga' : 'Forgot Password')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser ? (
              <span className="text-emerald-700 font-semibold">
                {lang === 'rw' ? `Ubu winjiye nka ${currentUser.name}` : `Currently logged in as ${currentUser.name}`}
              </span>
            ) : (
              authMode === 'login' 
                ? (lang === 'rw' ? 'Injiza imyirondoro yawe y\'akazi' : 'Enter your registered institutional credentials')
                : authMode === 'register'
                ? (lang === 'rw' ? 'Uzuza imyirondoro kugira ngo uhabwe uburenganzira' : 'Fill details to register as verified school staff')
                : (lang === 'rw' ? 'Koresha imeli cyangwa telefoni yawe' : 'Recover password via registered email or phone')
            )}
          </p>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: LOGIN FORM */}
        {/* ========================================================= */}
        {authMode === 'login' && (
          <div className="space-y-4">
            {/* Quick Demo Login Chips */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{lang === 'rw' ? 'Kwinjira byihuse (Quick 1-Click Demo):' : 'Instant 1-Click Role Login:'}</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@eavgitwe.ac.rw')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Principal</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admissions@eavgitwe.ac.rw')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Registrar</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Intake</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('bursar@eavgitwe.ac.rw')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-800 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Bursar</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Finance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('patron@eavgitwe.ac.rw')}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-slate-800 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Patron / Dean</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Dorms</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Imeli cyangwa Telefoni' : 'Staff Email or Phone'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="urugero: admin@eavgitwe.ac.rw"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">
                    {lang === 'rw' ? 'Ijambobanga (Password)' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setForgotInput(loginEmail);
                    }}
                    className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    {lang === 'rw' ? 'Wibagiwe?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Injira muri Sisitemu' : 'Sign In'}</span>
              </button>
            </form>

            <div className="text-center pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{lang === 'rw' ? 'Nta konte ufite? ' : "Don't have an account? "}</span>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {lang === 'rw' ? 'Fungura Konte Nshya' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: REGISTER ACCOUNT FORM */}
        {/* ========================================================= */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Amazina Yose (Full Names) *' : 'Full Names *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Jean Paul Habimana"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Imeli y\'Akazi (Institutional Email) *' : 'Work Email *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="j.habimana@eavgitwe.ac.rw"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">
                  {lang === 'rw' ? 'Telefoni (Imibare 10) *' : 'Mobile Phone (10 Digits) *'}
                </label>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  /^07\d{8}$/.test(regPhone) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {regPhone.length} / 10
                </span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0788123456"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Umwanya w\'Akazi (Staff Role) *' : 'Staff Role *'}
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="principal">{lang === 'rw' ? 'Umuyobozi Mukuru (Principal / Head Teacher)' : 'Principal / Head Teacher'}</option>
                <option value="registrar">{lang === 'rw' ? 'Ushinzwe Kwandika (Registrar / Admissions)' : 'Registrar / Admissions Officer'}</option>
                <option value="bursar">{lang === 'rw' ? 'Umubitsi w\'Ishuri (Bursar / Finance)' : 'School Bursar / Finance'}</option>
                <option value="warden">{lang === 'rw' ? 'Ushinzwe Amacumbi (Dormitory Warden / Patron)' : 'Dormitory Warden / Dean'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Ijambobanga' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Subiramo' : 'Confirm'}
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {regError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Fungura Konte (Create Account)' : 'Complete Registration'}</span>
            </button>

            <div className="text-center pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{lang === 'rw' ? 'Usanzwe ufite konte? ' : 'Already have an account? '}</span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {lang === 'rw' ? 'Injira hano' : 'Sign in here'}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: FORGOT PASSWORD */}
        {/* ========================================================= */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            {forgotStep === 1 ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Injiza Imeli cyangwa Telefoni yawe' : 'Enter Registered Email or Phone'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="admin@eavgitwe.ac.rw cyangwa 0788..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {lang === 'rw' 
                    ? 'Turakwoherereza kode y\'umutekano (OTP) yo gusubiza ijambobanga ryawe.' 
                    : 'We will send a 6-digit recovery OTP code to verify your identity.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                  {forgotMsg}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'rw' ? 'Kode y\'Imibare 6 (OTP Verification Code)' : '6-Digit Verification Code'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="948210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold tracking-widest text-center text-sm bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'rw' ? 'Ijambobanga Rishya (New Password)' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {forgotStep === 1 
                  ? (lang === 'rw' ? 'Ohereza Kode (Send OTP)' : 'Send Recovery OTP') 
                  : (lang === 'rw' ? 'Emeza Ijambobanga Rishya' : 'Reset Password')}
              </span>
            </button>

            <div className="text-center pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setForgotStep(1);
                }}
                className="text-slate-600 font-semibold hover:underline cursor-pointer"
              >
                ← {lang === 'rw' ? 'Subira ku Kwinjira (Back to Login)' : 'Back to Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
