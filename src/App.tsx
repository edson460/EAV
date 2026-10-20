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

export default function App() {
  const [lang, setLang] = useState<'rw' | 'en'>('rw');
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // State data
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [dorms, setDorms] = useState<DormitoryBlock[]>(INITIAL_DORMS);
  const [notifications, setNotifications] = useState<SmsNotification[]>(INITIAL_NOTIFICATIONS);

  // Selected student for Admission Letter modal
  const [letterStudent, setLetterStudent] = useState<StudentRecord | null>(null);

  // Handlers
  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentRecord) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleUpdateDorms = (updatedDorms: DormitoryBlock[]) => {
    setDorms(updatedDorms);
  };

  const handleSendSms = (phone: string, name: string, code: string, message: string) => {
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
    setNotifications(prev => [newSms, ...prev]);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSummary={() => setIsSummaryModalOpen(true)}
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
    </div>
  );
}
