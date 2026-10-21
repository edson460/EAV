import React, { useState, useEffect } from 'react';
import { StudentRecord, TradeCode, LevelCode, Gender, BoardingType, AdmissionStatus } from '../types';
import { TRADES } from '../data/initialData';
import { X, Save, Trash2, Edit3, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EditStudentModalProps {
  student: StudentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: StudentRecord) => void;
  onDelete: (studentId: string) => void;
  lang: 'rw' | 'en';
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
  onDelete,
  lang,
}) => {
  if (!isOpen || !student) return null;

  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [gender, setGender] = useState<Gender>(student.gender);
  const [dob, setDob] = useState(student.dob);
  const [nationalIdOrIndex, setNationalIdOrIndex] = useState(student.nationalIdOrIndex);
  const [previousSchool, setPreviousSchool] = useState(student.previousSchool);
  const [district, setDistrict] = useState(student.district);
  const [sector, setSector] = useState(student.sector);
  const [trade, setTrade] = useState<TradeCode>(student.trade);
  const [level, setLevel] = useState<LevelCode>(student.level);
  const [boardingType, setBoardingType] = useState<BoardingType>(student.boardingType);
  const [status, setStatus] = useState<AdmissionStatus>(student.status);
  const [parentName, setParentName] = useState(student.parentName);
  const [parentPhone, setParentPhone] = useState(student.parentPhone);
  const [notes, setNotes] = useState(student.notes || '');

  const [nidError, setNidError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Reset when student changes
  useEffect(() => {
    if (student) {
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setGender(student.gender);
      setDob(student.dob);
      setNationalIdOrIndex(student.nationalIdOrIndex);
      setPreviousSchool(student.previousSchool);
      setDistrict(student.district);
      setSector(student.sector);
      setTrade(student.trade);
      setLevel(student.level);
      setBoardingType(student.boardingType);
      setStatus(student.status);
      setParentName(student.parentName);
      setParentPhone(student.parentPhone);
      setNotes(student.notes || '');
      setNidError('');
      setPhoneError('');
    }
  }, [student]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setNidError('');
    setPhoneError('');

    // Validation 1: National ID 16 digits
    const cleanNid = nationalIdOrIndex.trim().replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNid)) {
      const msg = lang === 'rw' 
        ? `Nimero y'indangamuntu igomba kuba igizwe n'imibare 16 neza! (Wanditsemo ${cleanNid.length})` 
        : `National ID must be exactly 16 digits! (You entered ${cleanNid.length})`;
      setNidError(msg);
      alert(msg);
      return;
    }

    // Validation 2: Phone number 10 digits starting with 07
    const cleanPhone = parentPhone.trim().replace(/\s/g, '');
    if (!/^07\d{8}$/.test(cleanPhone)) {
      const msg = lang === 'rw' 
        ? `Nimero ya telefoni igomba kuba igizwe n'imibare 10 itangirwa na 07! (Wanditsemo ${cleanPhone.length})` 
        : `Phone number must be exactly 10 digits starting with 07! (You entered ${cleanPhone.length})`;
      setPhoneError(msg);
      alert(msg);
      return;
    }

    const updatedStudent: StudentRecord = {
      ...student,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dob,
      nationalIdOrIndex: cleanNid,
      previousSchool: previousSchool.trim(),
      district: district.trim(),
      sector: sector.trim(),
      trade,
      level,
      boardingType,
      status,
      parentName: parentName.trim(),
      parentPhone: cleanPhone,
      notes: notes.trim(),
    };

    onSave(updatedStudent);
    onClose();
  };

  const handleDeleteClick = () => {
    const confirmMsg = lang === 'rw'
      ? `Uremeza neza ko ushaka gusiba burundu dosiye ya ${student.firstName} ${student.lastName} (${student.studentCode})?`
      : `Are you sure you want to permanently delete ${student.firstName} ${student.lastName} (${student.studentCode})?`;
    
    if (confirm(confirmMsg)) {
      onDelete(student.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          <Edit3 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'rw' ? 'Kuvugurura Dosiye (Update Student Record)' : 'Edit & Update Student'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {student.firstName} {student.lastName}
            </h3>
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {student.studentCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === 'rw' ? 'Siba Umunyeshuri (Delete)' : 'Delete Student'}</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Izina ry\'Umutwe (First Name) *' : 'First Name *'}
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Izina ry\'Umuryango (Last Name) *' : 'Last Name *'}
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Igitsina (Gender) *' : 'Gender *'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              >
                <option value="Male">{lang === 'rw' ? 'Gabo (Male)' : 'Male'}</option>
                <option value="Female">{lang === 'rw' ? 'Gore (Female)' : 'Female'}</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Itariki y\'Amavuko (Date of Birth) *' : 'Date of Birth *'}
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* National ID (Strict 16 Digits) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">
                {lang === 'rw' ? 'Indangamuntu (Imibare 16 neza) *' : 'National ID (16 Digits) *'}
              </label>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                nationalIdOrIndex.length === 16 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {nationalIdOrIndex.length} / 16
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={16}
              value={nationalIdOrIndex}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                setNationalIdOrIndex(v);
                if (v.length === 16) setNidError('');
              }}
              className={`w-full px-3 py-2 border rounded-lg font-mono ${
                nidError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white'
              }`}
            />
            {nidError && <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠ {nidError}</p>}
          </div>

          {/* Parent Phone (Strict 10 Digits starting with 07) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Amazina y\'Umubyeyi *' : 'Parent Name *'}
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">
                  {lang === 'rw' ? 'Telefoni (Imibare 10: 07...) *' : 'Parent Phone (10 Digits: 07...) *'}
                </label>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  /^07\d{8}$/.test(parentPhone) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {parentPhone.length} / 10
                </span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={parentPhone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setParentPhone(v);
                  if (/^07\d{8}$/.test(v)) setPhoneError('');
                }}
                className={`w-full px-3 py-2 border rounded-lg font-mono ${
                  phoneError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:bg-white'
                }`}
              />
              {phoneError && <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠ {phoneError}</p>}
            </div>
          </div>

          {/* Trade & Level & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Ishami (Trade)' : 'Trade'}
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as TradeCode)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                {TRADES.map(t => (
                  <option key={t.code} value={t.code}>{t.code} - {t.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Urwego (Level)' : 'Level'}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as LevelCode)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="L3">Level 3 (L3)</option>
                <option value="L4">Level 4 (L4)</option>
                <option value="L5">Level 5 (L5)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Uko Ahagaze (Status)' : 'Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdmissionStatus)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="admitted">{lang === 'rw' ? 'Yemerewe (Admitted)' : 'Admitted'}</option>
                <option value="verified">{lang === 'rw' ? 'Dosiye Yuzuye (Verified)' : 'Verified'}</option>
                <option value="incomplete_docs">{lang === 'rw' ? 'Haburamo Ibyemezo' : 'Missing Docs'}</option>
                <option value="pending">{lang === 'rw' ? 'Bitegerejwe (Pending)' : 'Pending'}</option>
                <option value="rejected">{lang === 'rw' ? 'Byanzwe (Rejected)' : 'Rejected'}</option>
              </select>
            </div>
          </div>

          {/* Boarding mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Ubwoko bwo Kwiga (Mode)' : 'Attendance Mode'}
              </label>
              <select
                value={boardingType}
                onChange={(e) => setBoardingType(e.target.value as BoardingType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              >
                <option value="boarding">{lang === 'rw' ? 'Ucumbika (Boarding)' : 'Boarding'}</option>
                <option value="day_scholar">{lang === 'rw' ? 'Utaha (Day Scholar)' : 'Day Scholar'}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Akarere & Umurenge' : 'District & Sector'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-1/2 px-2.5 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Sector"
                  className="w-1/2 px-2.5 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {lang === 'rw' ? 'Ibyitonderwa (Notes)' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
            >
              {lang === 'rw' ? 'Kureka' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Emeza Impinduka (Update)' : 'Save Changes (Update)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
