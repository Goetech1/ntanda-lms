import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('CREATE_ROLE')
  create(@Body() createRoleDto: CreateRoleDto, @GetUser('tenantId') tenantId: string) {
    return this.rolesService.create(createRoleDto, tenantId);
  }

  @Get()
  @RequirePermissions('READ_ROLE')
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.rolesService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('READ_ROLE')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.rolesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('UPDATE_ROLE')
  update(
    @Param('id') id: string, 
    @Body() updateRoleDto: UpdateRoleDto, 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.rolesService.update(id, updateRoleDto, tenantId);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_ROLE')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.rolesService.remove(id, tenantId);
  }

  @Post(':id/permissions')
  @RequirePermissions('UPDATE_ROLE')
  assignPermissions(
    @Param('id') id: string, 
    @Body('permissionIds') permissionIds: string[], 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.rolesService.assignPermissions(id, permissionIds, tenantId);
  }
}
