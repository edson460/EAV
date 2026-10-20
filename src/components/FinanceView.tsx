import React, { useState } from 'react';
import { StudentRecord } from '../types';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  DollarSign, 
  Building2, 
  ArrowUpRight,
  X
} from 'lucide-react';

interface FinanceViewProps {
  students: StudentRecord[];
  onUpdateStudent: (student: StudentRecord) => void;
  lang: 'rw' | 'en';
  onSendSms: (phone: string, name: string, code: string, message: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  students,
  onUpdateStudent,
  lang,
  onSendSms,
}) => {
  const [search, setSearch] = useState('');
  const [paymentModalStudent, setPaymentModalStudent] = useState<StudentRecord | null>(null);
  const [receiptModalStudent, setReceiptModalStudent] = useState<StudentRecord | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(45000);
  const [payChannel, setPayChannel] = useState<'momo' | 'bk' | 'equity' | 'cash'>('momo');
  const [slipRef, setSlipRef] = useState<string>('BK-2026-9081');

  // Overall financial calculations
  const totalExpected = students.reduce((acc, s) => acc + s.fees.totalExpected, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.fees.amountPaid, 0);
  const totalBalance = totalExpected - totalCollected;

  const fullyPaidCount = students.filter(s => s.fees.balance === 0).length;
  const owingCount = students.filter(s => s.fees.balance > 0).length;

  const filtered = students.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) ||
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalStudent) return;

    const newAmountPaid = paymentModalStudent.fees.amountPaid + Number(payAmount);
    const newBalance = Math.max(0, paymentModalStudent.fees.totalExpected - newAmountPaid);
    const generatedReceipt = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

    const updatedStudent: StudentRecord = {
      ...paymentModalStudent,
      fees: {
        ...paymentModalStudent.fees,
        amountPaid: newAmountPaid,
        balance: newBalance,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        receiptNumber: generatedReceipt,
      },
    };

    onUpdateStudent(updatedStudent);
    setPaymentModalStudent(null);
    setReceiptModalStudent(updatedStudent);

    // Send confirmation SMS to parent
    const msg = `Muraho! Twakiriye ${Number(payAmount).toLocaleString()} RWF kuri dosiye ya ${updatedStudent.firstName} ${updatedStudent.lastName} (Code: ${updatedStudent.studentCode}). Inyemezabwishyu: ${generatedReceipt}. Asigaye: ${newBalance.toLocaleString()} RWF. Murakoze - EAV Gitwe TSS.`;
    onSendSms(updatedStudent.parentPhone, updatedStudent.parentName, updatedStudent.studentCode, msg);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Challenge 6 context */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Imbogamizi ya 6: Gukurikirana Amafaranga n\'Inyemezabwishyu' : 'Challenge #6: School Fees & Receipt Ledger'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'rw' ? 'Gukurikirana Amafaranga y\'Ishuri' : 'Fees Ledger & Receipt Generator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'rw' 
              ? 'Gukurikirana amafaranga yishyuwe, ibisigaye, kwakira inyemezabwishyu za Banki cyangwa MoMo no gutanga Inyemezabwishyu y\'ishuri.' 
              : 'Reconcile MoMo and Bank deposits, track outstanding balances, and print official verified receipts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">MoMo Code</span>
            <span className="font-mono font-extrabold text-emerald-800">*182*8*1*04212#</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">BK Account</span>
            <span className="font-mono font-extrabold text-slate-800">00040-029381-44</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">{lang === 'rw' ? 'Amafaranga Yitezwe Yose' : 'Total Expected Revenue'}</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {totalExpected.toLocaleString()} <span className="text-xs font-semibold text-slate-500">RWF</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {students.length} {lang === 'rw' ? 'abanyeshuri biyandikishije' : 'enrolled students'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-600 font-semibold block">{lang === 'rw' ? 'Amafaranga Yamaze Kwishyurwa' : 'Total Collected to Date'}</span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {totalCollected.toLocaleString()} <span className="text-xs font-semibold text-slate-500">RWF</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {fullyPaidCount} {lang === 'rw' ? 'bariyushyuye yose (100%)' : 'fully cleared'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-rose-600 font-semibold block">{lang === 'rw' ? 'Amafaranga Asigaye Kwishyurwa' : 'Outstanding Balances'}</span>
          <div className="text-xl font-black text-rose-700 mt-1">
            {totalBalance.toLocaleString()} <span className="text-xs font-semibold text-slate-500">RWF</span>
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            {owingCount} {lang === 'rw' ? 'bafite ibisigaye' : 'students with balance'}
          </span>
        </div>
      </div>

      {/* Student Fees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'rw' ? 'Shaka umunyeshuri cyangwa code...' : 'Search financial records...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {lang === 'rw' ? 'Kanda "Ongeraho Kwishyura" kugira ngo wandike inyemezabwishyu nshya' : 'Click "Add Payment" to record a deposit slip'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Code</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Umunyeshuri' : 'Student'}</th>
                <th className="py-3 px-4">Trade & Mode</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Ayasabwa' : 'Total Due'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Ayishyuwe' : 'Paid'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Asigaye' : 'Balance'}</th>
                <th className="py-3 px-4">{lang === 'rw' ? 'Itariki ya Nyuma' : 'Last Payment'}</th>
                <th className="py-3 px-4 text-right">{lang === 'rw' ? 'Ibikorwa' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {student.studentCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{student.parentPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{student.trade}</span>
                    <span className="text-[11px] text-slate-500 ml-1">
                      ({student.boardingType === 'boarding' ? (lang === 'rw' ? 'Ucumbika' : 'Boarding') : (lang === 'rw' ? 'Utaha' : 'Day')})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {student.fees.totalExpected.toLocaleString()} RWF
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    {student.fees.amountPaid.toLocaleString()} RWF
                  </td>
                  <td className="py-3 px-4">
                    {student.fees.balance === 0 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'rw' ? '0 RWF (Yishyuwe yose)' : '0 RWF (Cleared)'}</span>
                      </span>
                    ) : (
                      <span className="font-bold text-rose-700">
                        {student.fees.balance.toLocaleString()} RWF
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {student.fees.lastPaymentDate || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {student.fees.amountPaid > 0 && (
                        <button
                          onClick={() => setReceiptModalStudent(student)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="w-3 h-3" />
                          <span>{lang === 'rw' ? 'Inyemezabwishyu' : 'Receipt'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setPaymentModalStudent(student);
                          setPayAmount(student.fees.balance > 0 ? student.fees.balance : 25000);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'rw' ? 'Kwishyura' : 'Pay'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form onSubmit={handleRecordPayment} className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 relative">
            <button
              type="button"
              onClick={() => setPaymentModalStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900 mb-1">
              {lang === 'rw' ? 'Kwandika Ubwishyu bw\'Ishuri' : 'Record School Fee Payment'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {paymentModalStudent.firstName} {paymentModalStudent.lastName} ({paymentModalStudent.studentCode})
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <div>
                  <span className="text-slate-500 block">{lang === 'rw' ? 'Ayasigaye' : 'Current Balance'}</span>
                  <span className="font-extrabold text-rose-600 text-sm">{paymentModalStudent.fees.balance.toLocaleString()} RWF</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'rw' ? 'Ayamaze kwishyurwa' : 'Paid to Date'}</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{paymentModalStudent.fees.amountPaid.toLocaleString()} RWF</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Amafaranga Yishyuwe (RWF) *' : 'Amount Deposited (RWF) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={paymentModalStudent.fees.balance || 200000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-sm text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Uburyo Yishyuwemo (Payment Channel) *' : 'Payment Channel *'}
                </label>
                <select
                  value={payChannel}
                  onChange={(e) => setPayChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="momo">MTN Mobile Money (*182*8*1*04212#)</option>
                  <option value="bk">Bank of Kigali (BK Slip)</option>
                  <option value="equity">Equity Bank</option>
                  <option value="cash">Ibiro by'Ishuri (School Cashier Desk)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'rw' ? 'Nimero ya Bordereau / MoMo Ref *' : 'Bank Slip Reference / MoMo Ref *'}
                </label>
                <input
                  type="text"
                  required
                  value={slipRef}
                  onChange={(e) => setSlipRef(e.target.value)}
                  placeholder="urugero: BK-2026-9081"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPaymentModalStudent(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {lang === 'rw' ? 'Kureka' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'rw' ? 'Emeza & Tanga Inyemezabwishyu' : 'Confirm & Generate Receipt'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Printable Receipt Modal */}
      {receiptModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setReceiptModalStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Printable Card */}
            <div className="border-2 border-slate-800 p-5 rounded-xl bg-slate-50/30">
              {/* Header with Rwanda crest and school info */}
              <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  REPUBLIC OF RWANDA • RWANDA TVET BOARD
                </span>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  EAV GITWE TVET SCHOOL (TSS)
                </h3>
                <span className="text-[11px] text-slate-500 block">
                  Gitwe, Ruhango District • Tel: +250 788 304 050 • Email: info@eavgitwe.ac.rw
                </span>
                <div className="mt-2 inline-block px-3 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-xs uppercase">
                  OFFICIAL SCHOOL FEES RECEIPT (INYEMEZABWISHYU)
                </div>
              </div>

              {/* Receipt details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Nimero y\'Inyemezabwishyu:' : 'Receipt No:'}</span>
                  <span className="font-mono font-bold text-slate-900">{receiptModalStudent.fees.receiptNumber || 'REC-2026-001'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Itariki yo Kwishyura:' : 'Date:'}</span>
                  <span className="font-mono text-slate-800">{receiptModalStudent.fees.lastPaymentDate || new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Student Code:' : 'Student Code:'}</span>
                  <span className="font-mono font-bold text-slate-900">{receiptModalStudent.studentCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Amazina y\'Umunyeshuri:' : 'Student Name:'}</span>
                  <span className="font-bold text-slate-900">{receiptModalStudent.firstName} {receiptModalStudent.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Ishami & Urwego:' : 'Trade & Level:'}</span>
                  <span className="font-semibold text-slate-900">{receiptModalStudent.trade} • {receiptModalStudent.level}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Ubwoko:' : 'Mode:'}</span>
                  <span className="font-semibold text-slate-900">
                    {receiptModalStudent.boardingType === 'boarding' ? 'Boarding (Ucumbika)' : 'Day Scholar (Utaha)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{lang === 'rw' ? 'Umubyeyi / Umwishyuzi:' : 'Depositor / Parent:'}</span>
                  <span className="font-semibold text-slate-900">{receiptModalStudent.parentName} ({receiptModalStudent.parentPhone})</span>
                </div>

                {/* Financial figures */}
                <div className="pt-2 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 mt-2 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{lang === 'rw' ? 'Amafaranga Yishyuwe Nonaha:' : 'Amount Paid:'}</span>
                    <span className="text-emerald-700 text-sm font-black">
                      {receiptModalStudent.fees.amountPaid.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>{lang === 'rw' ? 'Amafaranga Asigaye (Balance):' : 'Remaining Balance:'}</span>
                    <span className="font-bold text-rose-600">
                      {receiptModalStudent.fees.balance.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                {/* Stamp & Signature simulation */}
                <div className="pt-6 flex justify-between items-end text-[10px] text-slate-500">
                  <div className="text-center">
                    <div className="w-20 h-10 border border-dashed border-emerald-600 rounded-md flex items-center justify-center text-emerald-700 font-mono text-[9px] mb-1">
                      [EAV STAMP]
                    </div>
                    <span>School Bursar Signature</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono">Printed on: {new Date().toLocaleDateString()}</span>
                    <span className="text-[9px] text-slate-400">Valid with official school stamp</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 no-print">
              <button
                onClick={() => setReceiptModalStudent(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {lang === 'rw' ? 'Funga' : 'Close'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'rw' ? 'Sohora / Capa Inyemezabwishyu' : 'Print Official Receipt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
