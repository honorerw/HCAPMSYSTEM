// Dummy Data for HCAPMS - African Names
export interface Patient {
  id: number;
  name: string;
  dob: string;
  nationalId: string;
  phone: string;
  email: string;
  address: string;
  allergies: string;
  chronicConditions: string;
  photo?: string;
}

export interface Doctor {
  id: number;
  name: string;
  department: string;
  experience: number;
  availability: string[];
  photo?: string;
  biography: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  doctorName: string;
  type: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export const dummyPatients: Patient[] = [
  { id: 1, name: 'UWITUZE Adeline', dob: '2002-03-15', nationalId: 'ID119456789001', phone: '0781234567', email: 'uwituzeadeline@email.com', address: 'Kigali, Rwanda', allergies: 'None', chronicConditions: 'None' },
  { id: 2, name: 'TUYISENGE Honore', dob: '2001-07-22', nationalId: 'ID119456789002', phone: '0782345678', email: 'tuyisengehonore@email.com', address: 'Musanze, Rwanda', allergies: 'Penicillin', chronicConditions: 'Asthma' },
  { id: 3, name: 'ABAFASHIJWENIMANA Donacien', dob: '2003-11-08', nationalId: 'ID119456789003', phone: '0783456789', email: 'abafashijwenimana@email.com', address: 'Rubavu, Rwanda', allergies: 'None', chronicConditions: 'Diabetes' },
  { id: 4, name: 'UMUHOZA Samuel', dob: '2004-01-30', nationalId: 'ID119456789004', phone: '0784567890', email: 'umuhozasamuel@email.com', address: 'Huye, Rwanda', allergies: 'Aspirin', chronicConditions: 'None' },
  { id: 5, name: 'BYIRINGIRO Ismael', dob: '2000-05-12', nationalId: 'ID119456789005', phone: '0785678901', email: 'byiringiroismael@email.com', address: 'Ruhengeri, Rwanda', allergies: 'Sulfa', chronicConditions: 'Hypertension' },
  { id: 6, name: 'IYABIKOZE Lydie', dob: '2002-08-25', nationalId: 'ID119456789006', phone: '0786789012', email: 'iyabikozelydie@email.com', address: 'Kigali, Rwanda', allergies: 'None', chronicConditions: 'None' },
  { id: 7, name: 'IMANIRUMVA Samuel', dob: '2005-12-18', nationalId: 'ID119456789007', phone: '0787890123', email: 'imanirumvasamuel@email.com', address: 'Nyagatare, Rwanda', allergies: 'Peanuts', chronicConditions: 'None' },
  { id: 8, name: 'NIYOGISUBIZO John', dob: '2001-04-05', nationalId: 'ID119456789008', phone: '0788901234', email: 'niyogisubizo@email.com', address: 'Gicumbi, Rwanda', allergies: 'None', chronicConditions: 'Asthma' },
  { id: 9, name: 'IKUZWE Adeline', dob: '2003-09-14', nationalId: 'ID119456789009', phone: '0789012345', email: 'ikuzweadeline@email.com', address: 'Kigali, Rwanda', allergies: 'None', chronicConditions: 'None' },
];

export const dummyDoctors: Doctor[] = [
  { id: 1, name: 'NISHIMWE Samuel', department: 'General Medicine', experience: 5, availability: ['Mon 9-12', 'Wed 14-17'], biography: 'General practitioner.' },
  { id: 2, name: 'NIYODUSENGA Solange', department: 'Pediatrics', experience: 7, availability: ['Tue 10-13', 'Thu 9-12'], biography: 'Pediatric specialist.' },
  { id: 3, name: 'SHEMA Jacques', department: 'Cardiology', experience: 10, availability: ['Mon 14-17', 'Fri 9-12'], biography: 'Heart specialist.' },
  { id: 4, name: 'SHUKURU prince', department: 'Surgery', experience: 8, availability: ['Wed 9-12', 'Thu 14-17'], biography: 'Surgeon.' },
  { id: 5, name: 'MUHIRE Jackson', department: 'Orthopedics', experience: 6, availability: ['Tue 9-12', 'Fri 14-17'], biography: 'Orthopedic specialist.' },
  { id: 6, name: 'KIZERA Elivis', department: 'Gynecology', experience: 9, availability: ['Mon 10-13', 'Wed 14-17'], biography: 'Gynecologist.' },
  { id: 7, name: 'MANZI Emile', department: 'Neurology', experience: 12, availability: ['Thu 9-12', 'Sat 10-13'], biography: 'Neurologist.' },
  { id: 8, name: 'ISHIMWE Sept', department: 'Dermatology', experience: 4, availability: ['Mon 9-12', 'Fri 10-13'], biography: 'Dermatologist.' },
  { id: 9, name: 'HESHIMA Diane', department: 'Psychiatry', experience: 6, availability: ['Tue 14-17', 'Wed 9-12'], biography: 'Psychiatrist.' },
  { id: 10, name: 'UMUHOZA Alice', department: 'Ophthalmology', experience: 5, availability: ['Thu 10-13', 'Fri 14-17'], biography: 'Ophthalmologist.' },
  { id: 11, name: 'NIYIKIZA Fabrice', department: 'Radiology', experience: 8, availability: ['Mon 14-17', 'Wed 10-13'], biography: 'Radiologist.' },
];

export const dummyAppointments: Appointment[] = [
  { id: 1, patientId: 1, doctorId: 1, patientName: 'UWITUZE Adeline', doctorName: 'NISHIMWE Samuel', type: 'Consultation', date: '2024-10-15', time: '10:00', status: 'Confirmed' },
  { id: 2, patientId: 2, doctorId: 2, patientName: 'TUYISENGE Honore', doctorName: 'NIYODUSENGA Solange', type: 'Follow-up', date: '2024-10-16', time: '11:00', status: 'Pending' },
  { id: 3, patientId: 3, doctorId: 3, patientName: 'ABAFASHIJWENIMANA Donacien', doctorName: 'SHEMA Jacques', type: 'Checkup', date: '2024-10-17', time: '09:00', status: 'Confirmed' },
  { id: 4, patientId: 4, doctorId: 4, patientName: 'UMUHOZA Samuel', doctorName: 'SHUKURU prince', type: 'Lab Results', date: '2024-10-18', time: '14:00', status: 'Pending' },
  { id: 5, patientId: 5, doctorId: 5, patientName: 'BYIRINGIRO Ismael', doctorName: 'MUHIRE Jackson', type: 'Consultation', date: '2024-10-19', time: '11:00', status: 'Confirmed' },
  { id: 6, patientId: 6, doctorId: 6, patientName: 'IYABIKOZE Lydie', doctorName: 'KIZERA Elivis', type: 'Follow-up', date: '2024-10-20', time: '15:00', status: 'Pending' },
  { id: 7, patientId: 7, doctorId: 7, patientName: 'IMANIRUMVA Samuel', doctorName: 'MANZI Emile', type: 'Checkup', date: '2024-10-21', time: '10:30', status: 'Confirmed' },
  { id: 8, patientId: 8, doctorId: 8, patientName: 'NIYOGISUBIZO John', doctorName: 'ISHIMWE Sept', type: 'Consultation', date: '2024-10-22', time: '09:30', status: 'Confirmed' },
  { id: 9, patientId: 9, doctorId: 9, patientName: 'IKUZWE Adeline', doctorName: 'HESHIMA Diane', type: 'Follow-up', date: '2024-10-23', time: '14:00', status: 'Pending' },
  { id: 10, patientId: 1, doctorId: 10, patientName: 'UWITUZE Adeline', doctorName: 'UMUHOZA Alice', type: 'Checkup', date: '2024-10-24', time: '10:00', status: 'Confirmed' },
];