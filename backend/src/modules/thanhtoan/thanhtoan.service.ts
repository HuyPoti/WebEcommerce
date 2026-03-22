import { BadRequestException, Injectable } from '@nestjs/common';
import { ThanhtoanRepository } from 'src/common/repositories/thanhtoan.repository';
import { CreatePaymentDto } from './dto/thanhtoan.dto';
import { DonhangRepository } from 'src/common/repositories/donhang.repository';

@Injectable()
export class ThanhtoanService {
    constructor(private readonly thanhtoanRepository: ThanhtoanRepository,
        private readonly donHangRepository: DonhangRepository
    ) {}
    //táº¡o thanh toÃ¡n
    async createPayment(createPaymentDto: CreatePaymentDto) {
        const donhang = await this.donHangRepository.findOrderById(createPaymentDto.MaDH);
        if (!donhang) {
            throw new BadRequestException('ÄÆ¡n hÃ ng khÃ´ng tá»“n táº¡i');
        }
        return this.thanhtoanRepository.createPayment(createPaymentDto);
    }
    //láº¥y danh sÃ¡ch thanh toÃ¡n
    async getPaymentList() {
        return this.thanhtoanRepository.findAllPayments();
    }
    //láº¥y thanh toÃ¡n theo id
    async getPaymentById(id: string) {
        return this.thanhtoanRepository.findPaymentDetailById(id);
    }
}
