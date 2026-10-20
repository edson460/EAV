import React from 'react';
import { 
  GraduationCap, 
  Search, 
  Globe, 
  FileText, 
  LayoutDashboard, 
  UserPlus, 
  CheckCircle2, 
  BedDouble, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  Building2,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'rw' | 'en';
  setLang: (lang: 'rw' | 'en') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  searchQuery,
  setSearchQuery,
  onOpenSummary,
}) => {
  const tabs = [
    {
      id: 'summary',
      nameRw: 'Incamake y\'Umushinga',
      nameEn: 'Project Summary',
      icon: FileText,
      highlight: true,
    },
    {
      id: 'dashboard',
      nameRw: 'Ikibaho Rusange',
      nameEn: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'registration',
      nameRw: 'Kwakira Ubusabe',
      nameEn: 'New Admission',
      icon: UserPlus,
    },
    {
      id: 'verification',
      nameRw: 'Kugenzura Dosiye',
      nameEn: 'Document Verification',
      icon: CheckCircle2,
    },
    {
      id: 'dormitory',
      nameRw: 'Amacumbi & Ibiribwa',
      nameEn: 'Boarding & Dorms',
      icon: BedDouble,
    },
    {
      id: 'finance',
      nameRw: 'Amafaranga y\'Ishuri',
      nameEn: 'Fees & Finance',
      icon: CreditCard,
    },
    {
      id: 'notifications',
      nameRw: 'Kumenyesha Ababyeyi',
      nameEn: 'Parent Alerts',
      icon: MessageSquare,
    },
    {
      id: 'reports',
      nameRw: 'Raporo & Ibyemezo',
      nameEn: 'RTB Reports & Letters',
      icon: BarChart3,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Rwanda National Tri-color top accent */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/2 bg-[#00A3E0]" title="Sky Blue (Happiness and Peace)" />
        <div className="h-full w-1/4 bg-[#FAD201]" title="Yellow (Economic Development)" />
        <div className="h-full w-1/4 bg-[#20603D]" title="Green (Prosperity and Hope)" />
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & School Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 ring-2 ring-emerald-100 flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  RTB Accredited • TVET L3-L5
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Ruhango, Southern Province
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                EAV GITWE TSS
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                  SARMS v2.4
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {lang === 'rw' 
                  ? 'Sisitemu yo Kwakira, Kwandika no Gucunga Abanyeshuri (Student Admission & Registration Management System)' 
                  : 'Student Admission, Document Verification, Dormitory & Fees Management System'}
              </p>
            </div>
          </div>

          {/* Quick Search & Lang & Summary CTA */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'rw' ? 'Shaka code cyangwa izina...' : 'Search student code or name...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setLang('rw')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  lang === 'rw' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kinyarwanda"
              >
                RW
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Quick summary trigger button */}
            <button
              onClick={onOpenSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
              title={lang === 'rw' ? 'Reba Incamake y\'Inyandiko & Imbogamizi 8' : 'View Document Summary & 8 Challenges'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'rw' ? 'Incamake y\'Imbogamizi 8' : '8 Challenges Summary'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-3 pb-0.5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>{lang === 'rw' ? tab.nameRw : tab.nameEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
