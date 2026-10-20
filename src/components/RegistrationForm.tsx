import React, { useState } from 'react';
import { 
  StudentRecord, 
  TradeCode, 
  LevelCode, 
  Gender, 
  BoardingType, 
  StudentDocument 
} from '../types';
import { TRADES, STANDARD_DOCUMENTS, FEE_STRUCTURE } from '../data/initialData';
import { 
  UserPlus, 
  CheckCircle, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Sparkles, 
  CreditCard, 
  Phone, 
  Building, 
  GraduationCap, 
  BedDouble, 
  Send,
  Printer
} from 'lucide-react';

interface RegistrationFormProps {
  onAddStudent: (newStudent: StudentRecord) => void;
  lang: 'rw' | 'en';
  onNavigateTab: (tabId: string) => void;
  onSendSms: (phone: string, name: string, code: string, message: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onAddStudent,
  lang,
  onNavigateTab,
  onSendSms,
}) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dob, setDob] = useState('2008-05-15');
  const [nationalIdOrIndex, setNationalIdOrIndex] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [district, setDistrict] = useState('Ruhango');
  const [sector, setSector] = useState('Bweramana');

  const [trade, setTrade] = useState<TradeCode>('SOD');
  const [level, setLevel] = useState<LevelCode>('L3');
  const [boardingType, setBoardingType] = useState<BoardingType>('boarding');

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('078');
  const [parentEmail, setParentEmail] = useState('');

  // Initial payment
  const expectedFee = boardingType === 'boarding' 
    ? FEE_STRUCTURE.boarding.total 
    : FEE_STRUCTURE.dayScholar.total;
  const [initialPayment, setInitialPayment] = useState<number>(expectedFee);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank' | 'cash'>('momo');

  // Documents status
  const [docsStatus, setDocsStatus] = useState<{ [id: string]: boolean }>({
    doc_transcript: true,
    doc_birth_cert: true,
    doc_medical: true,
    doc_bank_slip: true,
    doc_photo: true,
  });

  const [notes, setNotes] = useState('');
  const [submittedStudent, setSubmittedStudent] = useState<StudentRecord | null>(null);

  const toggleDoc = (docId: string) => {
    setDocsStatus(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !nationalIdOrIndex.trim() || !parentPhone.trim()) {
      alert(lang === 'rw' ? 'Nyamuneka uzuza imyirondoro yose y\'ingenzi' : 'Please fill all required personal fields');
      return;
    }

    // Generate unique student code
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const generatedCode = `EAV/2026/${trade}/${randomSeq}`;

    // Compile documents array
    const compiledDocs: StudentDocument[] = STANDARD_DOCUMENTS.map(stdDoc => {
      const isAttached = !!docsStatus[stdDoc.id];
      return {
        ...stdDoc,
        isUploaded: isAttached,
        fileName: isAttached ? `${firstName}_${stdDoc.id}.pdf` : undefined,
        fileSize: isAttached ? `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB` : undefined,
        uploadDate: isAttached ? new Date().toISOString().split('T')[0] : undefined,
        status: isAttached ? 'verified' : 'missing',
      };
    });

    const allVerified = compiledDocs.every(d => d.isUploaded);
    const balance = Math.max(0, expectedFee - Number(initialPayment));

    const newStudent: StudentRecord = {
      id: `std_${Date.now()}`,
      studentCode: generatedCode,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dob,
      nationalIdOrIndex: nationalIdOrIndex.trim(),
      previousSchool: previousSchool.trim() || 'GS Gitwe',
      trade,
      level,
      boardingType,
      dormitoryBlock: boardingType === 'boarding' ? (gender === 'Male' ? 'Block A (Boys)' : 'Block C (Girls)') : undefined,
      roomNumber: boardingType === 'boarding' ? (gender === 'Male' ? 'Room 102' : 'Room 204') : undefined,
      bedNumber: boardingType === 'boarding' ? (gender === 'Male' ? `Bed A-${Math.floor(Math.random() * 20 + 1)}` : `Bed C-${Math.floor(Math.random() * 20 + 1)}`) : undefined,
      parentName: parentName.trim() || 'Umubyeyi',
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      district: district.trim(),
      sector: sector.trim(),
      status: allVerified ? 'admitted' : 'incomplete_docs',
      applicationDate: new Date().toISOString().split('T')[0],
      documents: compiledDocs,
      fees: {
        totalExpected: expectedFee,
        amountPaid: Number(initialPayment),
        balance,
        lastPaymentDate: Number(initialPayment) > 0 ? new Date().toISOString().split('T')[0] : undefined,
        receiptNumber: Number(initialPayment) > 0 ? `REC-2026-${Math.floor(200 + Math.random() * 700)}` : undefined,
      },
      notes: notes.trim(),
    };

    onAddStudent(newStudent);
    setSubmittedStudent(newStudent);

    // Auto-trigger SMS alert notification to parent
    const smsMsg = allVerified
      ? `Muraho! ${newStudent.firstName} ${newStudent.lastName} yanditswe muri EAV Gitwe TSS mu ishami rya ${newStudent.trade} (${newStudent.level}). Code ye ni ${newStudent.studentCode}. Amasomo azatangira kuwa 03/11/2026. Murakoze!`
      : `Muraho! Dosiye ya ${newStudent.firstName} muri EAV Gitwe TSS (Code: ${newStudent.studentCode}) iraburamo bimwe mu byangombwa. Mwakwihutira kubyuzuza. Murakoze.`;
    
    onSendSms(newStudent.parentPhone, newStudent.parentName, newStudent.studentCode, smsMsg);
  };

  const handleReset = () => {
    setSubmittedStudent(null);
    setFirstName('');
    setLastName('');
    setNationalIdOrIndex('');
    setPreviousSchool('');
    setNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Success View if just submitted */}
      {submittedStudent ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {lang === 'rw' ? 'Iyandikwa Ryagenze Neza' : 'Registration Successfully Completed'}
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              {submittedStudent.firstName} {submittedStudent.lastName}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'rw' 
                ? 'Umunyeshuri yahawe code yihariye yo kwinjira muri EAV Gitwe TSS:' 
                : 'Student registered and assigned unique institutional registration code:'}
            </p>
            <div className="mt-3 inline-block bg-slate-900 text-emerald-400 font-mono text-xl font-extrabold px-5 py-2.5 rounded-xl tracking-wider shadow-inner">
              {submittedStudent.studentCode}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-500 block">{lang === 'rw' ? 'Ishami & Urwego' : 'Trade & Level'}</span>
              <span className="font-bold text-slate-800">{submittedStudent.trade} • {submittedStudent.level}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{lang === 'rw' ? 'Ubwoko bwo kwiga' : 'Attendance Mode'}</span>
              <span className="font-bold text-purple-700">
                {submittedStudent.boardingType === 'boarding' 
                  ? (lang === 'rw' ? `Ucumbika (${submittedStudent.dormitoryBlock} - ${submittedStudent.bedNumber})` : `Boarding (${submittedStudent.dormitoryBlock})`)
                  : (lang === 'rw' ? 'Utaha (Day Scholar)' : 'Day Scholar')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{lang === 'rw' ? 'Amafaranga yishyuwe' : 'Fees Paid'}</span>
              <span className="font-bold text-emerald-700">{submittedStudent.fees.amountPaid.toLocaleString()} RWF</span>
              <span className="text-slate-400 text-[11px] block">
                {submittedStudent.fees.balance === 0 
                  ? (lang === 'rw' ? 'Byose byishyuwe' : 'Fully Paid') 
                  : (lang === 'rw' ? `Asigaye: ${submittedStudent.fees.balance.toLocaleString()} RWF` : `Balance: ${submittedStudent.fees.balance.toLocaleString()} RWF`)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 mb-6">
            <Send className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              {lang === 'rw'
                ? `Ubutumwa bwa SMS bwoherejwe kuri numero y'umubyeyi (${submittedStudent.parentPhone}) bwemeza ko umwana yanditswe.`
                : `Instant SMS notification dispatched to parent (${submittedStudent.parentPhone}) with student code and reporting guidelines.`}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Ibaruwa yo Kwemererwa (Admission Letter)' : 'Print Admission Letter'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Andika Undi Munyeshuri' : 'Admit Another Student'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {lang === 'rw' ? 'Subira ku Kibaho Rusange' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      ) : (
        /* The Registration Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'rw' ? 'Kwakira no Kwandika Umunyeshuri Mushya' : 'New Student Admission & Intake Form'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'rw'
                ? 'EAV Gitwe TSS • Kigali-Huye Highway, Ruhango. Uzuza imyirondoro, hitamo ishami, ubwoko bw\'icumbi, n\'inyemezabwishyu.'
                : 'Complete student bio-data, trade choice, boarding allocation, and upload required documents.'}
            </p>
          </div>

          {/* Section 1: Personal Bio-data */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span>1. {lang === 'rw' ? 'Imyirondoro y\'Umunyeshuri' : 'Student Bio-Data'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Izina ry\'Umutwe (First Name) *' : 'First Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="urugero: Jean Claude"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Izina ry\'Umuryango (Last Name) *' : 'Last Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="urugero: Mugisha"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Igitsina (Gender) *' : 'Gender *'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                >
                  <option value="Male">{lang === 'rw' ? 'Gabo (Male)' : 'Male'}</option>
                  <option value="Female">{lang === 'rw' ? 'Gore (Female)' : 'Female'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Itariki y\'Amavuko (Date of Birth) *' : 'Date of Birth *'}
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Indangamuntu cyangwa O-Level Index No *' : 'National ID / S3 Candidate Index *'}
                </label>
                <input
                  type="text"
                  required
                  value={nationalIdOrIndex}
                  onChange={(e) => setNationalIdOrIndex(e.target.value)}
                  placeholder="urugero: 1200880193821092 cyangwa 0204/001/25"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Ishuri Yaturutsemo (Previous School)' : 'Previous School Attended'}
                </label>
                <input
                  type="text"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  placeholder="urugero: GS Gitwe Protestant"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Akarere (District)' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ruhango, Nyanza, Muhanga, etc."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Umurenge (Sector)' : 'Sector'}
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Bweramana, Kinihira, etc."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Trade & Level Placement */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span>2. {lang === 'rw' ? 'Ishami & Urwego rwa RTB (Trade & Level)' : 'Academic Program & Level'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Hitamo Ishami (Trade) *' : 'Select Trade *'}
                </label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value as TradeCode)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                >
                  {TRADES.map(t => (
                    <option key={t.code} value={t.code}>
                      {t.code} - {lang === 'rw' ? t.nameRw : t.nameEn}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  {TRADES.find(t => t.code === trade)?.descriptionRw}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Urwego rwa RTB (Level) *' : 'TVET Level *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['L3', 'L4', 'L5'] as LevelCode[]).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        level === lvl
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {level === 'L3' && (lang === 'rw' ? 'Abatangiye baturutse mu cyiciro rusange (S3 graduates)' : 'Entry level for O-Level completers')}
                  {level === 'L4' && (lang === 'rw' ? 'Urwego rwo hagati (Intermediate TVET technician)' : 'Intermediate technician level')}
                  {level === 'L5' && (lang === 'rw' ? 'Urwego rusumba izindi (Advanced TVET Diploma year)' : 'Advanced TVET finishing year')}
                </p>
              </div>
            </div>

            {/* Boarding vs Day Scholar */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Gucumbika cyangwa Gutaha (Residential Status) *' : 'Residential Status *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setBoardingType('boarding');
                    setInitialPayment(FEE_STRUCTURE.boarding.total);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    boardingType === 'boarding'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BedDouble className={`w-4 h-4 ${boardingType === 'boarding' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900">
                      {lang === 'rw' ? 'Umunyeshuri Ucumbika (Boarding)' : 'Full Boarding Student'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {lang === 'rw'
                      ? 'Acumbikirwa mu kigo (Block A/B/C/D), ahabwa ifunguro rya mugitondo, saa sita n\'ijoro.'
                      : 'Allocated bed in dormitories with daily meals & utilities.'}
                  </p>
                  <div className="text-xs font-bold text-emerald-800 mt-2">
                    {FEE_STRUCTURE.boarding.total.toLocaleString()} RWF / {lang === 'rw' ? 'igihembwe' : 'term'}
                  </div>
                </div>

                <div
                  onClick={() => {
                    setBoardingType('day_scholar');
                    setInitialPayment(FEE_STRUCTURE.dayScholar.total);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    boardingType === 'day_scholar'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building className={`w-4 h-4 ${boardingType === 'day_scholar' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900">
                      {lang === 'rw' ? 'Umunyeshuri Utaha (Day Scholar)' : 'Day Scholar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {lang === 'rw'
                      ? 'Ataha iwabo mu ngo hafi y\'i Gitwe, yiga gusa amasomo n\'imyitozo y\'amashami.'
                      : 'Lives off campus near Gitwe; attends daytime classes and workshops.'}
                  </p>
                  <div className="text-xs font-bold text-emerald-800 mt-2">
                    {FEE_STRUCTURE.dayScholar.total.toLocaleString()} RWF / {lang === 'rw' ? 'igihembwe' : 'term'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Parent / Guardian Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>3. {lang === 'rw' ? 'Umubyeyi / Umurenzi (Parent / Guardian Contacts)' : 'Parent & Guardian Information'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Amazina y\'Umubyeyi *' : 'Parent Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="urugero: Emmanuel Hakizimana"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Numero ya Telefoni (SMS Alert) *' : 'Mobile Phone (for SMS Alerts) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="0788123456"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Imeli (Email - Niba ihari)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="umubyeyi@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Document Verification Checklist (Solving Challenge 1) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. {lang === 'rw' ? 'Kugenzura Ibyangombwa (Document Verification)' : 'Mandatory Document Uploads'}</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {lang === 'rw' ? 'Genzura ibyatanzwe' : 'Check submitted docs'}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {lang === 'rw'
                ? 'Kanda kuri buri cyangombwa kugira ngo wemeze ko cyakiriwe muri dosiye y\'umunyeshuri:'
                : 'Click each document to mark as verified or received with this application:'}
            </p>

            <div className="space-y-2">
              {STANDARD_DOCUMENTS.map((doc) => {
                const isChecked = !!docsStatus[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-800 block">
                          {lang === 'rw' ? doc.nameRw : doc.nameEn}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isChecked ? (lang === 'rw' ? '✓ Dosiye yakiriwe kandi yemejwe' : '✓ Verified and attached') : (lang === 'rw' ? '✗ Iki cyangombwa kirabura' : '✗ Missing document')}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isChecked ? (lang === 'rw' ? 'Byuzuye' : 'Present') : (lang === 'rw' ? 'Kirasabwa' : 'Required')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: School Fees Deposit & Payment (Solving Challenge 6) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>5. {lang === 'rw' ? 'Amafaranga y\'Ishuri yo Kwiyandikisha (Initial Fees)' : 'School Fees & Payment'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Amafaranga Asabwa (Total Expected)' : 'Total Expected Fee'}
                </label>
                <div className="text-base font-extrabold text-slate-900 py-1">
                  {expectedFee.toLocaleString()} RWF
                </div>
                <span className="text-[11px] text-slate-500">
                  {boardingType === 'boarding' 
                    ? (lang === 'rw' ? 'Amashuri + Amacumbi + Ibiribwa + Umwambaro' : 'Tuition + Dorms + Meals + Uniform')
                    : (lang === 'rw' ? 'Amashuri + Umwambaro n\'Ibyuma by\'Imyitozo' : 'Tuition + Workshops + Uniform')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Amafaranga Yishyuwe Nonaha (Amount Paid Now)' : 'Amount Paid Today (RWF) *'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={expectedFee}
                  value={initialPayment}
                  onChange={(e) => setInitialPayment(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-mono font-bold text-emerald-800"
                />
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>{lang === 'rw' ? 'Asigaye kwishyurwa:' : 'Remaining balance:'}</span>
                  <span className="font-bold text-rose-600">
                    {Math.max(0, expectedFee - initialPayment).toLocaleString()} RWF
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Administrative notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'rw' ? 'Ibyitonderwa by\'Ubuyobozi (Admin Notes)' : 'Administrative Notes (Optional)'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'rw' ? 'Urugero: Yahawe igitanda muri Block A, agomba kuzana amashuka abiri n\'inzitiramubu...' : 'E.g., Allocated bed in Block A, bring two blue bedsheets and mosquito net...'}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {lang === 'rw' ? 'Kureka' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Kwemeza & Gutanga Student Code' : 'Submit & Generate Student Code'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
