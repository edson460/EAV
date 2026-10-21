import React, { useState } from 'react';
import { StudentRecord, TradeCode, LevelCode } from '../types';
import { TRADES } from '../data/initialData';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Search, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  Building2,
  FileText
} from 'lucide-react';

interface ReportsViewProps {
  students: StudentRecord[];
  lang: 'rw' | 'en';
  onOpenLetter: (student: StudentRecord) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  lang,
  onOpenLetter,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtered for class list
  const filteredStudents = students.filter(s => {
    const matchesTrade = selectedTrade === 'all' || s.trade === selectedTrade;
    const matchesLevel = selectedLevel === 'all' || s.level === selectedLevel;
    return matchesTrade && matchesLevel;
  });

  // Calculate RTB trade matrix
  const matrix = TRADES.map(t => {
    const tradeStudents = students.filter(s => s.trade === t.code);
    const l3 = tradeStudents.filter(s => s.level === 'L3').length;
    const l4 = tradeStudents.filter(s => s.level === 'L4').length;
    const l5 = tradeStudents.filter(s => s.level === 'L5').length;
    const males = tradeStudents.filter(s => s.gender === 'Male').length;
    const females = tradeStudents.filter(s => s.gender === 'Female').length;
    const boarding = tradeStudents.filter(s => s.boardingType === 'boarding').length;
    const day = tradeStudents.filter(s => s.boardingType === 'day_scholar').length;
    const total = tradeStudents.length;
    const capacity = t.capacityL3 + t.capacityL4 + t.capacityL5;
    return {
      trade: t,
      l3,
      l4,
      l5,
      males,
      females,
      boarding,
      day,
      total,
      capacity,
      pct: Math.round((total / capacity) * 100),
    };
  });

