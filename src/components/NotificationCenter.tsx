import React, { useState } from 'react';
import { StudentRecord, SmsNotification } from '../types';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Clock, 
  CheckCheck, 
  Users, 
  Sparkles, 
  Smartphone,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface NotificationCenterProps {
  students: StudentRecord[];
  notifications: SmsNotification[];
  onSendSms: (phone: string, name: string, code: string, message: string) => void;
  lang: 'rw' | 'en';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  students,
  notifications,
  onSendSms,
  lang,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [templateType, setTemplateType] = useState<'admission' | 'missing' | 'fees' | 'reopening'>('admission');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [bulkTrade, setBulkTrade] = useState<string>('all');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Auto-generate template text based on selected student
  const getTemplateText = (type: string, st: StudentRecord) => {
    switch (type) {
      case 'admission':
        return `Muraho! ${st.firstName} ${st.lastName} yemerewe kwiga muri EAV Gitwe TSS mu ishami rya ${st.trade} (${st.level}). Code ye ni ${st.studentCode}. Amasomo azatangira kuwa 03/11/2026 saa moya za mugitondo. Murakoze - Ubuyobozi bwa EAV Gitwe.`;
      case 'missing': {
        const missing = st.documents.filter(d => d.status !== 'verified').map(d => d.nameRw).join(', ') || 'icyemezo cy\'ubuzima';
        return `Muraho mubyeyi wa ${st.firstName} (${st.studentCode}), dosiye ye iraburamo: ${missing}. Mwakwihutira kubyohereza kuri sisitemu cyangwa kubizana bitarenze 25/10/2026. EAV Gitwe TSS.`;
      }
      case 'fees':
        return `Muraho! Twabibutsaga ko kuri dosiye ya ${st.firstName} (${st.studentCode}) hasigaye amafaranga y'ishuri angana na ${st.fees.balance.toLocaleString()} RWF. Mwakwishyura kuri MoMo: *182*8*1*04212# cyangwa kuri BK: 00040-029381-44. Murakoze.`;
      case 'reopening':
        return `Muraho mubyeyi! EAV Gitwe TSS iboneyeho kubibutsa ko kwakira abanyeshuri bacumbika bizaba kuwa 01/11/2026. Buri munyeshuri azane amashuka 2 y'ubururu, inzitiramubu, indobo n'umucyo. Murakaza neza!`;
      default:
        return '';
    }
  };

  const activeMessage = customMessage || (selectedStudent ? getTemplateText(templateType, selectedStudent) : '');

  const handleSendSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !activeMessage.trim()) return;

    onSendSms(
      selectedStudent.parentPhone,
      selectedStudent.parentName,
      selectedStudent.studentCode,
      activeMessage
    );
    alert(lang === 'rw' ? 'Ubutumwa bwoherejwe neza kuri telefoni y\'umubyeyi!' : 'SMS successfully dispatched to parent phone!');
    setCustomMessage('');
  };

  const handleBroadcast = () => {
    const targetStudents = bulkTrade === 'all' 
      ? students 
      : students.filter(s => s.trade === bulkTrade);

    if (!confirm(lang === 'rw' 
      ? `Urashaka kohereza ubu butumwa ku babyeyi ${targetStudents.length} bose icyarimwe?` 
      : `Broadcast this notification to all ${targetStudents.length} parents?`)) {
      return;
    }

    targetStudents.forEach(st => {
      const msg = getTemplateText(templateType, st);
      onSendSms(st.parentPhone, st.parentName, st.studentCode, msg);
    });

    alert(lang === 'rw' 
      ? `Ubutumwa bwa SMS bwoherejwe ku babyeyi ${targetStudents.length} bose!` 
      : `Broadcast dispatched to ${targetStudents.length} parents!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Challenge 7 info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-cyan-600" />
            <span>{lang === 'rw' ? 'Imbogamizi ya 7: Kumenyesha Ababyeyi Amakuru' : 'Challenge #7: Parent Communication & SMS Gateway'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'rw' ? 'Ubutumwa bwa SMS ku Babyeyi n\'Abarera' : 'Parent SMS Messaging & Alert Hub'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'rw' 
              ? 'Kumenyesha ababyeyi igihe cyo kwemererwa kwiga, ibyangombwa bibura, inyemezabwishyu n\'amatariki yo gutangira amasomo.' 
              : 'Direct GSM SMS alerts notifying parents of admission acceptance, missing documents deadlines, fee balances, and school opening gear.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-900">
          <Phone className="w-4 h-4 text-cyan-700" />
          <span>Gateway: Rwanda Telco Gateway (MTN / Airtel-Tigo)</span>
        </div>
      </div>

      {/* Main Grid: Form & Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form and Template Controller */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Preset templates selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {lang === 'rw' ? 'Hitamo Inyandiko y\'Ibanze (Select Preset Template):' : 'Select Notification Template:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'admission', rw: 'Kwemererwa Kwiga', en: 'Admission Offer' },
                { id: 'missing', rw: 'Ibyangombwa Bibura', en: 'Missing Documents' },
                { id: 'fees', rw: 'Kwibutsa Amafaranga', en: 'Fee Reminder' },
                { id: 'reopening', rw: 'Gahunda yo Gutangira', en: 'School Reopening' },
              ].map(tpl => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => {
                    setTemplateType(tpl.id as any);
                    setCustomMessage('');
                  }}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    templateType === tpl.id
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'rw' ? tpl.rw : tpl.en}
                </button>
              ))}
            </div>
          </div>

          {/* Target Student Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Hitamo Umunyeshuri (Recipient Student):' : 'Recipient Student:'}
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.studentCode}) - {s.parentPhone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'rw' ? 'Umubyeyi & Telefoni (Parent & Phone):' : 'Parent Contact Details:'}
              </label>
              <div className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-800 font-medium flex justify-between items-center">
                <span>{selectedStudent?.parentName}</span>
                <span className="font-mono font-bold text-cyan-800">{selectedStudent?.parentPhone}</span>
              </div>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {lang === 'rw' ? 'Ubutumwa bwa SMS (Message Body):' : 'SMS Message Body:'}
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeMessage.length} characters • {Math.ceil(activeMessage.length / 160)} SMS
              </span>
            </div>
            <textarea
              rows={4}
              value={activeMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-slate-50 focus:bg-white font-sans leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <select
                value={bulkTrade}
                onChange={(e) => setBulkTrade(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="all">{lang === 'rw' ? 'Ababyeyi bose (Bose)' : 'All Parents'}</option>
                <option value="SOD">Software Dev Parents</option>
                <option value="BCN">Construction Parents</option>
                <option value="ANH">Animal Health Parents</option>
                <option value="AGR">Agriculture Parents</option>
              </select>

              <button
                type="button"
                onClick={handleBroadcast}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'rw' ? 'Kohereza kuri bose (Broadcast)' : 'Bulk SMS'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendSingle}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Ohereza SMS Nonaha' : 'Dispatch SMS'}</span>
            </button>
          </div>
        </div>

        {/* Smartphone Live Preview Mockup */}
        <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border-4 border-slate-800 text-white flex flex-col justify-between max-w-sm mx-auto w-full">
          {/* Phone Top Notch */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pb-2 border-b border-slate-800">
              <span>09:41</span>
              <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto" />
              <span>4G LTE • 98%</span>
            </div>

            {/* Chat Header */}
            <div className="flex items-center gap-2.5 py-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                EAV
              </div>
              <div>
                <div className="font-bold text-xs text-slate-100">EAV GITWE TSS</div>
                <div className="text-[10px] text-emerald-400">Verified Sender ID</div>
              </div>
            </div>

            {/* Simulated Message Bubble */}
            <div className="py-4 space-y-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">
                  Today • SMS Notification
                </span>
              </div>

              <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-200 border border-slate-700/60 leading-relaxed shadow-sm">
                <p>{activeMessage || 'Hitamo ubutumwa cyangwa wandike... '}</p>
                <div className="text-right text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-end gap-1">
                  <span>Just now</span>
                  <CheckCheck className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            {lang === 'rw' ? 'Iboneka kuri telefoni y\'umubyeyi' : 'Live Parent Handset Simulation'}
          </div>
        </div>
      </div>

      {/* Dispatched History Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{lang === 'rw' ? 'Ubutumwa bwaherutse koherezwa (SMS Dispatch History)' : 'Recent SMS Dispatch Logs'}</span>
        </h3>

        <div className="space-y-2">
          {notifications.map(notif => (
            <div key={notif.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span>{notif.recipientName} ({notif.recipientPhone})</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {notif.studentCode}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{notif.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-shrink-0 font-mono">
                <span>{notif.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {notif.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
