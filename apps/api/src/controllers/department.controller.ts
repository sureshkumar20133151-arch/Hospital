import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';

export class DepartmentController {
  static async getAll(_req: Request, res: Response) {
    try {
      const departments = await prisma.department.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { doctors: true }
          }
        },
        orderBy: { name: 'asc' }
      });

      const data = departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        code: dept.code,
        description: dept.description,
        iconName: dept.iconName,
        headOfDepartment: dept.headOfDepartment,
        activeDoctorsCount: dept._count.doctors
      }));

      return sendSuccess(res, 'Departments retrieved successfully', data);
    } catch (err: any) {
      console.error('[DepartmentController.getAll Error]:', err);
      return sendError(res, err.message || 'Failed to fetch departments', 500, 'DATABASE_ERROR');
    }
  }

  static async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    const department = await prisma.department.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: { isAcceptingNewPatients: true },
          include: {
            schedules: true
          }
        }
      }
    });

    if (!department) {
      return sendError(res, 'Department not found', 404, 'NOT_FOUND');
    }

    return sendSuccess(res, 'Department details retrieved', department);
  }

  static async create(req: Request, res: Response) {
    const { name, slug, code, description, iconName, headOfDepartment } = req.body;

    const existing = await prisma.department.findFirst({
      where: {
        OR: [{ name }, { slug }, { code }]
      }
    });

    if (existing) {
      return sendError(res, 'Department with this name, code, or slug already exists', 409, 'DUPLICATE_DEPARTMENT');
    }

    const dept = await prisma.department.create({
      data: {
        name,
        slug,
        code,
        description,
        iconName,
        headOfDepartment
      }
    });

    return sendSuccess(res, 'Department created successfully', dept, 201);
  }
}
