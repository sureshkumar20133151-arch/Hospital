import { PrismaClient, Role, Gender, BloodGroup, DayOfWeek, LabReportType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MEDICAL_DISCLAIMER =
  'LEGAL & CLINICAL DISCLAIMER: All medical notes, prescriptions, and records generated or displayed are intended for official clinical care by authorized medical practitioners. This information does not replace in-person professional clinical evaluation, diagnosis, or emergency intervention. In case of medical emergencies, immediately contact hospital emergency hotline 1066 or visit the nearest emergency room.';

async function main() {
  console.log('🌱 Starting Aarogya Hospital Database Seed...');

  // 1. Hash default password
  const defaultPassword = await bcrypt.hash('Hospital@12345', 10);

  // 2. Seed Departments
  const departmentsData = [
    {
      name: 'Cardiology & Cardiovascular Care',
      slug: 'cardiology',
      code: 'CARD',
      description: 'Comprehensive non-invasive & interventional cardiology, heart failure clinic, ECG, Echo, and 24x7 Cath Lab.',
      iconName: 'HeartPulse',
      headOfDepartment: 'Dr. A. Sharma'
    },
    {
      name: 'Orthopedics & Joint Replacement',
      slug: 'orthopedics',
      code: 'ORTH',
      description: 'Advanced joint replacement, arthroscopy, spine surgery, fracture management, and sports injury rehabilitation.',
      iconName: 'Bone',
      headOfDepartment: 'Dr. R. Patel'
    },
    {
      name: 'Neurology & Neurosurgery',
      slug: 'neurology',
      code: 'NEUR',
      description: 'Stroke unit, epilepsy care, neuromuscular disorders, neuro-rehabilitation, and minimally invasive brain surgery.',
      iconName: 'Brain',
      headOfDepartment: 'Dr. S. Mukherjee'
    },
    {
      name: 'Pediatrics & Neonatology',
      slug: 'pediatrics',
      code: 'PEDI',
      description: 'Level-3 NICU/PICU, routine immunization, developmental assessments, and comprehensive pediatric sub-specialties.',
      iconName: 'Baby',
      headOfDepartment: 'Dr. P. Iyer'
    },
    {
      name: 'Obstetrics & Gynecology',
      slug: 'gynecology',
      code: 'GYNE',
      description: 'Maternity suites, high-risk pregnancy care, painless labor, laparoscopy, and fertility consultation.',
      iconName: 'Activity',
      headOfDepartment: 'Dr. K. Reddy'
    },
    {
      name: 'General Medicine & Diabetology',
      slug: 'general-medicine',
      code: 'GENM',
      description: 'Internal medicine, hypertension, metabolic disorders, lifestyle disease management, and preventive health checks.',
      iconName: 'Stethoscope',
      headOfDepartment: 'Dr. V. Rao'
    },
    {
      name: 'Gastroenterology & Hepatology',
      slug: 'gastroenterology',
      code: 'GAST',
      description: 'Advanced endoscopy, colonoscopy, liver disease management, and therapeutic GI interventions.',
      iconName: 'Pill',
      headOfDepartment: 'Dr. N. Gupta'
    },
    {
      name: 'Pulmonology & Respiratory Medicine',
      slug: 'pulmonology',
      code: 'PULM',
      description: 'Pulmonary function lab, asthma and COPD management, sleep apnea clinic, and bronchoscopy suite.',
      iconName: 'Wind',
      headOfDepartment: 'Dr. M. Joseph'
    }
  ];

  console.log('Seeding departments...');
  const createdDepartments: Record<string, any> = {};
  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept
    });
    createdDepartments[dept.code] = d;
  }

  // 3. Seed Super Admin User
  console.log('Seeding administrative users...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aarogyahospital.example.com' },
    update: {},
    create: {
      email: 'admin@aarogyahospital.example.com',
      phone: '+919876543210',
      passwordHash: defaultPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true
    }
  });

  // 4. Seed Receptionist User
  await prisma.user.upsert({
    where: { email: 'reception@aarogyahospital.example.com' },
    update: {},
    create: {
      email: 'reception@aarogyahospital.example.com',
      phone: '+919876543211',
      passwordHash: defaultPassword,
      role: Role.RECEPTIONIST,
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true
    }
  });

  // 5. Seed Doctors (Generic clinical profiles with statutory NMC numbers)
  console.log('Seeding doctors and OPD schedules...');
  const doctorsData = [
    {
      email: 'cardio.consultant@aarogyahospital.example.com',
      phone: '+919876543220',
      fullName: 'Dr. A. Sharma',
      departmentCode: 'CARD',
      specialization: 'Interventional Cardiology',
      qualifications: ['MBBS', 'MD (Internal Medicine)', 'DM (Cardiology)'],
      nmcRegistrationNumber: 'NMC/MCI/2010/04912',
      experienceYears: 16,
      consultationFee: 900.0,
      languages: ['English', 'Hindi', 'Kannada'],
      roomNumber: 'OPD-101',
      bio: 'Senior consultant cardiologist specializing in clinical cardiology, preventive heart health, and interventional procedures.'
    },
    {
      email: 'ortho.consultant@aarogyahospital.example.com',
      phone: '+919876543221',
      fullName: 'Dr. R. Patel',
      departmentCode: 'ORTH',
      specialization: 'Joint Replacement & Arthroscopy',
      qualifications: ['MBBS', 'MS (Orthopedics)', 'Fellowship in Arthroplasty (UK)'],
      nmcRegistrationNumber: 'NMC/MCI/2012/07819',
      experienceYears: 14,
      consultationFee: 800.0,
      languages: ['English', 'Hindi', 'Gujarati'],
      roomNumber: 'OPD-104',
      bio: 'Orthopedic surgeon focusing on robotic-assisted knee and hip replacement and sports trauma management.'
    },
    {
      email: 'neuro.consultant@aarogyahospital.example.com',
      phone: '+919876543222',
      fullName: 'Dr. S. Mukherjee',
      departmentCode: 'NEUR',
      specialization: 'Clinical Neurology & Stroke Care',
      qualifications: ['MBBS', 'MD (Medicine)', 'DM (Neurology)'],
      nmcRegistrationNumber: 'NMC/MCI/2014/11024',
      experienceYears: 12,
      consultationFee: 850.0,
      languages: ['English', 'Hindi', 'Bengali'],
      roomNumber: 'OPD-202',
      bio: 'Neurologist with key interest in acute stroke rehabilitation, migraine disorders, and neuropathy.'
    },
    {
      email: 'pediatric.consultant@aarogyahospital.example.com',
      phone: '+919876543223',
      fullName: 'Dr. P. Iyer',
      departmentCode: 'PEDI',
      specialization: 'Pediatric Care & Immunization',
      qualifications: ['MBBS', 'MD (Pediatrics)', 'DNB (Pediatrics)'],
      nmcRegistrationNumber: 'NMC/MCI/2015/09312',
      experienceYears: 11,
      consultationFee: 700.0,
      languages: ['English', 'Hindi', 'Tamil'],
      roomNumber: 'OPD-112',
      bio: 'Consultant pediatrician dedicated to child nutrition, neonatal well-being, and growth assessments.'
    },
    {
      email: 'medicine.consultant@aarogyahospital.example.com',
      phone: '+919876543224',
      fullName: 'Dr. V. Rao',
      departmentCode: 'GENM',
      specialization: 'Internal Medicine & Diabetology',
      qualifications: ['MBBS', 'MD (General Medicine)', 'Post-Graduate Diabetology'],
      nmcRegistrationNumber: 'NMC/MCI/2009/03215',
      experienceYears: 18,
      consultationFee: 650.0,
      languages: ['English', 'Hindi', 'Telugu'],
      roomNumber: 'OPD-102',
      bio: 'Consultant physician offering evidence-based medical treatment for diabetes, hypertension, and infectious diseases.'
    }
  ];

  const days: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY
  ];

  let primaryDoctorId = '';

  for (const doc of doctorsData) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        email: doc.email,
        phone: doc.phone,
        passwordHash: defaultPassword,
        role: Role.DOCTOR,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true
      }
    });

    const dept = createdDepartments[doc.departmentCode];

    const doctorProfile = await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: doc.fullName,
        departmentId: dept.id,
        specialization: doc.specialization,
        qualifications: doc.qualifications,
        nmcRegistrationNumber: doc.nmcRegistrationNumber,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        languages: doc.languages,
        roomNumber: doc.roomNumber,
        bio: doc.bio
      }
    });

    if (!primaryDoctorId) {
      primaryDoctorId = doctorProfile.id;
    }

    // Create weekly OPD schedules
    for (const day of days) {
      await prisma.doctorSchedule.upsert({
        where: {
          doctorId_dayOfWeek_startTime: {
            doctorId: doctorProfile.id,
            dayOfWeek: day,
            startTime: '09:00'
          }
        },
        update: {},
        create: {
          doctorId: doctorProfile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          slotDurationMinutes: 15,
          maxPatientsPerSlot: 1,
          isAvailable: true
        }
      });
    }
  }

  // 6. Seed Demo Patient Profile with DPDP consent records
  console.log('Seeding demo patient with DPDP records...');
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@aarogyahospital.example.com' },
    update: {},
    create: {
      email: 'patient@aarogyahospital.example.com',
      phone: '+919988776655',
      passwordHash: defaultPassword,
      role: Role.PATIENT,
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true
    }
  });

  const patientProfile = await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      uhid: 'AH-2026-00001',
      fullName: 'Aarav Kumar (Sample Patient Profile)',
      dateOfBirth: new Date('1990-05-15'),
      gender: Gender.MALE,
      bloodGroup: BloodGroup.O_POSITIVE,
      emergencyContactName: 'Priya Kumar',
      emergencyContactPhone: '+919988776650',
      addressLine1: 'Flat 402, Green Meadows',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      allergies: ['Penicillin'],
      chronicConditions: ['Seasonal Allergies']
    }
  });

  // DPDP Consent for Demo Patient
  await prisma.dpdpConsent.create({
    data: {
      patientId: patientProfile.id,
      purpose: 'ACCOUNT_CREATION',
      isGranted: true,
      version: 'v1.0',
      consentText:
        'I consent to Aarogya Multi-Specialty Hospital processing my health records in compliance with India DPDP Act 2023.'
    }
  });

  // Seed sample lab report for patient (Confidential & Access-Controlled)
  await prisma.labReport.create({
    data: {
      patientId: patientProfile.id,
      testName: 'Complete Blood Count (CBC) & Lipid Profile',
      category: LabReportType.PATHOLOGY,
      fileKey: 'secure-vault/reports/AH-2026-00001/cbc_lipid_sample.pdf',
      fileName: 'CBC_Lipid_Profile_AH00001.pdf',
      mimeType: 'application/pdf',
      fileSizeBytes: 245000,
      summary: 'Lipid panel and routine hemogram parameters within normal biological reference intervals.',
      isConfidential: true
    }
  });

  console.log('✅ Database seed completed successfully!');
  console.log('------------------------------------------------');
  console.log('Demo Credentials (all use password: Hospital@12345):');
  console.log('• Super Admin : admin@aarogyahospital.example.com');
  console.log('• Receptionist: reception@aarogyahospital.example.com');
  console.log('• Doctor      : cardio.consultant@aarogyahospital.example.com');
  console.log('• Patient     : patient@aarogyahospital.example.com');
  console.log('------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
