import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCertificates(@Req() req: any) {
    return this.certificatesService.getCertificates(req.tenantId, req.user.id);
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard)
  async issueCertificate(@Req() req: any, @Body() body: { courseId: string }) {
    return this.certificatesService.issueCertificate(req.tenantId, req.user.id, body.courseId);
  }

  @Get('verify/:code')
  async verifyCertificate(@Param('code') code: string) {
    return this.certificatesService.verifyCertificate(code);
  }

  @Get(':id/pdf')
  async getCertificatePdf(@Param('id') id: string) {
    return this.certificatesService.getCertificatePdf(id);
  }
}

