import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { DayOfWeek } from '@prisma/client';

export class DoctorController {
  /**
   * Search and filter doctors by department, query, specialization, day
   */
  static async searchDoctors(req: Request, res: Response) {
    const { query, departmentId, specialization, day, page = '1', limit = '10' } = req.query as any;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isAcceptingNewPatients: true
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (specialization) {
      where.specialization = {
        contains: specialization,
        mode: 'insensitive'
      };
    }

    if (query) {
      where.OR = [
        { fullName: { contains: query, mode: 'insensitive' } },
        { specialization: { contains: query, mode: 'insensitive' } },
        { qualifications: { has: query } }
      ];
    }

    if (day) {
      where.schedules = {
        some: {
          dayOfWeek: day as DayOfWeek,
          isAvailable: true
        }
      };
    }

    const [doctors, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where,
        include: {
          department: {
            select: { id: true, name: true, slug: true, code: true }
          },
          schedules: {
            where: { isAvailable: true }
          }
        },
        skip,
        take: limitNum,
        orderBy: { experienceYears: 'desc' }
      }),
      prisma.doctorProfile.count({ where })
    ]);

    const formattedDoctors = doctors.map((doc) => ({
      id: doc.id,
      userId: doc.userId,
      fullName: doc.fullName,
      specialization: doc.specialization,
      departmentId: doc.departmentId,
      departmentName: doc.department.name,
      qualifications: doc.qualifications,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      languages: doc.languages,
      avatarUrl: doc.avatarUrl,
      bio: doc.bio,
      roomNumber: doc.roomNumber,
      availableForTeleconsultation: doc.availableForTeleconsultation,
      nmcRegistrationNumber: doc.nmcRegistrationNumber,
      schedules: doc.schedules
    }));

    return sendSuccess(res, 'Doctors retrieved successfully', {
      items: formattedDoctors,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  }

  /**
   * Get doctor profile details with schedule
   */
  static async getDoctorById(req: Request, res: Response) {
    const { id } = req.params;

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        department: true,
        schedules: {
          where: { isAvailable: true }
        }
      }
    });

    if (!doctor) {
      return sendError(res, 'Doctor not found', 404, 'NOT_FOUND');
    }

    return sendSuccess(res, 'Doctor profile retrieved', doctor);
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  static async getAvailableSlots(req: Request, res: Response) {
    const { id } = req.params;
    const { date } = req.query as { date: string };

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, 'Valid date in YYYY-MM-DD format is required', 400, 'INVALID_DATE');
    }

    const targetDate = new Date(date);
    const dayNames: DayOfWeek[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];
    const dayOfWeek = dayNames[targetDate.getDay()];

    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId: id,
        dayOfWeek,
        isAvailable: true
      }
    });

    if (!schedule) {
      return sendSuccess(res, 'No schedule found for this day', {
        date,
        dayOfWeek,
        availableSlots: []
      });
    }

    // Generate slots
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const duration = schedule.slotDurationMinutes || 15;

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Fetch existing appointments on this date
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          notIn: ['CANCELLED', 'RESCHEDULED']
        }
      },
      select: { timeSlot: true }
    });

    const bookedSlotsSet = new Set(existingAppointments.map((a) => a.timeSlot));

    const slots: { slot: string; isBooked: boolean }[] = [];
    for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const slotStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      slots.push({
        slot: slotStr,
        isBooked: bookedSlotsSet.has(slotStr)
      });
    }

    return sendSuccess(res, 'Available slots calculated', {
      date,
      dayOfWeek,
      totalSlots: slots.length,
      availableSlots: slots
    });
  }
}
