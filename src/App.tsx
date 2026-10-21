import React, { useState } from 'react';
import { StudentRecord, DormitoryBlock, SmsNotification } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_DORMS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { Header } from './components/Header';
import { ProjectSummaryView } from './components/ProjectSummaryView';
import { SummaryModal } from './components/SummaryModal';
import { DashboardView } from './components/DashboardView';
import { RegistrationForm } from './components/RegistrationForm';
import { VerificationView } from './components/VerificationView';
import { DormitoryView } from './components/DormitoryView';
import { FinanceView } from './components/FinanceView';
import { NotificationCenter } from './components/NotificationCenter';
import { ReportsView } from './components/ReportsView';
import { AdmissionLetterModal } from './components/AdmissionLetterModal';
import { EditStudentModal } from './components/EditStudentModal';
import { AuthModal, UserAccount } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const [lang, setLang] = useState<'rw' | 'en'>('rw');
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // If user is not logged in, auto-open the Login / Auth screen on launch
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('eav_gitwe_user');
    } catch {
      return true;
    }
  });

  // Current logged in user (Staff account)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('eav_gitwe_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('eav_gitwe_user', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('eav_gitwe_user');
    } catch {}
  };

  // State data with localStorage persistence
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('eav_gitwe_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [dorms, setDorms] = useState<DormitoryBlock[]>(() => {
    try {
      const saved = localStorage.getItem('eav_gitwe_dorms');
      return saved ? JSON.parse(saved) : INITIAL_DORMS;
    } catch {
      return INITIAL_DORMS;
    }
  });

  const [notifications, setNotifications] = useState<SmsNotification[]>(() => {
    try {
      const saved = localStorage.getItem('eav_gitwe_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Selected student for Admission Letter modal
  const [letterStudent, setLetterStudent] = useState<StudentRecord | null>(null);

  // Selected student for Edit / Update Modal
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);

  // Sync to localStorage
  const saveStudents = (newStudents: StudentRecord[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('eav_gitwe_students', JSON.stringify(newStudents));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    const updated = students.filter(s => s.id !== studentId);
    saveStudents(updated);
    try {
      await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete sync failed', e);
    }
  };

  const saveDorms = (newDorms: DormitoryBlock[]) => {
    setDorms(newDorms);
    try {
      localStorage.setItem('eav_gitwe_dorms', JSON.stringify(newDorms));
    } catch (e) {
      console.error(e);
    }
  };

  const saveNotifications = (newNotifs: SmsNotification[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem('eav_gitwe_notifications', JSON.stringify(newNotifs));
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch from backend API on mount if available
  React.useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          saveStudents(data.data);
        }
      })
      .catch(() => {
        // Fall back gracefully to localStorage or initialData
      });

    fetch('/api/dorms')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          saveDorms(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/sms')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          saveNotifications(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Handlers with Backend API Sync
  const handleAddStudent = async (newStudent: StudentRecord) => {
    saveStudents([newStudent, ...students]);
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally', e);
    }
  };

  const handleUpdateStudent = async (updatedStudent: StudentRecord) => {
    saveStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    try {
      await fetch(`/api/students/${updatedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
    } catch (e) {
      console.warn('Backend sync failed, updated locally', e);
    }
  };

  const handleUpdateDorms = async (updatedDorms: DormitoryBlock[]) => {
    saveDorms(updatedDorms);
    try {
      await fetch('/api/dorms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDorms),
      });
    } catch (e) {
      console.warn('Backend dorms sync failed', e);
    }
  };

  const handleSendSms = async (phone: string, name: string, code: string, message: string) => {
    const newSms: SmsNotification = {
      id: `sms_${Date.now()}`,
      recipientPhone: phone,
      recipientName: name,
      studentCode: code,
      studentName: name,
      type: message.includes('Muraho mubyeyi') ? 'missing_docs' : 'admission_offer',
      message,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'delivered',
    };
    saveNotifications([newSms, ...notifications]);

    try {
      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: phone,
          recipientName: name,
          studentCode: code,
          message,
        }),
      });
    } catch (e) {
      console.warn('Backend SMS sync failed', e);
    }
  };

  // If user searched for a student code or name from the top header search
  const displayedStudents = searchQuery.trim() === ''
    ? students
    : students.filter(s =>
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nationalIdOrIndex.includes(searchQuery)
      );

  // MANDATORY AUTH GATE: If user is not logged in, enforce registration & login before system access!
  if (!currentUser) {
    return (
      <AuthScreen
        lang={lang}
        setLang={setLang}
        onLoginSuccess={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'login') {
            setIsAuthModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        lang={lang}
        setLang={setLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSummary={() => setIsSummaryModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Search results banner if searching */}
        {searchQuery.trim() !== '' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold">
                {lang === 'rw' ? 'Ibisubizo by\'ishakisha kuri:' : 'Search results for:'} "{searchQuery}"
              </span>
              <span className="ml-2 text-slate-600">
                ({displayedStudents.length} {lang === 'rw' ? 'abanyeshuri babonetse' : 'students found'})
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-800 font-bold hover:underline"
            >
              {lang === 'rw' ? 'Komeza bisanzwe' : 'Clear search'}
            </button>
          </div>
        )}

        {/* Dynamic Tab Render */}
        {activeTab === 'summary' && (
          <ProjectSummaryView
            lang={lang}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            students={displayedStudents}
            dorms={dorms}
            lang={lang}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            onSelectStudent={(st) => {
              setActiveTab('verification');
            }}
            onOpenLetter={(st) => setLetterStudent(st)}
            onEditStudent={(st) => setStudentToEdit(st)}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationForm
            onAddStudent={handleAddStudent}
            lang={lang}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            onSendSms={handleSendSms}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationView
            students={displayedStudents}
            onUpdateStudent={handleUpdateStudent}
            lang={lang}
            onOpenLetter={(st) => setLetterStudent(st)}
            onSendSms={handleSendSms}
          />
        )}

        {activeTab === 'dormitory' && (
          <DormitoryView
            dorms={dorms}
            students={students}
            onUpdateDorms={handleUpdateDorms}
            onUpdateStudent={handleUpdateStudent}
            lang={lang}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            students={displayedStudents}
            onUpdateStudent={handleUpdateStudent}
            lang={lang}
            onSendSms={handleSendSms}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationCenter
            students={students}
            notifications={notifications}
            onSendSms={handleSendSms}
            lang={lang}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            students={displayedStudents}
            lang={lang}
            onOpenLetter={(st) => setLetterStudent(st)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">EAV GITWE TSS</span>
            <span>•</span>
            <span>Rwanda TVET Board (RTB)</span>
            <span>•</span>
            <span>Ruhango District, Southern Province</span>
          </div>
          <div>
            <span>EAV Gitwe Student Admission & Registration Management System (SARMS)</span>
          </div>
        </div>
      </footer>

      {/* Summary Modal Popup */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        lang={lang}
        onNavigateTab={(tabId) => {
          setIsSummaryModalOpen(false);
          setActiveTab(tabId);
        }}
      />

      {/* Official Admission Letter Modal */}
      <AdmissionLetterModal
        student={letterStudent}
        onClose={() => setLetterStudent(null)}
        lang={lang}
      />

      {/* Edit / Update Student Modal */}
      <EditStudentModal
        student={studentToEdit}
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSave={handleUpdateStudent}
        onDelete={handleDeleteStudent}
        lang={lang}
      />

      {/* Staff Authentication (Login / Register / Forgot Password) Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        lang={lang}
      />
    </div>
  );
}
