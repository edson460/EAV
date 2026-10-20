import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  Users, 
  Database, 
  BedDouble, 
  CreditCard, 
  Bell, 
  BarChart4,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ProjectSummaryViewProps {
  lang: 'rw' | 'en';
  onNavigateTab: (tabId: string) => void;
}

export const ProjectSummaryView: React.FC<ProjectSummaryViewProps> = ({
  lang,
  onNavigateTab,
}) => {
  const challenges = [
    {
      num: 1,
      titleRw: 'Kwakira no kugenzura ibyangombwa by\'abanyeshuri',
      titleEn: 'Receiving & Verifying Student Documents',
      problemRw: 'Abanyeshuri bazana impapuro zitandukanye z\'intoki, amakuru rimwe na rimwe atuzuye cyangwa arimo amakosa; kugenzura intoki bitwara igihe kinini.',
      problemEn: 'Students arrive with scattered physical papers; data is often incomplete or filled with errors; manual verification takes days.',
      solutionRw: 'Sisitemu itanga aho kwinjiza ibyangombwa (digital checklist & uploads), ikanagaragaza ako kanya ibyuzuye n\'ibibura (verified / missing).',
      solutionEn: 'Automated digital document upload checklist with real-time status flags (verified, missing, under review).',
      targetTab: 'verification',
      tabNameRw: 'Kugenzura Dosiye',
      tabNameEn: 'Verification Module',
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      num: 2,
      titleRw: 'Umubare munini w\'abanyeshuri baza kwiyandikisha',
      titleEn: 'High Volume of Applicants During Intake Rush',
      problemRw: 'Iyo abanyeshuri baje icyarimwe habaho imirongo miremire, gutinda bikabije, no gusubiramo imirimo imwe n\'ubuyobozi.',
      problemEn: 'Long queues, intake bottlenecks, administrative burnout, and repeated manual data entry.',
      solutionRw: 'Kwandika abanyeshuri vuba, kwakira ubusabe bwa mbere, no kubika amakuru ako kanya bituma nta murongo ubaho ku biro by\'ishuri.',
      solutionEn: 'Rapid digital intake with automated data parsing, instant validation, and zero line congestion.',
      targetTab: 'registration',
      tabNameRw: 'Kwakira Ubusabe',
      tabNameEn: 'New Admission',
      icon: Users,
      color: 'blue',
    },
    {
      num: 3,
      titleRw: 'Kubika amakuru neza no kwirinda abiyandikisha kabiri',
      titleEn: 'Centralized Record Keeping & Preventing Duplicates',
      problemRw: 'Amakuru abitswe mu bitabo cyangwa mu makayi aratakara, biragorana gushakamo umunyeshuri, kandi hashobora kwandikwa umuntu kabiri.',
      problemEn: 'Paper ledgers get misplaced, searching takes hours, and students risk duplicate registration or conflicting IDs.',
      solutionRw: 'Buri munyeshuri ahabwa Student Code yihariye (urugero: EAV/2026/SOD/001) ibika amakuru yose hamwe, hashingiwe kuri Index/ID.',
      solutionEn: 'Unique permanent Student Code (e.g. EAV/2026/SOD/001) linked to National ID/Index number preventing duplicate entries.',
      targetTab: 'dashboard',
      tabNameRw: 'Ikibaho Rusange',
      tabNameEn: 'Student Database',
      icon: Database,
      color: 'indigo',
    },
    {
      num: 4,
      titleRw: 'Gushyira umunyeshuri mu ishami n\'urwego bikwiye',
      titleEn: 'Matching Students to Eligible Trades & Levels',
      problemRw: 'Kugenzura ibisabwa kugira ngo umunyeshuri ashyirwe mu ishami rihuye n\'ubumenyi bwe (SOD, BCN, ANH, AGR) kuva kuri L3 kugeza kuri L5.',
      problemEn: 'Matching prerequisite grades and qualifications with capacity limits across Software Dev, Construction, Vet, and Agriculture.',
      solutionRw: 'Sisitemu igenzura amashami 4 yemewe na RTB n\'umubare w\'imyanya isigaye kuri L3, L4, na L5 igahita ibika aho umunyeshuri agiye.',
      solutionEn: 'Automated eligibility verification against RTB trade quotas and Level 3, 4, 5 prerequisite rules.',
      targetTab: 'registration',
      tabNameRw: 'Amashami ya RTB',
      tabNameEn: 'Trade Allocation',
      icon: Layers,
      color: 'amber',
    },
    {
      num: 5,
      titleRw: 'Gucunga amacumbi n\'ibiribwa by\'abanyeshuri bacumbika',
      titleEn: 'Boarding, Dormitories & Food Supplies Management',
      problemRw: 'EAV Gitwe icumbikira abanyeshuri benshi; biba bigoye kumenya imyanya y\'ibitanda isigaye, amacumbi y\'abahungu n\'abakobwa n\'ibiribwa bikenerwa.',
      problemEn: 'Tracking dormitory block occupancy, bed allocations for boys & girls, and meal planning supplies without accurate counts.',
      solutionRw: 'Gucunga Block A, B, C, D n\'ibyumba, guhita uha umunyeshuri igitanda (Bed number) no kubara neza abacumbika (Boarding vs Day scholars).',
      solutionEn: 'Interactive Dormitory Grid (Blocks A to D), individual bed allocation, and automated boarding headcount for kitchen planning.',
      targetTab: 'dormitory',
      tabNameRw: 'Amacumbi & Ibiribwa',
      tabNameEn: 'Dormitory Module',
      icon: BedDouble,
      color: 'purple',
    },
    {
      num: 6,
      titleRw: 'Gukurikirana amafaranga y\'ishuri n\'inyemezabwishyu',
      titleEn: 'School Fees & Bank Receipt Verification',
      problemRw: 'Gukurikirana ibyo umunyeshuri yishyuye, ibisigaye, inyemezabwishyu za Banki cyangwa MoMo bituma imibare icanga iyo itabitswe neza.',
      problemEn: 'Loose bank bordereaux, unrecorded cash/MoMo, untracked balances, and dispute resolution delays with parents.',
      solutionRw: 'Kubika inyemezabwishyu, kugaragaza amafaranga yishyuwe n\'asigaye (Balance: 0 RWF), no gutanga Inyemezabwishyu (Official Receipt) ihita icapwa.',
      solutionEn: 'Real-time ledger with automated payment receipts, outstanding balance reminders, and instant printable fee vouchers.',
      targetTab: 'finance',
      tabNameRw: 'Amafaranga y\'Ishuri',
      tabNameEn: 'Fees Module',
      icon: CreditCard,
      color: 'emerald',
    },
    {
      num: 7,
      titleRw: 'Kumenyesha ababyeyi amakuru y\'abana babo (SMS)',
      titleEn: 'Parent Communication & Instant SMS Notifications',
      problemRw: 'Kugeza ku babyeyi amakuru y\'uko umwana yemerewe kwiga, ibyangombwa bibura, igihe cyo gutangira amasomo n\'ibikoresho asabwa kuzana.',
      problemEn: 'Lack of direct communication channels to notify parents of admission status, missing documents deadlines, and reporting requirements.',
      solutionRw: 'Sisitemu yohereza ubutumwa bwa SMS ku banyeshuri n\'ababyeyi (Kwemererwa kwiga, ibyemezo bibura, igihe cyo gufungura, amafaranga asigaye).',
      solutionEn: 'Instant parent notification center triggering SMS messages for admission offers, missing doc deadlines, and reopening dates.',
      targetTab: 'notifications',
      tabNameRw: 'Kumenyesha Ababyeyi',
      tabNameEn: 'Parent Alerts',
      icon: Bell,
      color: 'cyan',
    },
    {
      num: 8,
      titleRw: 'Gutegura raporo z\'abanyeshuri bashya kuri RTB',
      titleEn: 'Generating Real-Time Reports for RTB & Leadership',
      problemRw: 'Ubuyobozi bushobora gukenera igihe kinini kugira ngo bumenye umubare w\'abasabye, abemewe, abakobwa/abahungu, n\'umubare muri buri shami.',
      problemEn: 'Leadership spends weeks collating spreadsheets for Rwanda TVET Board (RTB) intake quotas and gender statistics.',
      solutionRw: 'Raporo zikorwa ako kanya (Instant RTB Statistical Reports), kugaragaza imibare y\'amashami, igitsina, n\'amabaruwa yo kwemererwa kwiga (Admission Letters).',
      solutionEn: '1-click RTB compliance reports with trade breakdown, gender parity metrics, and official printable Admission Letters.',
      targetTab: 'reports',
      tabNameRw: 'Raporo & Ibyemezo',
      tabNameEn: 'Reports & Export',
      icon: BarChart4,
      color: 'teal',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Executive Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'rw' ? 'Incamake y\'Inyandiko & Igisubizo cya Sisitemu' : 'Executive Project Document Summary & Software Solution'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            {lang === 'rw' 
              ? 'EAV Gitwe TSS: Ubushakashatsi ku Miterere, Imbogamizi 8 & Umushinga w\'Ikoranabuhanga' 
              : 'EAV Gitwe TSS: Intake Assessment, 8 Operational Bottlenecks & Software Architecture'}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl mb-6">
            {lang === 'rw'
              ? 'Inyandiko ya Rwanda TVET Board igaragaza ko EAV Gitwe TSS ari ishuri rya Leta ricumbikira abanyeshuri, ryigisha amashami ane y\'ingenzi: Software Development, Building Construction, Animal Health, na General Agriculture kuva ku rwego rwa Level 3 kugeza kuri Level 5. Iri koranabuhanga ryubatswe kugira ngo rikemure imbogamizi 8 zose zagaragaye mu kwakira, kugenzura, gucunga amacumbi, no gukurikirana abanyeshuri.'
              : 'Official Rwanda TVET Board (RTB) records indicate EAV Gitwe TSS is a public boarding technical secondary school offering four accredited trades: Software Development, Building Construction, Animal Health, and General Agriculture from Level 3 to Level 5. This integrated system automates all 8 documented administrative challenges.'}
          </p>

          {/* Quick Stats Banner inside hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60">
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block">{lang === 'rw' ? 'Ishuri' : 'Institution'}</span>
              <span className="text-base font-bold text-white">EAV Gitwe TSS</span>
              <span className="text-[11px] text-emerald-400 block">Ruhango, Rwanda</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block">{lang === 'rw' ? 'Amashami 4' : '4 TVET Trades'}</span>
              <span className="text-base font-bold text-amber-300">SOD • BCN • ANH • AGR</span>
              <span className="text-[11px] text-slate-300 block">Levels: L3, L4, L5</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block">{lang === 'rw' ? 'Imbogamizi Zasesenguwe' : 'Analyzed Challenges'}</span>
              <span className="text-base font-bold text-rose-300">8 Key Bottlenecks</span>
              <span className="text-[11px] text-emerald-400 block">100% Solved in App</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block">{lang === 'rw' ? 'Ubwoko bw\'Ishuri' : 'School Model'}</span>
              <span className="text-base font-bold text-teal-300">{lang === 'rw' ? 'Gucumbikira' : 'Boarding School'}</span>
              <span className="text-[11px] text-slate-300 block">Dorms & Day Scholars</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Core Trades of EAV Gitwe */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              {lang === 'rw' ? 'Amashami 4 Yigishwa muri EAV Gitwe (RTB L3 - L5)' : 'The 4 Accredited Trades at EAV Gitwe TSS (RTB L3 - L5)'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' 
                ? 'Buri shami rifite uburyo bwo kugenzura umubare w\'abanyeshuri bashobora kwakirwa' 
                : 'Each trade has configured quota capacities and automated prerequisite verification'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                SOD
              </span>
              <span className="text-xs text-slate-400">L3 • L4 • L5</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Software Development</h4>
            <p className="text-xs text-slate-600 mb-3">
              {lang === 'rw' 
                ? 'Gukora porogaramu, imbuga za interineti, no gukemura ibibazo hifashishijwe mudasobwa.' 
                : 'Web, mobile and software engineering, database management, and problem solving.'}
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
              <span>{lang === 'rw' ? 'Umuhuzabikorwa' : 'H.O.D'}:</span>
              <span className="font-medium text-slate-700">Eng. Eric H.</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                BCN
              </span>
              <span className="text-xs text-slate-400">L3 • L4 • L5</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Building Construction</h4>
            <p className="text-xs text-slate-600 mb-3">
              {lang === 'rw' 
                ? 'Ubwubatsi bwa kijyambere, gupima ubutaka, ibishushanyo by\'inzu n\'ibikoresho by\'ubwubatsi.' 
                : 'Civil construction, masonry, architectural drafting, surveying and structural engineering.'}
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
              <span>{lang === 'rw' ? 'Umuhuzabikorwa' : 'H.O.D'}:</span>
              <span className="font-medium text-slate-700">Eng. Jean B. N.</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                ANH
              </span>
              <span className="text-xs text-slate-400">L3 • L4 • L5</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Animal Health & Vet</h4>
            <p className="text-xs text-slate-600 mb-3">
              {lang === 'rw' 
                ? 'Ubuvuzi bw\'amatungo, gukingira indwara, korora kijyambere n\'isuku y\'ibiribwa.' 
                : 'Veterinary nursing, animal husbandry, disease epidemiology, and modern breeding.'}
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
              <span>{lang === 'rw' ? 'Umuhuzabikorwa' : 'H.O.D'}:</span>
              <span className="font-medium text-slate-700">Dr. Clarisse M.</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-lime-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-lime-100 text-lime-800">
                AGR
              </span>
              <span className="text-xs text-slate-400">L3 • L4 • L5</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">General Agriculture</h4>
            <p className="text-xs text-slate-600 mb-3">
              {lang === 'rw' 
                ? 'Ubuhinzi bwa kijyambere, kuhira imyaka, kubungabunga ubutaka no gucunga umusaruro.' 
                : 'Agronomy, horticulture, crop production, soil fertility and modern irrigation.'}
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
              <span>{lang === 'rw' ? 'Umuhuzabikorwa' : 'H.O.D'}:</span>
              <span className="font-medium text-slate-700">Agronome Alexis M.</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 8 Challenges & Interactive Solutions Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {lang === 'rw' ? 'Imbogamizi 8 z\'Ubuyobozi & Uburyo Sisitemu Izikemura' : 'The 8 Administrative Challenges & How SARMS Solves Them'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' 
                ? 'Kanda kuri buri gisubizo uhite ujya mu gice cya sisitemu kibikora neza' 
                : 'Click any module link to immediately test the corresponding feature live in the application'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c) => {
            const Icon = c.icon;
            return (
              <div 
                key={c.num}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        #{c.num}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {lang === 'rw' ? c.titleRw : c.titleEn}
                      </h4>
                    </div>
                  </div>

                  {/* Problem section */}
                  <div className="mb-3 bg-rose-50/70 border border-rose-100 rounded-lg p-2.5 text-xs text-rose-900">
                    <div className="flex items-center gap-1 font-semibold text-rose-800 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>{lang === 'rw' ? 'Imbogamizi (The Challenge):' : 'The Challenge:'}</span>
                    </div>
                    <p className="text-rose-800/90 leading-relaxed">
                      {lang === 'rw' ? c.problemRw : c.problemEn}
                    </p>
                  </div>

                  {/* Solution section */}
                  <div className="mb-4 bg-emerald-50/70 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-900">
                    <div className="flex items-center gap-1 font-semibold text-emerald-800 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{lang === 'rw' ? 'Igisubizo muri Sisitemu (Solution):' : 'System Solution:'}</span>
                    </div>
                    <p className="text-emerald-800/90 leading-relaxed">
                      {lang === 'rw' ? c.solutionRw : c.solutionEn}
                    </p>
                  </div>
                </div>

                {/* Direct Action Link */}
                <button
                  onClick={() => onNavigateTab(c.targetTab)}
                  className="w-full mt-2 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-emerald-700 text-white flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                    <span>{lang === 'rw' ? `Fungura: ${c.tabNameRw}` : `Open: ${c.tabNameEn}`}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Academic Presentation Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">
        <h4 className="font-bold text-sm mb-1.5 flex items-center gap-2 text-amber-950">
          <Sparkles className="w-4 h-4 text-amber-600" />
          {lang === 'rw' ? 'Inama ku Munyeshuri wiga Software Development' : 'Recommendation for Software Development Project Defense'}
        </h4>
        <p className="text-xs leading-relaxed text-amber-800">
          {lang === 'rw'
            ? 'Kubera ko uri kwiga Software Development, uyu mushinga ukubiyemo imikorere yose ikenerwa mu kigo cya TVET (Full-stack architecture): Kwakira amakuru (Input handling & validation), Kugenzura dosiye (Workflow authorization), Gucunga amacumbi (Resource & capacity allocation), Gukurikirana amafaranga (Financial reconciliation), Kumenyesha ababyeyi (SMS dispatch), na Raporo zemewe na RTB. Ibi birakwereka ubumenyi buhambaye bwo gukora software ikemura ibibazo bifatika mu Rwanda.'
            : 'As a Software Development student, this project demonstrates end-to-end full-stack systems engineering: input validation, document verification workflows, capacity allocation, automated fee ledgers, parent messaging pipelines, and RTB compliance reporting. It serves as an exemplary graduation capstone.'}
        </p>
      </div>
    </div>
  );
};
