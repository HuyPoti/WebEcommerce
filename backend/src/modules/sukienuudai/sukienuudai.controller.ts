import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SuKienUuDaiService } from './sukienuudai.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { CreateSuKienUuDaiDto, SuKienUuDaiDto } from './dto/sukienuudai.dto';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { Roles } from 'src/common/factory_function/role';

@Controller('sukienuudai')
export class SuKienUuDaiController {
    constructor(readonly suKienUuDaiService: SuKienUuDaiService) {}
    @Get()
    @ResponseMessage('Láº¥y danh sÃ¡ch sá»± kiá»‡n Æ°u Ä‘Ã£i thÃ nh cÃ´ng')
    getAll() {
        return this.suKienUuDaiService.getAll();
    }

    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Get("/all")
    @ResponseMessage('Láº¥y danh sÃ¡ch sá»± kiá»‡n Æ°u Ä‘Ã£i thÃ nh cÃ´ng')
    getAllByNV() {
        return this.suKienUuDaiService.getAll();
    }

    //láº¥y sá»± kiá»‡n Æ°u Ä‘Ã£i theo id
    @Get('/:id')
    @ResponseMessage('Láº¥y sá»± kiá»‡n Æ°u Ä‘Ã£i theo id thÃ nh cÃ´ng')
    getById(@Param('id') id: string) {
        return this.suKienUuDaiService.getById(id);
    }
    //thÃªm má»›i sá»± kiá»‡n Æ°u Ä‘Ã£i
    @Post("/add")
    @ResponseMessage('ThÃªm má»›i sá»± kiá»‡n Æ°u Ä‘Ã£i thÃ nh cÃ´ng')
    addSuKienUuDai(@Body() suKienUuDaiDto: CreateSuKienUuDaiDto) {
        return this.suKienUuDaiService.addSuKienUuDai(suKienUuDaiDto);
    }
    //chá»‰nh sá»­a sá»± kiá»‡n Æ°u Ä‘Ã£i theo id
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Put('/update/:id')
    @ResponseMessage('Chá»‰nh sá»­a sá»± kiá»‡n Æ°u Ä‘Ã£i thÃ nh cÃ´ng')
    updateSuKienUuDai(@Param('id') id: string, @Body() suKienUuDaiDto: SuKienUuDaiDto) {
        return this.suKienUuDaiService.updateSuKienUuDai(id, suKienUuDaiDto);
    }

    //thay Ä‘á»•i tráº¡ng thÃ¡i sá»± kiá»‡n Æ°u Ä‘Ã£i
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Put(':id/trangthai')
    @ResponseMessage('Thay Ä‘á»•i tráº¡ng thÃ¡i sá»± kiá»‡n Æ°u Ä‘Ã£i thÃ nh cÃ´ng')
    changeStatus(@Param('id') id: string, @Body('trangThai') trangThai: string) {
        return this.suKienUuDaiService.changeStatus(id, trangThai);
    }
}
