import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ThanhtoanService } from './thanhtoan.service';
import { CreatePaymentDto } from './dto/thanhtoan.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@Controller('thanhtoan')
export class ThanhtoanController {
    constructor(private readonly thanhtoanService: ThanhtoanService) {}
    //táº¡o thanh toÃ¡n
    @Post("/create")
    @ResponseMessage('Táº¡o thanh toÃ¡n thÃ nh cÃ´ng')
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.thanhtoanService.createPayment(createPaymentDto);
    }
    //láº¥y danh sÃ¡ch thanh toÃ¡n
    @Get()
    @ResponseMessage('Láº¥y danh sÃ¡ch thanh toÃ¡n thÃ nh cÃ´ng')
    async getPaymentList() {
        return this.thanhtoanService.getPaymentList();
    }

    //láº¥y thanh toÃ¡n theo id
    @Get(':id')
    @ResponseMessage('Láº¥y thanh toÃ¡n theo id thÃ nh cÃ´ng')
    async getPaymentById(@Param('id') id: string) {
        return this.thanhtoanService.getPaymentById(id);
    }
}