  // Export to CSV functionality
  const handleExportCSV = () => {
    const headers = [
      'Student Code',
      'First Name',
      'Last Name',
      'Gender',
      'Date of Birth',
      'National ID / Index',
      'Trade',
      'Level',
      'Attendance Mode',
      'Dormitory Block',
      'Room / Bed',
      'Parent Name',
      'Parent Phone',
      'District',
      'Sector',
      'Status',
      'Total Fees Due',
      'Fees Paid',
      'Fees Balance',
      'Receipt No'
    ];

    const rows = students.map(s => [
      `"${s.studentCode}"`,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      `"${s.nationalIdOrIndex}"`,
      `"${s.trade}"`,
      `"${s.level}"`,
      `"${s.boardingType}"`,
      `"${s.dormitoryBlock || 'N/A'}"`,
      `"${s.bedNumber || 'N/A'}"`,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${s.district}"`,
      `"${s.sector}"`,
      `"${s.status}"`,
      s.fees.totalExpected,
      s.fees.amountPaid,
      s.fees.balance,
      `"${s.fees.receiptNumber || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EAV_Gitwe_TSS_Students_Register_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download database_schema.sql for XAMPP
  const handleDownloadSQL = () => {
    fetch('/database_schema.sql')
      .then(res => res.text())
      .then(sqlContent => {
        const blob = new Blob([sqlContent], { type: 'text/sql' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'database_schema.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        alert(lang === 'rw' ? 'Dosiye iri gukururwa...' : 'Downloading database file...');
      });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Challenge 8 info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>{lang === 'rw' ? 'Imbogamizi ya 8: Gutegura Raporo z\'Abanyeshuri kuri RTB' : 'Challenge #8: Automated RTB Statistical Reporting'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'rw' ? 'Raporo z\'Ubuyobozi & Imbonerahamwe ya RTB' : 'RTB Intake Analytics & Institutional Reports'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'rw' 
              ? 'Imbonerahamwe yuzuye y\'abanyeshuri biyandikishije muri buri shami, igitsina, n\'urwego (L3-L5) iboneka mu kanya gato.' 
              : 'Real-time demographic matrices, trade enrollments, gender parity ratios, and 1-click CSV data export.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadSQL}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download database_schema.sql for XAMPP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'rw' ? 'Manura SQL (XAMPP)' : 'Download SQL (XAMPP)'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{lang === 'rw' ? 'Excel / CSV' : 'Export to CSV'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'rw' ? 'Capa Raporo' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Official RTB Demographic Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              {lang === 'rw' ? 'Imbonerahamwe y\'Ikwirakwizwa ry\'Abanyeshuri (RTB Enrollment Matrix)' : 'Accredited Trade Demographic Matrix (RTB Compliant)'}
            </h3>
            <span className="text-xs text-slate-500">
              EAV Gitwe TSS • Ruhango District • Term 1 Intake 2026/2027
            </span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
            Official RTB Form A-1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Trade Code</th>
                <th className="py-3 px-3">{lang === 'rw' ? 'Ishami (Trade Name)' : 'Trade Name'}</th>
                <th className="py-3 px-3 text-center">L3</th>
                <th className="py-3 px-3 text-center">L4</th>
                <th className="py-3 px-3 text-center">L5</th>
                <th className="py-3 px-3 text-center">{lang === 'rw' ? 'Gabo (M)' : 'Males'}</th>
                <th className="py-3 px-3 text-center">{lang === 'rw' ? 'Gore (F)' : 'Females'}</th>
                <th className="py-3 px-3 text-center">{lang === 'rw' ? 'Ucumbika' : 'Boarding'}</th>
                <th className="py-3 px-3 text-center">{lang === 'rw' ? 'Utaha' : 'Day'}</th>
                <th className="py-3 px-3 text-right">{lang === 'rw' ? 'Bose Hamwe' : 'Total'}</th>
                <th className="py-3 px-3 text-right">{lang === 'rw' ? 'Ubushobozi' : 'Capacity'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map(m => (
                <tr key={m.trade.code} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{m.trade.code}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{lang === 'rw' ? m.trade.nameRw : m.trade.nameEn}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">{m.l3}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">{m.l4}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">{m.l5}</td>
                  <td className="py-3 px-3 text-center font-mono text-blue-700 font-semibold">{m.males}</td>
                  <td className="py-3 px-3 text-center font-mono text-rose-700 font-semibold">{m.females}</td>
                  <td className="py-3 px-3 text-center font-mono text-purple-700 font-semibold">{m.boarding}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600 font-semibold">{m.day}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{m.total}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">{m.capacity} ({m.pct}%)</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100/80 font-black text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="py-3 px-3 uppercase tracking-wider">{lang === 'rw' ? 'Igiteranyo Rusange' : 'Total Enrolled'}</td>
                <td className="py-3 px-3 text-center font-mono">{matrix.reduce((a, b) => a + b.l3, 0)}</td>
                <td className="py-3 px-3 text-center font-mono">{matrix.reduce((a, b) => a + b.l4, 0)}</td>
                <td className="py-3 px-3 text-center font-mono">{matrix.reduce((a, b) => a + b.l5, 0)}</td>
                <td className="py-3 px-3 text-center font-mono text-blue-800">{matrix.reduce((a, b) => a + b.males, 0)}</td>
                <td className="py-3 px-3 text-center font-mono text-rose-800">{matrix.reduce((a, b) => a + b.females, 0)}</td>
                <td className="py-3 px-3 text-center font-mono text-purple-800">{matrix.reduce((a, b) => a + b.boarding, 0)}</td>
                <td className="py-3 px-3 text-center font-mono text-slate-700">{matrix.reduce((a, b) => a + b.day, 0)}</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-800 text-sm">{students.length}</td>
                <td className="py-3 px-3 text-right font-mono text-slate-700">510</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Class Register & Admission Letters Generator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              {lang === 'rw' ? 'Urutonde rw\'Icyiciro & Gutanga Ibaruwa (Class List & Letters)' : 'Class Register & Admission Letters'}
            </h3>
            <span className="text-xs text-slate-500">
              {lang === 'rw' ? 'Hitamo ishami n\'urwego kugira ngo urebe abanyeshuri baryo' : 'Filter by trade and level to print class rosters or admission offers'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
            >
              <option value="all">{lang === 'rw' ? 'Amashami Yose' : 'All Trades'}</option>
              {TRADES.map(t => (
                <option key={t.code} value={t.code}>{t.code}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
            >
              <option value="all">{lang === 'rw' ? 'Inzego Zose' : 'All Levels'}</option>
              <option value="L3">Level 3 (L3)</option>
              <option value="L4">Level 4 (L4)</option>
              <option value="L5">Level 5 (L5)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Student Code</th>
                <th className="py-2.5 px-3">{lang === 'rw' ? 'Amazina y\'Umunyeshuri' : 'Student Full Name'}</th>
                <th className="py-2.5 px-3">Trade & Level</th>
                <th className="py-2.5 px-3">{lang === 'rw' ? 'Ubwoko' : 'Mode'}</th>
                <th className="py-2.5 px-3">{lang === 'rw' ? 'Telefoni y\'Umubyeyi' : 'Parent Contact'}</th>
                <th className="py-2.5 px-3">{lang === 'rw' ? 'Akarere' : 'District'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'rw' ? 'Ibaruwa' : 'Admission Letter'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st, i) => (
                <tr key={st.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{st.studentCode}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{st.firstName} {st.lastName}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800">{st.trade}</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {st.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[11px] font-medium text-slate-600">
                      {st.boardingType === 'boarding' ? (lang === 'rw' ? 'Ucumbika' : 'Boarding') : (lang === 'rw' ? 'Utaha' : 'Day')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{st.parentPhone}</td>
                  <td className="py-2.5 px-3 text-slate-600">{st.district}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onOpenLetter(st)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1 ml-auto transition-colors cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{lang === 'rw' ? 'Fungura Ibaruwa' : 'View Letter'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
