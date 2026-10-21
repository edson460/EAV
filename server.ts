import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { INITIAL_STUDENTS, INITIAL_DORMS, INITIAL_NOTIFICATIONS, TRADES, FEE_STRUCTURE } from './src/data/initialData.ts';
import { StudentRecord, DormitoryBlock, SmsNotification } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// In-Memory Database store (seeded from initial data)
let studentsDb: StudentRecord[] = [...INITIAL_STUDENTS];
let dormsDb: DormitoryBlock[] = [...INITIAL_DORMS];
let notificationsDb: SmsNotification[] = [...INITIAL_NOTIFICATIONS];

// Direct download endpoint for database_schema.sql
app.get('/database_schema.sql', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'database_schema.sql');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('SQL file not found');
  }
});

// 1. Health check & Server Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    school: 'EAV Gitwe TVET School (TSS)',
    accreditation: 'Rwanda TVET Board (RTB)',
    totalStudents: studentsDb.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Trades list (SOD, BCN, ANH, AGR)
app.get('/api/trades', (req: Request, res: Response) => {
  res.json({ success: true, data: TRADES });
});

// 3. Students API
// GET /api/students (with optional filter by trade or level)
app.get('/api/students', (req: Request, res: Response) => {
  const { trade, level, status, search } = req.query;
  let result = [...studentsDb];

  if (trade && trade !== 'all') {
    result = result.filter(s => s.trade === trade);
  }
  if (level && level !== 'all') {
    result = result.filter(s => s.level === level);
  }
  if (status && status !== 'all') {
    result = result.filter(s => s.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(s => 
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.studentCode.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/students/:id
app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = studentsDb.find(s => s.id === req.params.id || s.studentCode === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Umunyeshuri ntabonetse (Student not found)' });
  }
  res.json({ success: true, data: student });
});

// POST /api/students (Register New Student)
app.post('/api/students', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.firstName || !body.lastName || !body.trade) {
    return res.status(400).json({ success: false, message: 'Amazina n\'ishami birakenewe (Missing required fields)' });
  }

  // Condition 1: National ID must be exactly 16 digits
  if (body.nationalIdOrIndex) {
    const cleanNid = String(body.nationalIdOrIndex).trim().replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNid)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nimero y\'indangamuntu igomba kuba igizwe n\'imibare 16 neza (National ID must be exactly 16 digits)' 
      });
    }
  }

  // Condition 2: Phone number must be exactly 10 digits starting with 07
  if (body.parentPhone) {
    const cleanPhone = String(body.parentPhone).trim().replace(/\s/g, '');
    if (!/^07\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nimero ya telefoni igomba kuba igizwe n\'imibare 10 itangirwa na 07 (Phone number must be 10 digits starting with 07)' 
      });
    }
  }

  // Generate unique student code if not provided
  const generatedCode = body.studentCode || `EAV/2026/${body.trade}/${Math.floor(100 + Math.random() * 900)}`;

  const newStudent: StudentRecord = {
    id: body.id || `std_${Date.now()}`,
    studentCode: generatedCode,
    firstName: body.firstName,
    lastName: body.lastName,
    gender: body.gender || 'Male',
    dob: body.dob || '2008-01-01',
    nationalIdOrIndex: body.nationalIdOrIndex || `NID-${Date.now()}`,
    previousSchool: body.previousSchool || 'GS Gitwe',
    trade: body.trade,
    level: body.level || 'L3',
    boardingType: body.boardingType || 'boarding',
    dormitoryBlock: body.dormitoryBlock,
    roomNumber: body.roomNumber,
    bedNumber: body.bedNumber,
    parentName: body.parentName || 'Umubyeyi',
    parentPhone: body.parentPhone || '0780000000',
    parentEmail: body.parentEmail,
    district: body.district || 'Ruhango',
    sector: body.sector || 'Bweramana',
    status: body.status || 'admitted',
    applicationDate: body.applicationDate || new Date().toISOString().split('T')[0],
    documents: body.documents || [],
    fees: body.fees || {
      totalExpected: body.boardingType === 'boarding' ? FEE_STRUCTURE.boarding.total : FEE_STRUCTURE.dayScholar.total,
      amountPaid: 0,
      balance: body.boardingType === 'boarding' ? FEE_STRUCTURE.boarding.total : FEE_STRUCTURE.dayScholar.total,
    },
    notes: body.notes,
  };

  studentsDb.unshift(newStudent);
  res.status(201).json({ success: true, message: 'Umunyeshuri yanditswe neza', data: newStudent });
});

