import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only) with pagination and search' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string = '',
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/users',
    }, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status (block/unblock) (Admin only)' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateUserStatusDto) {
    return this.usersService.updateStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  updateRole(@Param('id') id: string, @Body() body: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, body.role);
  }

  @Post(':id/upload-photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload user profile photo' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    const photoUrl = `${baseUrl}/uploads/avatars/${file.filename}`;
    await this.usersService.update(id, { photoUrl });
    return { photoUrl };
  }
}
