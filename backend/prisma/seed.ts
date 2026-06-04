/**
 * Prisma Database Seed Script
 *
 * Creates:
 *  - Default system roles (SUPER_ADMIN, ADMIN, INSTRUCTOR, STUDENT)
 *  - Default permissions for all modules
 *  - Demo tenant (ntanda-demo)
 *  - Super Admin user  : admin@ntanda.com / Admin1234!
 *  - School Admin user : schooladmin@ntanda.com / Admin1234!
 *  - Instructor user   : instructor@ntanda.com / Admin1234!
 *  - Student user      : student@ntanda.com / Admin1234!
 */

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ─── Permissions ────────────────────────────────────────────────────────────
  const permDefs = [
    { action: 'CREATE', resource: 'users' },
    { action: 'READ_USER', resource: 'users' },
    { action: 'UPDATE_USER', resource: 'users' },
    { action: 'DELETE_USER', resource: 'users' },
    { action: 'CREATE_COURSE', resource: 'courses' },
    { action: 'READ_COURSE', resource: 'courses' },
    { action: 'UPDATE_COURSE', resource: 'courses' },
    { action: 'DELETE_COURSE', resource: 'courses' },
    { action: 'ENROLL_COURSE', resource: 'enrollments' },
    { action: 'READ_ENROLLMENT', resource: 'enrollments' },
    { action: 'UPDATE_ENROLLMENT_PROGRESS', resource: 'enrollments' },
    { action: 'READ_ANALYTICS', resource: 'analytics' },
    { action: 'READ_PAYMENTS', resource: 'payments' },
    { action: 'MANAGE_SUBSCRIPTIONS', resource: 'subscriptions' },
    { action: 'CREATE_ASSESSMENT', resource: 'assessments' },
    { action: 'READ_ASSESSMENT', resource: 'assessments' },
    { action: 'MANAGE_CONTENT', resource: 'content' },
  ];

  const createdPerms: { id: string; action: string; resource: string }[] = [];

  for (const def of permDefs) {
    const p = await prisma.permission.upsert({
      where: { action_resource: { action: def.action, resource: def.resource } },
      update: {},
      create: { action: def.action, resource: def.resource },
    });
    createdPerms.push(p);
    console.log(`  ✓ Permission: ${p.action}_${p.resource}`);
  }

  const allPermIds = createdPerms.map(p => ({ id: p.id }));
  const instructorActions = ['CREATE_COURSE', 'READ_COURSE', 'UPDATE_COURSE', 'READ_ENROLLMENT', 'CREATE_ASSESSMENT', 'READ_ASSESSMENT', 'MANAGE_CONTENT'];
  const studentActions = ['ENROLL_COURSE', 'READ_COURSE', 'UPDATE_ENROLLMENT_PROGRESS', 'READ_ASSESSMENT'];

  const instructorPermIds = createdPerms.filter(p => instructorActions.includes(p.action)).map(p => ({ id: p.id }));
  const studentPermIds = createdPerms.filter(p => studentActions.includes(p.action)).map(p => ({ id: p.id }));

  // Helper for role upsert to avoid Prisma null unique index issues
  async function upsertRole(name: string, description: string, perms: { id: string }[]) {
    const existing = await prisma.role.findFirst({
      where: { name, tenantId: null },
    });
    if (existing) {
      return prisma.role.update({
        where: { id: existing.id },
        data: { permissions: { set: perms } },
      });
    }
    return prisma.role.create({
      data: {
        name,
        description,
        isSystem: true,
        permissions: { connect: perms },
      },
    });
  }

  // ─── System Roles (tenantId = null → shared across platform) ────────────────
  const superAdminRole = await upsertRole('SUPER_ADMIN', 'Global system control', allPermIds);
  console.log(`\n  ✓ Role: SUPER_ADMIN`);

  const adminRole = await upsertRole('ADMIN', 'Institution administrator', allPermIds);
  console.log(`  ✓ Role: ADMIN`);

  const instructorRole = await upsertRole('INSTRUCTOR', 'Course instructor', instructorPermIds);
  console.log(`  ✓ Role: INSTRUCTOR`);

  const studentRole = await upsertRole('STUDENT', 'Enrolled student', studentPermIds);
  console.log(`  ✓ Role: STUDENT`);

  // ─── Demo Tenant ────────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'ntanda-demo' },
    update: {},
    create: {
      name: 'Ntanda Demo Academy',
      domain: 'demo.ntanda.com',
      subdomain: 'ntanda-demo',
      status: 'ACTIVE',
      branding: { primaryColor: '#2563eb', logoUrl: '' },
    },
  });
  console.log(`\n  ✓ Tenant: ${tenant.name}`);
  console.log(`    Tenant ID: ${tenant.id}`);

  // ─── Users ───────────────────────────────────────────────────────────────────
  const pw = await argon2.hash('Admin1234!');

  const users = [
    { email: 'admin@ntanda.com', fullName: 'Super Admin', roleId: superAdminRole.id },
    { email: 'schooladmin@ntanda.com', fullName: 'School Admin', roleId: adminRole.id },
    { email: 'instructor@ntanda.com', fullName: 'Demo Instructor', roleId: instructorRole.id },
    { email: 'student@ntanda.com', fullName: 'Demo Student', roleId: studentRole.id },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: u.email } },
      update: {},
      create: { tenantId: tenant.id, email: u.email, passwordHash: pw, fullName: u.fullName, roleId: u.roleId },
    });
    console.log(`  ✓ User: ${u.email} [${u.fullName}]`);
  }

  // ─── Demo Institution ────────────────────────────────────────────────────────
  await prisma.institution.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Ntanda Demo Academy',
      contactEmail: 'info@ntanda.com',
      contactPhone: '+2348000000000',
      address: '1 Demo Street, Lagos, Nigeria',
      settings: {},
    },
  });
  console.log(`  ✓ Institution created`);

  console.log('\n────────────────────────────────────────────────────');
  console.log('✅ Seed complete! Ready to use.\n');
  console.log(`  Tenant ID (use as x-tenant-id header): ${tenant.id}`);
  console.log('\n  Login credentials (password: Admin1234!):');
  console.log('    admin@ntanda.com        → SUPER_ADMIN');
  console.log('    schooladmin@ntanda.com  → ADMIN');
  console.log('    instructor@ntanda.com   → INSTRUCTOR');
  console.log('    student@ntanda.com      → STUDENT');
  console.log('────────────────────────────────────────────────────\n');
}

main()
  .catch(e => {
    console.error('\n❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
