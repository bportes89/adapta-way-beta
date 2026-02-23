import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNftDto: CreateNftDto, @Request() req: any) {
    return this.nftsService.create(createNftDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.nftsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyNfts(@Request() req: any) {
    return this.nftsService.findMyNfts(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nftsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
    return this.nftsService.update(id, updateNftDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nftsService.remove(id);
  }
}
