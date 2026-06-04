import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('CREATE_USER')
  create(@Body() createUserDto: CreateUserDto, @GetUser('tenantId') tenantId: string) {
    return this.usersService.create(createUserDto, tenantId);
  }

  @Get()
  @RequirePermissions('READ_USER')
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.usersService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('READ_USER')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.usersService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('UPDATE_USER')
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.usersService.update(id, updateUserDto, tenantId);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_USER')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.usersService.remove(id, tenantId);
  }
}
