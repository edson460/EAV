import React, { useState } from 'react';
import { StudentRecord, TradeCode, LevelCode, AdmissionStatus } from '../types';
import { TRADES } from '../data/initialData';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  Send, 
  FileCheck, 
  Eye, 
  Printer, 
  ShieldCheck, 
  X,
  Phone,
  Check,
  AlertTriangle
} from 'lucide-react';

interface VerificationViewProps {
  students: StudentRecord[];
  onUpdateStudent: (student: StudentRecord) => void;
  lang: 'rw' | 'en';
  onOpenLetter: (student: StudentRecord) => void;
  onSendSms: (phone: string, name: string, code: string, message: string) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  students,
  onUpdateStudent,
  lang,
  onOpenLetter,
  onSendSms,
}) => {
  const [filterTrade, setFilterTrade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Filter students
  const filtered = students.filter(s => {
    const matchesTrade = filterTrade === 'all' || s.trade === filterTrade;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch = 
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.nationalIdOrIndex.includes(search);
    return matchesTrade && matchesStatus && matchesSearch;
  });

  const handleToggleDocStatus = (docId: string) => {
    if (!selectedStudent) return;

    const updatedDocs = selectedStudent.documents.map(d => {
      if (d.id === docId) {
        const nextStatus: 'verified' | 'missing' = d.status === 'verified' ? 'missing' : 'verified';
        return {
          ...d,
          status: nextStatus,
          isUploaded: nextStatus === 'verified',
        };
      }
      return d;
    });

    const allVerified = updatedDocs.every(d => d.status === 'verified');
    const updatedStatus: AdmissionStatus = allVerified ? 'verified' : 'incomplete_docs';

    const updatedStudent: StudentRecord = {
      ...selectedStudent,
      documents: updatedDocs,
      status: updatedStatus,
    };

    setSelectedStudent(updatedStudent);
    onUpdateStudent(updatedStudent);
  };

  const handleApproveStudent = () => {
    if (!selectedStudent) return;
    const updatedStudent: StudentRecord = {
      ...selectedStudent,
      status: 'admitted',
    };
    setSelectedStudent(updatedStudent);
    onUpdateStudent(updatedStudent);

    // Send confirmation SMS
    const msg = `Muraho! ${updatedStudent.firstName} ${updatedStudent.lastName} yemerewe burundu kwiga muri EAV Gitwe TSS mu ishami rya ${updatedStudent.trade} (${updatedStudent.level}). Code: ${updatedStudent.studentCode}. Murakaza neza!`;
    onSendSms(updatedStudent.parentPhone, updatedStudent.parentName, updatedStudent.studentCode, msg);
  };

  const handleSendMissingDocsAlert = () => {
    if (!selectedStudent) return;
    const missing = selectedStudent.documents.filter(d => d.status !== 'verified').map(d => d.nameRw).join(', ');
    const msg = `Muraho mubyeyi, dosiye ya ${selectedStudent.firstName} muri EAV Gitwe TSS (Code: ${selectedStudent.studentCode}) iraburamo: ${missing || 'ibyangombwa bimwe'}. Mwakwihutira kubizana. Murakoze.`;
    onSendSms(selectedStudent.parentPhone, selectedStudent.parentName, selectedStudent.studentCode, msg);
    alert(lang === 'rw' ? 'Ubutumwa bwohererejwe umubyeyi kuri SMS!' : 'Missing documents alert sent to parent via SMS!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Igenzura ry\'Ibyangombwa & Kwemeza (Verification Workflow)' : 'Document Verification & Eligibility Check'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'rw' ? 'Kugenzura Dosiye z\'Abanyeshuri' : 'Student Credential Verification'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'rw' 
              ? 'Genzura indangamanota, icyemezo cy\'amavuko, icyemezo cy\'ubuzima n\'inyemezabwishyu mbere yo kwemeza umunyeshuri.' 
              : 'Verify O-Level result slips, national IDs, medical clearances, and fee bank slips before confirming admission.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trade filter */}
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{lang === 'rw' ? 'Amashami Yose' : 'All Trades'}</option>
            {TRADES.map(t => (
              <option key={t.code} value={t.code}>{t.code} - {t.nameEn}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{lang === 'rw' ? 'Uko bahagaze kose' : 'All Statuses'}</option>
            <option value="pending">{lang === 'rw' ? 'Bitegerejwe' : 'Pending'}</option>
            <option value="incomplete_docs">{lang === 'rw' ? 'Haburamo ibyangombwa' : 'Missing Docs'}</option>
            <option value="verified">{lang === 'rw' ? 'Byemejwe' : 'Verified'}</option>
            <option value="admitted">{lang === 'rw' ? 'Yemerewe Kwiga' : 'Admitted'}</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'rw' ? 'Shakisha muri dosiye...' : 'Search verification records...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500">
            {lang === 'rw' ? `Hagaragajwe abanyeshuri ${filtered.length}` : `Showing ${filtered.length} students`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Code</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Umunyeshuri' : 'Student'}</th>
                <th className="py-3 px-4">Trade & Level</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Ibyangombwa 5 Bisabwa' : '5 Required Documents'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Uko Byifashe' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{lang === 'rw' ? 'Gusuzuma Dosiye' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => {
                const verifiedCount = student.documents.filter(d => d.status === 'verified').length;
                const totalDocs = student.documents.length;
                const allDone = verifiedCount === totalDocs;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {student.studentCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                      <div className="text-[11px] text-slate-500">
                        NID: {student.nationalIdOrIndex} • {student.previousSchool}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{student.trade}</span>
                      <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {student.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {student.documents.map((doc, idx) => (
                          <span
                            key={doc.id}
                            title={`${doc.nameRw}: ${doc.status}`}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              doc.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        ))}
                        <span className={`text-[11px] ml-1 font-semibold ${allDone ? 'text-emerald-700' : 'text-amber-700'}`}>
                          ({verifiedCount}/{totalDocs})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {student.status === 'admitted' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lang === 'rw' ? 'Yemerewe' : 'Admitted'}
                        </span>
                      )}
                      {student.status === 'verified' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {lang === 'rw' ? 'Dosiye Yuzuye' : 'Verified'}
                        </span>
                      )}
                      {student.status === 'incomplete_docs' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {lang === 'rw' ? 'Ibyangombwa Bibura' : 'Missing Docs'}
                        </span>
                      )}
                      {student.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {lang === 'rw' ? 'Bitegerejwe' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'rw' ? 'Genzura Dosiye' : 'Inspect File'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Review Modal for Document Verification */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'rw' ? 'Isuzuma ry\'Ibyangombwa' : 'Document Verification Desk'}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Code: <span className="font-bold text-slate-800">{selectedStudent.studentCode}</span> • NID: {selectedStudent.nationalIdOrIndex}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {selectedStudent.trade} • {selectedStudent.level}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  {selectedStudent.district}, {selectedStudent.sector}
                </span>
              </div>
            </div>

            {/* Document Checklist with live toggles */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'rw' ? 'Ibyangombwa 5 bya Dosiye (Kanda kugira ngo wemeze/uhindure):' : '5 Required Documents (Click to toggle verification status):'}
              </h4>

              {selectedStudent.documents.map((doc, idx) => {
                const isVerified = doc.status === 'verified';
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDocStatus(doc.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isVerified
                        ? 'border-emerald-300 bg-emerald-50/60'
                        : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                        isVerified ? 'bg-emerald-600 text-white' : 'bg-rose-200 text-rose-800'
                      }`}>
                        {isVerified ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {lang === 'rw' ? doc.nameRw : doc.nameEn}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-2">
                          {doc.fileName ? (
                            <span className="font-mono text-slate-600">{doc.fileName} ({doc.fileSize})</span>
                          ) : (
                            <span className="text-rose-600">{lang === 'rw' ? 'Ntabwo biratangwa' : 'Not yet uploaded'}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isVerified ? (lang === 'rw' ? 'Byemejwe' : 'Verified') : (lang === 'rw' ? 'Kirabura' : 'Missing')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Parent contact for missing docs SMS */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-700 block">
                  {lang === 'rw' ? 'Umubyeyi / Umurenzi:' : 'Parent Contact:'} {selectedStudent.parentName}
                </span>
                <span className="font-mono text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedStudent.parentPhone}
                </span>
              </div>

              {selectedStudent.documents.some(d => d.status !== 'verified') && (
                <button
                  onClick={handleSendMissingDocsAlert}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'rw' ? 'Ohereza SMS y\'Ibibura' : 'Send Missing Docs SMS'}</span>
                </button>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => onOpenLetter(selectedStudent)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'rw' ? 'Ibaruwa yo Kwemererwa' : 'Admission Letter'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {lang === 'rw' ? 'Funga' : 'Close'}
                </button>

                <button
                  onClick={handleApproveStudent}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'rw' ? 'Emeza ko Yemerewe Kwiga' : 'Confirm & Finalize Admission'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
