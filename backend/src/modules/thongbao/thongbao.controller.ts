import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { ThongbaoService } from './thongbao.service';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { Roles } from 'src/common/factory_function/role';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ThongBaoDto } from './dto/thongbao.dto';

@Controller('thongbao')
export class ThongbaoController {
    constructor(private readonly thongbaoService: ThongbaoService) {}
    @Get('/sukienuudai')
    @ResponseMessage('Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o sá»± kiá»‡n thÃ nh cÃ´ng')
    getAllThongBaoSK() {
        return this.thongbaoService.getAllSuKienUuDai();
    }

    @Get('/voucher')
    @ResponseMessage('Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o voucher thÃ nh cÃ´ng')
    getAllThongBaoVC() {
        return this.thongbaoService.getAllVoucher();
    }

    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    //update thong bao
    @Put('/sukienuudai/update')
    @ResponseMessage('Cáº­p nháº­t thÃ´ng bÃ¡o sá»± kiá»‡n thÃ nh cÃ´ng')
    updateThongBaoSK(@Body() thongbao: ThongBaoDto[]) {
        return this.thongbaoService.updateThongBaoSK(thongbao);
    }

    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    //update thong bao
    @Put('/voucher/update')
    @ResponseMessage('Cáº­p nháº­t thÃ´ng bÃ¡o voucher thÃ nh cÃ´ng')
    updateThongBaoVC(@Body() thongbao: ThongBaoDto[]) {
        console.log('Received thongbao:', thongbao);
        return this.thongbaoService.updateThongBaoVC(thongbao);
    }

    //xÃ³a thÃ´ng bÃ¡o voucher
    @Delete('/voucher/delete')
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @ResponseMessage('XÃ³a thÃ´ng bÃ¡o voucher thÃ nh cÃ´ng')
    deleteThongBaoVC() {
        return this.thongbaoService.deleteThongBaoVC();
    }

    //xÃ³a thÃ´ng bÃ¡o sá»± kiá»‡n
    @Delete('/sukienuudai/delete')
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @ResponseMessage('XÃ³a thÃ´ng bÃ¡o sá»± kiá»‡n thÃ nh cÃ´ng')
    deleteThongBaoSK() {
        return this.thongbaoService.deleteThongBaoSK();
    }
}    // CÃ¡c phÆ°Æ¡ng thá»©c xá»­ lÃ½ thÃ´ng bÃ¡o sáº½ Ä‘Æ°á»£c thÃªm vÃ o Ä‘Ã¢y