// PUT /api/students/:id (Update student info, verification, bed assignment)
app.put('/api/students/:id', (req: Request, res: Response) => {
  const index = studentsDb.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Umunyeshuri ntabonetse' });
  }

  studentsDb[index] = { ...studentsDb[index], ...req.body };
  res.json({ success: true, message: 'Dosiye yavuguruwe (Student updated)', data: studentsDb[index] });
});

// DELETE /api/students/:id (Delete student record)
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const initialLen = studentsDb.length;
  studentsDb = studentsDb.filter(s => s.id !== req.params.id && s.studentCode !== req.params.id);
  
  if (studentsDb.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Umunyeshuri ntabonetse' });
  }

  res.json({ success: true, message: 'Umunyeshuri yasibwe muri sisitemu (Student deleted)' });
});

// POST /api/students/:id/payments (Record fee payment)
app.post('/api/students/:id/payments', (req: Request, res: Response) => {
  const student = studentsDb.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Umunyeshuri ntabonetse' });
  }

  const { amount, channel, referenceSlip } = req.body;
  const payAmount = Number(amount) || 0;
  const newAmountPaid = student.fees.amountPaid + payAmount;
  const newBalance = Math.max(0, student.fees.totalExpected - newAmountPaid);
  const receiptNo = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

  student.fees = {
    ...student.fees,
    amountPaid: newAmountPaid,
    balance: newBalance,
    lastPaymentDate: new Date().toISOString().split('T')[0],
    receiptNumber: receiptNo,
  };

  res.json({
    success: true,
    message: 'Ubwishyu bwemejwe',
    receiptNumber: receiptNo,
    balanceRemaining: newBalance,
    data: student,
  });
});

// 4. Dormitories API (Blocks A, B, C, D)
app.get('/api/dorms', (req: Request, res: Response) => {
  res.json({ success: true, data: dormsDb });
});

app.put('/api/dorms', (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    dormsDb = req.body;
  }
  res.json({ success: true, data: dormsDb });
});

// 5. SMS Notifications API
app.get('/api/sms', (req: Request, res: Response) => {
  res.json({ success: true, count: notificationsDb.length, data: notificationsDb });
});

app.post('/api/sms/send', (req: Request, res: Response) => {
  const { recipientPhone, recipientName, studentCode, message, type } = req.body;

  const newSms: SmsNotification = {
    id: `sms_${Date.now()}`,
    recipientPhone,
    recipientName,
    studentCode,
    studentName: recipientName,
    type: type || 'admission_offer',
    message,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'delivered',
  };

  notificationsDb.unshift(newSms);
  res.status(201).json({ success: true, message: 'SMS yoherejwe neza kuri telefoni', data: newSms });
});

// 6. RTB Intake Analytics Report
app.get('/api/reports/rtb-matrix', (req: Request, res: Response) => {
  const report = TRADES.map(t => {
    const list = studentsDb.filter(s => s.trade === t.code);
    return {
      code: t.code,
      nameRw: t.nameRw,
      nameEn: t.nameEn,
      total: list.length,
      l3: list.filter(s => s.level === 'L3').length,
      l4: list.filter(s => s.level === 'L4').length,
      l5: list.filter(s => s.level === 'L5').length,
      male: list.filter(s => s.gender === 'Male').length,
      female: list.filter(s => s.gender === 'Female').length,
      boarding: list.filter(s => s.boardingType === 'boarding').length,
      day: list.filter(s => s.boardingType === 'day_scholar').length,
    };
  });

  res.json({ success: true, academicYear: '2026/2027', institution: 'EAV Gitwe TSS', data: report });
});

// ==========================================
// VITE MIDDLEWARE (DEV) & STATIC SERVE (PROD)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EAV GITWE TSS BACKEND] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
