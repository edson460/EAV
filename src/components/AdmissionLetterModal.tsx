import React from 'react';
import { StudentRecord } from '../types';
import { TRADES } from '../data/initialData';
import { X, Printer, GraduationCap, CheckCircle2 } from 'lucide-react';

interface AdmissionLetterModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  lang: 'rw' | 'en';
}

export const AdmissionLetterModal: React.FC<AdmissionLetterModalProps> = ({
  student,
  onClose,
  lang,
}) => {
  if (!student) return null;

  const tradeInfo = TRADES.find(t => t.code === student.trade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 no-print transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* The Printable Letter Container */}
        <div className="border-4 border-slate-900 p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                REPUBLIC OF RWANDA • MINISTRY OF EDUCATION
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                RWANDA TVET BOARD (RTB)
              </span>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                EAV GITWE TVET SCHOOL (TSS)
              </h2>
              <p className="text-xs text-slate-600">
                District: Ruhango • Southern Province, Rwanda • P.O. Box Gitwe
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Email: admission@eavgitwe.ac.rw • Hotline: +250 788 451 290
              </p>
            </div>

            <div className="w-20 h-20 rounded-2xl border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 bg-slate-50 flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-emerald-700" />
              <span className="text-[9px] font-bold text-slate-800 mt-1 uppercase">EAV GITWE</span>
            </div>
          </div>

          {/* Reference & Date */}
          <div className="flex justify-between items-center text-xs font-mono text-slate-700">
            <div>
              <span>Ref: <strong>EAV/ADM/2026-{student.studentCode.split('/').pop()}</strong></span>
            </div>
            <div>
              <span>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2 bg-slate-100 border border-slate-300 rounded-lg">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
              OFFICIAL ADMISSION LETTER / IBARUWA YO KWEMERERWA KWIGA
            </h3>
            <span className="text-xs font-semibold text-emerald-800 block">
              ACADEMIC YEAR: 2026/2027 • FIRST INTAKE (TERM 1)
            </span>
          </div>

          {/* Recipient Details */}
          <div className="text-xs space-y-1.5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p>
              Dear <strong>{student.firstName} {student.lastName}</strong>,
            </p>
            <p className="text-slate-700">
              Ubuyobozi bwa <strong>EAV Gitwe TSS</strong> bunejejwe no kukumenyesha ko wemerewe kwinjira muri iri shuri mu mwaka w'amashuri wa <strong>2026/2027</strong> muri gahunda y'amashuri y'imyuga n'ubumenyingiro igenzurwa na <strong>Rwanda TVET Board (RTB)</strong>.
            </p>
          </div>

          {/* Student Placement Table */}
          <div className="grid grid-cols-2 gap-3 text-xs border border-slate-200 rounded-xl p-3 bg-white">
            <div>
              <span className="text-slate-500 block text-[11px]">Student Code:</span>
              <strong className="font-mono text-emerald-800 text-sm">{student.studentCode}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">National ID / Index No:</span>
              <strong className="font-mono">{student.nationalIdOrIndex}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Allocated Trade (Ishami):</span>
              <strong className="text-slate-900">{student.trade} - {tradeInfo?.nameEn}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">TVET Level:</span>
              <strong className="text-slate-900">{student.level}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Accommodation Status:</span>
              <strong className="text-purple-800">
                {student.boardingType === 'boarding' 
                  ? `Boarding (Ucumbika - ${student.dormitoryBlock || 'Block A'})` 
                  : 'Day Scholar (Utaha)'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Reporting Date:</span>
              <strong className="text-slate-900">Monday, 03 November 2026 (08:00 AM)</strong>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              IBISABWA KUZANWA KU MUNSI WO GUTANGIRA (MANDATORY REQUIREMENTS):
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
              <li>Kuzana umwimerere w'indangamanota y'icyiciro rusange (Original O-Level Result Slip) n'Icyemezo cy'amavuko.</li>
              <li>Icyemezo cy'ubuzima butunganye (Medical Fitness Certificate) gitanzwe n'ivuriro ryemewe.</li>
              <li>{student.boardingType === 'boarding' ? 'Amashuka abiri (2) y\'ubururu, inzitiramubu, ikiringiti, isabune, n\'indobo.' : 'Kuzana ikaye n\'ibikoresho by\'imyitozo y\'ishami.'}</li>
              <li>Inyemezabwishyu ya banki cyangwa MoMo yemeza ubwishyu bw'amafaranga y'ishuri y'igihembwe cya mbere.</li>
            </ul>
          </div>

          {/* Signatures & Stamp */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
            <div>
              <div className="w-28 h-12 border-2 border-dashed border-emerald-700/80 rounded-lg flex items-center justify-center text-emerald-800 font-mono text-[10px] font-bold">
                [SEAL OF EAV GITWE]
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Official Institutional Seal</span>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic font-bold text-sm text-slate-900">Father Jean de Dieu K.</div>
              <div className="font-bold text-[11px] text-slate-800">School Principal / Head Teacher</div>
              <div className="text-[10px] text-slate-500">EAV Gitwe TSS Administration</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {lang === 'rw' ? 'Funga' : 'Close'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Sohora / Capa Ibaruwa' : 'Print Admission Letter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
