import React from 'react';
import { 
  StudentRecord, 
  DormitoryBlock, 
  TradeInfo, 
  TradeCode 
} from '../types';
import { TRADES } from '../data/initialData';
import { 
  Users, 
  UserCheck, 
  Clock, 
  BedDouble, 
  CreditCard, 
  UserPlus, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Send,
  Building2,
  TrendingUp,
  Download
} from 'lucide-react';

interface DashboardViewProps {
  students: StudentRecord[];
  dorms: DormitoryBlock[];
  lang: 'rw' | 'en';
  onNavigateTab: (tabId: string) => void;
  onSelectStudent: (student: StudentRecord) => void;
  onOpenLetter: (student: StudentRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  dorms,
  lang,
  onNavigateTab,
  onSelectStudent,
  onOpenLetter,
}) => {
  // Calculations
  const totalStudents = students.length;
  const admittedCount = students.filter(s => s.status === 'admitted').length;
  const verifiedCount = students.filter(s => s.status === 'verified').length;
  const pendingCount = students.filter(s => s.status === 'pending' || s.status === 'incomplete_docs').length;
  const boardingCount = students.filter(s => s.boardingType === 'boarding').length;
  const dayScholarCount = students.filter(s => s.boardingType === 'day_scholar').length;

  const totalFeesExpected = students.reduce((acc, s) => acc + s.fees.totalExpected, 0);
  const totalFeesCollected = students.reduce((acc, s) => acc + s.fees.amountPaid, 0);
  const totalBalanceRemaining = totalFeesExpected - totalFeesCollected;

  const totalBeds = dorms.reduce((acc, d) => acc + d.totalBeds, 0);
  const occupiedBeds = dorms.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const dormOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Gender counts
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const femalePercentage = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // Counts per trade
  const tradeCounts = TRADES.map(t => {
    const count = students.filter(s => s.trade === t.code).length;
    const admittedTrade = students.filter(s => s.trade === t.code && s.status === 'admitted').length;
    const capacityTotal = t.capacityL3 + t.capacityL4 + t.capacityL5;
    return {
      ...t,
      currentCount: count,
      admittedCount: admittedTrade,
      capacityTotal,
      percentage: Math.round((count / capacityTotal) * 100),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert for Intake Period */}
      <div className="bg-emerald-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center flex-shrink-0 text-emerald-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span>{lang === 'rw' ? 'Igihembwe cya 1 (Term 1) 2026/2027: Kwakira Abanyeshuri Bashya' : 'Academic Year 2026/2027: New Student Intake Live'}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-emerald-200">
              {lang === 'rw' 
                ? 'EAV Gitwe TSS • Amashami 4: Software Dev, Construction, Vet & Agriculture (L3-L5)'
                : 'EAV Gitwe TSS • 4 RTB Trades: Software Dev, Construction, Animal Health & Agriculture'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('registration')}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'rw' ? 'Kwandika Umunyeshuri' : 'New Admission'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-600/60 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'rw' ? 'Raporo ya RTB' : 'Export RTB Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applicants */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{lang === 'rw' ? 'Abasabye Bose' : 'Total Applicants'}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalStudents}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">{admittedCount} {lang === 'rw' ? 'bemerewe' : 'admitted'}</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">{pendingCount} {lang === 'rw' ? 'bategereje' : 'pending'}</span>
            </div>
          </div>
        </div>

        {/* Boarding Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{lang === 'rw' ? 'Abacumbika (Boarding)' : 'Boarding Students'}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{boardingCount}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span>{dayScholarCount} {lang === 'rw' ? 'bataha (Day scholars)' : 'day scholars'}</span>
              <span>•</span>
              <span className="text-purple-700 font-semibold">{dormOccupancyRate}% {lang === 'rw' ? 'amacumbi' : 'dorm beds'}</span>
            </div>
          </div>
        </div>

        {/* Fees Collected */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{lang === 'rw' ? 'Amafaranga Yishyuwe' : 'Fees Collected'}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">
              {totalFeesCollected.toLocaleString()} <span className="text-xs font-semibold text-slate-500">RWF</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>{lang === 'rw' ? 'Asigaye:' : 'Pending:'} </span>
              <span className="text-rose-600 font-semibold">{totalBalanceRemaining.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        {/* Gender Balance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{lang === 'rw' ? 'Ihiganwa ry\'Igitsina (Gender)' : 'Gender Equality (RTB)'}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {femalePercentage}% <span className="text-xs font-normal text-slate-500">{lang === 'rw' ? 'Abakobwa' : 'Female'}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>{femaleCount} {lang === 'rw' ? 'Abakobwa' : 'Females'}</span>
              <span>{maleCount} {lang === 'rw' ? 'Abahungu' : 'Males'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Quotas and Intake Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Capacity Progress Bars */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === 'rw' ? 'Icyegeranyo cy\'Amashami 4 n\'Imyanya Ihari' : 'Trade Quotas & Intake Capacity Progress'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'rw' 
                  ? 'Kugenzura umubare w\'abanyeshuri bemerewe muri buri shami (L3 - L5)' 
                  : 'Live student distribution vs RTB maximum capacity per trade'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('registration')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{lang === 'rw' ? 'Ongeraho umunyeshuri' : 'Add student'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {tradeCounts.map((t) => (
              <div key={t.code} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px]">
                      {t.code}
                    </span>
                    <span className="font-bold text-slate-800">
                      {lang === 'rw' ? t.nameRw : t.nameEn}
                    </span>
                  </div>
                  <div className="font-medium text-slate-600">
                    <span className="text-emerald-700 font-bold">{t.currentCount}</span> / {t.capacityTotal} {lang === 'rw' ? 'imyanya' : 'seats'}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(8, (t.currentCount / t.capacityTotal) * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>H.O.D: {t.headOfDepartment}</span>
                  <span className="text-slate-600 font-semibold">{t.admittedCount} {lang === 'rw' ? 'bemerewe burundu' : 'fully admitted'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dormitory & Meal Status Widget */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-purple-600" />
                <span>{lang === 'rw' ? 'Imiterere y\'Amacumbi' : 'Dormitory Occupancy'}</span>
              </h3>
              <button
                onClick={() => onNavigateTab('dormitory')}
                className="text-xs text-purple-700 font-semibold hover:underline"
              >
                {lang === 'rw' ? 'Cunga amacumbi' : 'Manage'}
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              {lang === 'rw'
                ? 'Ibitanda byose hamwe mu macumbi 4 (Block A kugeza D) ni 440.'
                : 'Total beds across 4 residential blocks (Block A through D) is 440.'}
            </p>

            <div className="space-y-3">
              {dorms.map(d => {
                const pct = Math.round((d.occupiedBeds / d.totalBeds) * 100);
                return (
                  <div key={d.id} className="text-xs">
                    <div className="flex justify-between font-medium mb-1">
                      <span className="text-slate-700">{d.name}</span>
                      <span className="font-bold text-slate-900">{d.occupiedBeds} / {d.totalBeds} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-purple-600'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-purple-50/60 p-2.5 rounded-lg text-xs text-purple-900">
            <span className="font-bold block mb-0.5">
              {lang === 'rw' ? 'Itegurwa ry\'Ibiribwa (Kitchen Planning)' : 'Kitchen Food Provisioning'}
            </span>
            <p className="text-[11px] text-purple-800 leading-snug">
              {lang === 'rw'
                ? `Hateganyijwe ifunguro rya buri munsi ku banyeshuri ${occupiedBeds} bacumbika mu kigo.`
                : `Active food supplies allocation for ${occupiedBeds} confirmed boarding students.`}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Student Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === 'rw' ? 'Urutonde rw\'Abanyeshuri Biyandikishije Vuba' : 'Recent Student Intake Records'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' 
                ? 'Kanda kuri buri munyeshuri kugira ngo urebe dosiye ye cyangwa utange ibaruwa yo kwemererwa' 
                : 'Click any student to view file, verify credentials, or issue admission letter'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('verification')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {lang === 'rw' ? 'Dosiye zose' : 'All Files'}
            </button>
            <button
              onClick={() => onNavigateTab('registration')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              {lang === 'rw' ? '+ Iyandikishe Rishya' : '+ New Admission'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Code</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Amazina' : 'Full Name'}</th>
                <th className="py-3 px-4">Trade & Level</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Ubwoko' : 'Mode'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Ibyangombwa' : 'Documents'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Amafaranga' : 'Fees Status'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Uko ahagaze' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{lang === 'rw' ? 'Ibikorwa' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, 6).map((student) => {
                const verifiedDocs = student.documents.filter(d => d.status === 'verified').length;
                const totalDocs = student.documents.length;
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {student.studentCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                      <div className="text-[11px] text-slate-500">{student.gender} • {student.district}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{student.trade}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {student.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {student.boardingType === 'boarding' ? (
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          <BedDouble className="w-3 h-3" />
                          <span>{lang === 'rw' ? 'Ucumbika' : 'Boarding'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          <span>{lang === 'rw' ? 'Utaha' : 'Day Scholar'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className={`font-bold ${verifiedDocs === totalDocs ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {verifiedDocs}/{totalDocs}
                        </span>
                        <span className="text-slate-400">{lang === 'rw' ? 'byemejwe' : 'verified'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {student.fees.balance === 0 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{lang === 'rw' ? 'Byose byishyuwe' : 'Fully Paid'}</span>
                        </span>
                      ) : (
                        <div className="text-[11px]">
                          <span className="font-semibold text-rose-700">
                            {student.fees.balance.toLocaleString()} RWF
                          </span>
                          <span className="text-slate-400 block">{lang === 'rw' ? 'asigaye' : 'balance'}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {student.status === 'admitted' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lang === 'rw' ? 'Yemerewe' : 'Admitted'}
                        </span>
                      )}
                      {student.status === 'verified' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {lang === 'rw' ? 'Ibyangombwa Byuzuye' : 'Verified'}
                        </span>
                      )}
                      {student.status === 'incomplete_docs' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {lang === 'rw' ? 'Haburamo ibyangombwa' : 'Missing Docs'}
                        </span>
                      )}
                      {student.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {lang === 'rw' ? 'Bitegerejwe' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                          title={lang === 'rw' ? 'Reba Dosiye' : 'View File'}
                        >
                          {lang === 'rw' ? 'Reba' : 'View'}
                        </button>
                        <button
                          onClick={() => onOpenLetter(student)}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-[11px] transition-colors"
                          title={lang === 'rw' ? 'Ibaruwa yo Kwemererwa' : 'Admission Letter'}
                        >
                          {lang === 'rw' ? 'Ibaruwa' : 'Letter'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
