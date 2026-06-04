import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class CertificatesService {
  async getCertificates(tenantId: string, userId: string) {
    return prisma.certificate.findMany({
      where: { tenantId, userId },
      include: { course: true },
      orderBy: { issuedAt: 'desc' }
    });
  }

  async issueCertificate(tenantId: string, userId: string, courseId: string) {
    // Check if enrolled and 100% complete
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        tenantId_userId_courseId: {
          tenantId,
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.progressPercentage < 100) {
      throw new BadRequestException('Course is not fully completed yet');
    }

    // Check if already issued
    const existing = await prisma.certificate.findFirst({
      where: { tenantId, userId, courseId }
    });

    if (existing) {
      return existing; // Idempotent
    }

    const validationCode = randomBytes(8).toString('hex').toUpperCase();

    const certificate = await prisma.certificate.create({
      data: {
        tenantId,
        userId,
        courseId,
        validationCode,
        certificateUrl: `/certificate/verify/${validationCode}`
      },
      include: { course: true }
    });

    return certificate;
  }

  async verifyCertificate(validationCode: string) {
    const certificate = await prisma.certificate.findUnique({
      where: { validationCode },
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true, description: true } },
        tenant: { select: { name: true, branding: true } }
      }
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found or invalid');
    }

    return certificate;
  }

  async getCertificatePdf(certificateId: string) {
    // Mock implementation
    return { success: true, message: 'PDF generated successfully', url: `/downloads/${certificateId}.pdf` };
  }
}

