import React, { useState } from 'react';
import { DormitoryBlock, StudentRecord } from '../types';
import { 
  BedDouble, 
  Utensils, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Sparkles,
  Info
} from 'lucide-react';

interface DormitoryViewProps {
  dorms: DormitoryBlock[];
  students: StudentRecord[];
  onUpdateDorms: (dorms: DormitoryBlock[]) => void;
  onUpdateStudent: (student: StudentRecord) => void;
  lang: 'rw' | 'en';
}

export const DormitoryView: React.FC<DormitoryViewProps> = ({
  dorms,
  students,
  onUpdateDorms,
  onUpdateStudent,
  lang,
}) => {
  const [activeBlockId, setActiveBlockId] = useState<string>(dorms[0]?.id || 'block_a');
  const [assigningBed, setAssigningBed] = useState<{ blockId: string; roomNumber: string; bedId: string } | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const currentBlock = dorms.find(d => d.id === activeBlockId) || dorms[0];

  // Boarding students needing a bed
  const unassignedBoardingStudents = students.filter(s => 
    s.boardingType === 'boarding' && 
    (!s.bedNumber || s.bedNumber === '') &&
    s.gender === currentBlock.gender
  );

  const handleAssignBed = () => {
    if (!assigningBed || !selectedStudentId) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    // Update Dormitory state
    const updatedDorms = dorms.map(b => {
      if (b.id === assigningBed.blockId) {
        const updatedRooms = b.rooms.map(r => {
          if (r.roomNumber === assigningBed.roomNumber) {
            const updatedBeds = r.beds.map(bd => {
              if (bd.bedId === assigningBed.bedId) {
                return {
                  ...bd,
                  isOccupied: true,
                  studentName: `${student.firstName} ${student.lastName}`,
                  studentCode: student.studentCode,
                };
              }
              return bd;
            });
            return { ...r, beds: updatedBeds };
          }
          return r;
        });

        return {
          ...b,
          occupiedBeds: b.occupiedBeds + 1,
          rooms: updatedRooms,
        };
      }
      return b;
    });

    // Update Student record
    const updatedStudent: StudentRecord = {
      ...student,
      dormitoryBlock: currentBlock.name,
      roomNumber: assigningBed.roomNumber,
      bedNumber: `Bed ${assigningBed.bedId}`,
    };

    onUpdateDorms(updatedDorms);
    onUpdateStudent(updatedStudent);
    setAssigningBed(null);
    setSelectedStudentId('');
  };

  const handleVacateBed = (blockId: string, roomNumber: string, bedId: string, studentCode?: string) => {
    if (!confirm(lang === 'rw' ? 'Urashaka gukura uyu munyeshuri kuri iki gitanda?' : 'Vacate this bed?')) return;

    const updatedDorms = dorms.map(b => {
      if (b.id === blockId) {
        const updatedRooms = b.rooms.map(r => {
          if (r.roomNumber === roomNumber) {
            const updatedBeds = r.beds.map(bd => {
              if (bd.bedId === bedId) {
                return {
                  ...bd,
                  isOccupied: false,
                  studentName: undefined,
                  studentCode: undefined,
                };
              }
              return bd;
            });
            return { ...r, beds: updatedBeds };
          }
          return r;
        });

        return {
          ...b,
          occupiedBeds: Math.max(0, b.occupiedBeds - 1),
          rooms: updatedRooms,
        };
      }
      return b;
    });

    onUpdateDorms(updatedDorms);

    // If student code provided, clear in student record
    if (studentCode) {
      const student = students.find(s => s.studentCode === studentCode);
      if (student) {
        onUpdateStudent({
          ...student,
          dormitoryBlock: undefined,
          roomNumber: undefined,
          bedNumber: undefined,
        });
      }
    }
  };

  // Kitchen food calculations based on occupied beds
  const totalBoarders = dorms.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const weeklyRiceKg = totalBoarders * 2.5; // ~2.5 kg rice per student per week
  const weeklyBeansKg = totalBoarders * 2.0; // ~2 kg beans per student per week
  const weeklyMaizeFlourKg = totalBoarders * 3.0; // ~3 kg maize flour / kawunga
  const weeklyOilLitres = Math.round(totalBoarders * 0.4);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Challenge 5 context */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BedDouble className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Imbogamizi ya 5: Gucunga Amacumbi n\'Ibiribwa' : 'Challenge #5: Boarding & Kitchen Management'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'rw' ? 'Igenzura ry\'Amacumbi & Gahunda y\'Ibiribwa' : 'Dormitory Allocation & Kitchen Provisioning'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'rw'
              ? 'Gucunga ibitanda muri Block A, B, C, D n\'abanyeshuri bacumbika kugira ngo hategurwe ibiribwa bihagije mu kigo.'
              : 'Allocate residential beds across Blocks A to D and automate weekly food provisions for the boarding kitchen.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
          <Users className="w-4 h-4 text-purple-700" />
          <span>
            {lang === 'rw' ? `Abacumbika Bose: ${totalBoarders} / 440` : `Total Boarders: ${totalBoarders} / 440 Beds`}
          </span>
        </div>
      </div>

      {/* Block Selector Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dorms.map(block => {
          const isSelected = block.id === currentBlock.id;
          const pct = Math.round((block.occupiedBeds / block.totalBeds) * 100);
          return (
            <button
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{block.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {block.gender === 'Male' ? (lang === 'rw' ? 'Abahungu' : 'Boys') : (lang === 'rw' ? 'Abakobwa' : 'Girls')}
                </span>
              </div>

              <div className="text-lg font-black text-slate-900">
                {block.occupiedBeds} <span className="text-xs font-normal text-slate-500">/ {block.totalBeds}</span>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-purple-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-500 mt-1 block">
                {block.totalBeds - block.occupiedBeds} {lang === 'rw' ? 'ibitanda bisigaye' : 'beds available'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Dormitory Block Detail */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>{currentBlock.name}</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {currentBlock.gender === 'Male' ? (lang === 'rw' ? 'Icumbi ry\'Abahungu' : 'Boys Dormitory') : (lang === 'rw' ? 'Icumbi ry\'Abakobwa' : 'Girls Dormitory')}
              </span>
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
              <span>Warden: <strong className="text-slate-700">{currentBlock.wardenName}</strong></span>
              <span className="flex items-center gap-1 font-mono text-slate-600">
                <Phone className="w-3 h-3 text-slate-400" /> {currentBlock.wardenPhone}
              </span>
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600">
            {lang === 'rw' ? 'Ibyumba bigenzurwa:' : 'Rooms monitored:'} <span className="text-purple-700 font-bold">{currentBlock.rooms.length}</span>
          </div>
        </div>

        {/* Room & Bed Allocation Grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {lang === 'rw' ? 'Imiterere y\'Ibyumba n\'Ibitanda (Bed Allocation Grid)' : 'Room Layout & Bed Allocations'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBlock.rooms.map(room => (
              <div key={room.roomNumber} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-xs text-slate-900">{room.roomNumber}</span>
                  <span className="text-[11px] text-slate-500">
                    {room.beds.filter(b => b.isOccupied).length} / {room.beds.length} {lang === 'rw' ? 'bituwe' : 'occupied'}
                  </span>
                </div>

                <div className="space-y-2">
                  {room.beds.map(bed => (
                    <div
                      key={bed.bedId}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        bed.isOccupied
                          ? 'bg-white border-purple-200 shadow-2xs'
                          : 'bg-emerald-50/50 border-dashed border-emerald-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <BedDouble className={`w-3.5 h-3.5 ${bed.isOccupied ? 'text-purple-600' : 'text-emerald-600'}`} />
                          <span className="text-slate-800">Bed {bed.bedId}</span>
                        </div>
                        {bed.isOccupied ? (
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            <span className="font-semibold text-slate-900 block">{bed.studentName}</span>
                            <span className="font-mono text-slate-400 text-[10px]">{bed.studentCode}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {lang === 'rw' ? 'Hari umwanya (Available)' : 'Vacant Bed'}
                          </span>
                        )}
                      </div>

                      <div>
                        {bed.isOccupied ? (
                          <button
                            onClick={() => handleVacateBed(currentBlock.id, room.roomNumber, bed.bedId, bed.studentCode)}
                            className="px-2 py-1 text-[10px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            {lang === 'rw' ? 'Hagarika' : 'Vacate'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setAssigningBed({ blockId: currentBlock.id, roomNumber: room.roomNumber, bedId: bed.bedId })}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer shadow-2xs"
                          >
                            {lang === 'rw' ? '+ Igitanda' : 'Assign'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kitchen & Food Supplies Estimator (Crucial for Gitwe Boarding School!) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <Utensils className="w-5 h-5 text-amber-700" />
            <span>
              {lang === 'rw' ? 'Gahunda y\'Ibiribwa by\'Abanyeshuri Bacumbika (Kitchen Budgeting)' : 'Kitchen Food Supplies Estimator'}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
            {totalBoarders} {lang === 'rw' ? 'Abanyeshuri bacumbitse' : 'Current Active Boarders'}
          </span>
        </div>

        <p className="text-xs text-amber-900/80 mb-4 leading-relaxed">
          {lang === 'rw'
            ? 'Iri koranabuhanga rihita ribara ibiribwa bikenewe mu cyumweru hagendewe ku mubare w\'abanyeshuri bemerewe gucumbika muri EAV Gitwe TSS. Ibi birinda ibura ry\'ibiribwa cyangwa gupfusha ubusa ingengo y\'imari.'
            : 'Automated weekly food inventory calculator calibrated for EAV Gitwe boarding students to prevent shortages and forecast procurement.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-xs text-slate-500 block">{lang === 'rw' ? 'Umuceri (Rice / Week)' : 'Rice / Week'}</span>
            <span className="text-lg font-black text-slate-900">{weeklyRiceKg.toLocaleString()} Kg</span>
            <span className="text-[10px] text-slate-400 block">2.5 kg / student</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-xs text-slate-500 block">{lang === 'rw' ? 'Ibiharage (Beans / Week)' : 'Beans / Week'}</span>
            <span className="text-lg font-black text-slate-900">{weeklyBeansKg.toLocaleString()} Kg</span>
            <span className="text-[10px] text-slate-400 block">2.0 kg / student</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-xs text-slate-500 block">{lang === 'rw' ? 'Kawunga (Maize Flour / Wk)' : 'Maize Flour / Wk'}</span>
            <span className="text-lg font-black text-slate-900">{weeklyMaizeFlourKg.toLocaleString()} Kg</span>
            <span className="text-[10px] text-slate-400 block">3.0 kg / student</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-xs text-slate-500 block">{lang === 'rw' ? 'Amavuta (Cooking Oil / Wk)' : 'Cooking Oil / Wk'}</span>
            <span className="text-lg font-black text-slate-900">{weeklyOilLitres} Litres</span>
            <span className="text-[10px] text-slate-400 block">EAV Gitwe kitchen</span>
          </div>
        </div>
      </div>

      {/* Bed Assignment Modal */}
      {assigningBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              {lang === 'rw' ? `Guhitamo Umunyeshuri: ${assigningBed.roomNumber} - Bed ${assigningBed.bedId}` : `Assign Student to Bed ${assigningBed.bedId}`}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              {lang === 'rw'
                ? `Hitamo umunyeshuri w'umucumbika w'igitsina cy'${currentBlock.gender === 'Male' ? 'abagabo' : 'abagore'} utarashyirwa ku gitanda:`
                : `Select an unassigned ${currentBlock.gender.toLowerCase()} boarding student:`}
            </p>

            {unassignedBoardingStudents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center mb-4">
                {lang === 'rw' 
                  ? 'Nta munyeshuri w\'umucumbika muri iki gitsina ukeneye igitanda nonaha.' 
                  : 'All boarding students of this gender already have assigned beds.'}
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {unassignedBoardingStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedStudentId === student.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {student.studentCode} • {student.trade} ({student.level})
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAssigningBed(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {lang === 'rw' ? 'Kureka' : 'Cancel'}
              </button>
              <button
                disabled={!selectedStudentId}
                onClick={handleAssignBed}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'rw' ? 'Emeza Igitanda' : 'Confirm Bed Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
