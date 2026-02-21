import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyAssets(@Request() req: any) {
    return this.assetsService.getMyAssets(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  buyAsset(@Param('id') id: string, @Body() body: { amount: number }, @Request() req: any) {
    return this.assetsService.buyAsset(req.user.userId, id, body.amount);
  }
}
