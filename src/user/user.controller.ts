import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(RolesGuard) // Protect all user routes with the RolesGuard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: number, @Body() { role }) {
    return this.userService.updateRole(id, role);
  }
}
