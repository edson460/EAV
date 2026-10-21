export type UserRole = 'principal' | 'registrar' | 'bursar' | 'warden';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatarUrl?: string;
  created_at?: string;
}

export type TradeCode = 'SOD' | 'BCN' | 'ANH' | 'AGR';

export interface TradeInfo {
  code: TradeCode;
  nameRw: string;
  nameEn: string;
  descriptionRw: string;
  descriptionEn: string;
  headOfDepartment: string;
  capacityL3: number;
  capacityL4: number;
  capacityL5: number;
  iconName: string;
  badgeColor: string;
}

export type LevelCode = 'L3' | 'L4' | 'L5';

export type AdmissionStatus = 'pending' | 'verified' | 'admitted' | 'incomplete_docs' | 'rejected';

export type BoardingType = 'boarding' | 'day_scholar';

export type Gender = 'Male' | 'Female';

export interface StudentDocument {
  id: string;
  nameRw: string;
  nameEn: string;
  required: boolean;
  isUploaded: boolean;
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  status: 'verified' | 'missing' | 'under_review';
}

export interface StudentRecord {
  id: string;
  studentCode: string; // e.g. EAV/2026/SOD/042
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  nationalIdOrIndex: string;
  previousSchool: string;
  trade: TradeCode;
  level: LevelCode;
  boardingType: BoardingType;
  dormitoryBlock?: string;
  roomNumber?: string;
  bedNumber?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  district: string;
  sector: string;
  status: AdmissionStatus;
  applicationDate: string;
  documents: StudentDocument[];
  fees: {
    totalExpected: number;
    amountPaid: number;
    balance: number;
    lastPaymentDate?: string;
    receiptNumber?: string;
  };
  notes?: string;
}

export interface DormitoryBlock {
  id: string;
  name: string;
  gender: Gender;
  totalBeds: number;
  occupiedBeds: number;
  wardenName: string;
  wardenPhone: string;
  rooms: {
    roomNumber: string;
    beds: {
      bedId: string;
      isOccupied: boolean;
      studentName?: string;
      studentCode?: string;
    }[];
  }[];
}

export interface SmsNotification {
  id: string;
  recipientPhone: string;
  recipientName: string;
  studentCode: string;
  studentName: string;
  type: 'admission_offer' | 'missing_docs' | 'fees_reminder' | 'school_reopening';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
}
