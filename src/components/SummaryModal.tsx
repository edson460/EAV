import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'rw' | 'en';
  onNavigateTab: (tabId: string) => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>EAV Gitwe TSS • Document Summary</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          {lang === 'rw' 
            ? 'Incamake y\'Inyandiko: Imbogamizi 8 & Igisubizo cya Sisitemu' 
            : 'Document Synthesis: 8 Key Challenges & Software Resolution'}
        </h3>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          {lang === 'rw'
            ? 'EAV Gitwe TSS ni ishuri rya Leta ricumbikira abanyeshuri, ryigisha amashami ane ya RTB: Software Development, Building Construction, Animal Health, na Agriculture kuva kuri L3 kugeza kuri L5. Izi ni imbogamizi 8 zagaragajwe n\'uburyo iyi porogaramu izikemura:'
            : 'EAV Gitwe TSS is a public boarding TVET school under RTB offering 4 core trades: Software Development, Building Construction, Animal Health, and Agriculture across L3-L5. Here is the operational synthesis:'}
        </p>

        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              1. Kwakira no kugenzura ibyangombwa (Document Verification)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Gushyira ibyangombwa kuri mudasobwa (Digital uploads) no kubigenzura vuba bitagombye gupfundika amadosiye mu ntoki.'
                : 'Digital document repository with automated checks for O-Level slips, IDs, and medical clearances.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              2. Umubare munini w\'abanyeshuri (High Intake Volume)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Kwiyandikisha ku rubuga cyangwa kwakirwa ako kanya bihangana n\'umurongo muremure ku biro by\'ishuri.'
                : 'Fast-track intake engine cutting queues from hours to seconds with pre-registration and instant validation.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              3. Kubika amakuru neza & Kwirinda kwandika kabiri (Data Integrity)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Student Code yihariye (urugero: EAV/2026/SOD/001) ibika amakuru yose hamwe, ihuza na Nimero y\'indangamuntu.'
                : 'Unique persistent Student Code preventing duplicate enrollment and lost ledger files.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              4. Gushyira umunyeshuri mu ishami rikwiye (Trade & Level Placement)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Kugenzura ubushobozi bw\'amashami (SOD, BCN, ANH, AGR) n\'ibyiciro L3, L4, L5 hashingiwe ku manota n\'ibisabwa.'
                : 'Prerequisite verification and capacity caps ensuring optimal placement across all 4 trades.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              5. Gucunga amacumbi n\'ibiribwa (Boarding & Dormitory Management)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Kumenya ibitanda bisigaye muri Block A, B, C, D n\'abanyeshuri bacumbika kugira ngo harebwe ibiribwa bihagije.'
                : 'Live bed allocation across 4 dorm blocks and automated meal headcounts for kitchen provisioning.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              6. Gukurikirana amafaranga n\'inyemezabwishyu (Fee Ledgers)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Kubika inyemezabwishyu, kugaragaza ibisigaye no gutanga inyemezabwishyu y\'ishuri (Printable Receipt).'
                : 'Accurate bank slip reconciliation, outstanding balance calculation, and print-ready receipts.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              7. Kumenyesha ababyeyi amakuru (Parent Alerts via SMS)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Kohereza ubutumwa bugufi bw\'uko umunyeshuri yemerewe, ibyangombwa bibura, n\'igihe cyo gutangira amasomo.'
                : 'Instant automated SMS dispatch to parents for admissions, missing document deadlines, and school calendar.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">
              8. Gutegura raporo z\'abanyeshuri bashya kuri RTB (Analytics & Reporting)
            </span>
            <p className="text-slate-600">
              {lang === 'rw'
                ? 'Raporo zikorwa ako kanya ku banyeshuri bose, amashami, igitsina n\'amabaruwa yo kwemererwa kwiga.'
                : '1-click RTB demographic reports, trade enrollments, and official admission letter generator.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {lang === 'rw' ? 'Funga' : 'Close'}
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateTab('registration');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>{lang === 'rw' ? 'Tangira Kwakira Abanyeshuri' : 'Start Student Admission'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
