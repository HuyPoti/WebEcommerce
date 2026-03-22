import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DonhangRepository } from 'src/common/repositories/donhang.repository';
import {
  CreateDonhangDto,
  UpdateDonhangStatusDto,
  TrangThaiDonHang,
} from './dto/donhang.dto';

@Injectable()
export class DonhangService {
  constructor(private readonly donhangRepository: DonhangRepository) {}

  /**
   * Táº¡o Ä‘Æ¡n hÃ ng má»›i
   */
  async createOrder(createDto: CreateDonhangDto) {
    // Láº¥y thÃ´ng tin chi tiáº¿t sáº£n pháº©m
    const productDetail = await this.donhangRepository.getProductDetail(
      createDto.MaCTSP,
    );

    if (!productDetail) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m');
    }

    // Kiá»ƒm tra sá»‘ lÆ°á»£ng trong kho
    if (productDetail.SoLuong < createDto.SoLuong) {
      throw new BadRequestException(
        `KhÃ´ng Ä‘á»§ hÃ ng trong kho. Sá»‘ lÆ°á»£ng cÃ²n láº¡i: ${productDetail.SoLuong}`,
      );
    }

    // Kiá»ƒm tra tráº¡ng thÃ¡i sáº£n pháº©m
    if (
      productDetail.TrangThaiSP === 'HET_HANG'
      // productDetail.TrangThaiSP === 'TAM_NGUNG'
    ) {
      throw new BadRequestException('Sáº£n pháº©m hiá»‡n khÃ´ng kháº£ dá»¥ng');
    }

    // // TÃ­nh tá»•ng tiá»n
    // let tongTien = productDetail.SANPHAM.GiaBan * createDto.SoLuong;
    // let discount = 0;

    // // Ãp dá»¥ng voucher náº¿u cÃ³
    // if (createDto.MaVoucher) {
    //   const voucher = await this.donhangRepository.getVoucher(
    //     createDto.MaVoucher,
    //   );

    //   if (!voucher) {
    //     throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y voucher');
    //   }

    //   if (voucher.TrangThai !== 'ACTIVE') {
    //     throw new BadRequestException('Voucher khÃ´ng cÃ²n hiá»‡u lá»±c');
    //   }

    //   // Kiá»ƒm tra Ä‘iá»u kiá»‡n Ã¡p dá»¥ng voucher
    //   if (voucher.Loai == 'GiamGia') {
    //     if (
    //       voucher.Dieukien != null &&
    //       voucher.SoTien != null &&
    //       tongTien < voucher.Dieukien
    //     ) {
    //       throw new BadRequestException(
    //         `ÄÆ¡n hÃ ng pháº£i Ä‘áº¡t tá»‘i thiá»ƒu ${voucher.Dieukien.toLocaleString('vi-VN')}Ä‘ Ä‘á»ƒ sá»­ dá»¥ng voucher nÃ y`,
    //       );
    //     }

    //     // Kiá»ƒm tra thá»i gian voucher
    //     const now = new Date();
    //     if (now < voucher.NgayBatDau || now > voucher.NgayKetThuc) {
    //       throw new BadRequestException(
    //         'Voucher Ä‘Ã£ háº¿t háº¡n hoáº·c chÆ°a Ä‘áº¿n thá»i gian sá»­ dá»¥ng',
    //       );
    //     }

    //     discount += voucher.SoTien || 0;
    //   } else if (voucher.Loai == 'FreeShip') {
    //     // Giáº£ sá»­ phÃ­ váº­n chuyá»ƒn cá»‘ Ä‘á»‹nh lÃ  30,000 VND
    //     const shippingFee = 30000;
    //     discount += shippingFee;
    //   }
    // }

    // Ãp dá»¥ng sá»± kiá»‡n Æ°u Ä‘Ã£i náº¿u cÃ³
    // if (createDto.MaSK) {
    //   const promotion = await this.donhangRepository.getPromotion(
    //     createDto.MaSK,
    //   );

    //   if (!promotion) {
    //     throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y sá»± kiá»‡n Æ°u Ä‘Ã£i');
    //   }

    //   if (promotion.TrangThai !== 'ACTIVE') {
    //     throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng cÃ²n hiá»‡u lá»±c');
    //   }

    //   // Kiá»ƒm tra thá»i gian sá»± kiá»‡n
    //   const now = new Date();
    //   if (now < promotion.NgayPH || now > promotion.NgayKT) {
    //     throw new BadRequestException(
    //       'Sá»± kiá»‡n Æ°u Ä‘Ã£i Ä‘Ã£ káº¿t thÃºc hoáº·c chÆ°a báº¯t Ä‘áº§u',
    //     );
    //   }

    //   // TÃ­nh pháº§n trÄƒm giáº£m giÃ¡
    //   const promotionDiscount = (tongTien * promotion.PhanTramGiam) / 100;
    //   discount += promotionDiscount;
    // }

    // // TÃ­nh tá»•ng tiá»n sau giáº£m giÃ¡
    // tongTien = Math.max(tongTien - discount, 0);

    // Táº¡o Ä‘Æ¡n hÃ ng
    const order = await this.donhangRepository.createOrder({
      MaDH: createDto.MaDH,
      SoLuong: createDto.SoLuong,
      TongTien: createDto.TongTien,
      MaCTSP: createDto.MaCTSP,
      MaTK_KH: createDto.MaTK_KH,
      MaVoucher: createDto.MaVoucher,
      MaSK: createDto.MaSK,
      TenNM: createDto.TenNM,
      SoDienThoai: createDto.SoDienThoai,
      DiaChi: createDto.DiaChi,
    });

    // Cáº­p nháº­t sá»‘ lÆ°á»£ng trong kho
    await this.donhangRepository.updateProductStock(
      createDto.MaCTSP,
      createDto.SoLuong,
    );

    return this.mapToResponseDto(order);
  }

  /**
   * Láº¥y danh sÃ¡ch táº¥t cáº£ Ä‘Æ¡n hÃ ng
   */
  async getAllOrders(MaTK_KH?: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const { orders, total } =
      await this.donhangRepository.findAllOrdersForCustomer({
        MaTK_KH,
        skip,
        take: limit,
      });

    return { orders, total };
  }

  async getAllOrderForStaff(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const orders = await this.donhangRepository.findAllOrdersForStaff({
      skip,
      take: limit,
    });
    return orders;
  }
  /**
   * Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng
   */
  async getOrderById(MaDH: string) {
    const order = await this.donhangRepository.findOrderById(MaDH);

    if (!order) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    return this.mapToResponseDto(order);
  }

  /**
   * Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
   */
  async updateOrderStatus(MaDH: string, updateDto: UpdateDonhangStatusDto) {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Kiá»ƒm tra logic chuyá»ƒn tráº¡ng thÃ¡i
    if (
      currentStatus === TrangThaiDonHang.HUY ||
      currentStatus === TrangThaiDonHang.DA_GIAO ||
      currentStatus === TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        'KhÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i cho Ä‘Æ¡n hÃ ng Ä‘Ã£ giao, Ä‘Ã£ há»§y hoáº·c Ä‘Ã£ xÃ¡c nháº­n lá»—i',
      );
    }

    const updatedOrder = await this.donhangRepository.updateOrderStatus(
      MaDH,
      updateDto.TrangThai,
    );

    return this.mapToResponseDto(updatedOrder);
  }

  /**
   * Há»§y Ä‘Æ¡n hÃ ng
   */
  async cancelOrder(MaDH: string) {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chá»‰ cho phÃ©p há»§y Ä‘Æ¡n hÃ ng chÆ°a giao hoáº·c Ä‘ang giao
    if (currentStatus === TrangThaiDonHang.DA_GIAO) {
      throw new BadRequestException('KhÃ´ng thá»ƒ há»§y Ä‘Æ¡n hÃ ng Ä‘Ã£ giao');
    }

    if (currentStatus === TrangThaiDonHang.HUY) {
      throw new BadRequestException('ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c há»§y trÆ°á»›c Ä‘Ã³');
    }

    if (currentStatus === TrangThaiDonHang.XAC_NHAN_LOI) {
      throw new BadRequestException('KhÃ´ng thá»ƒ há»§y Ä‘Æ¡n hÃ ng Ä‘Ã£ xÃ¡c nháº­n lá»—i');
    }

    // KhÃ´i phá»¥c sá»‘ lÆ°á»£ng sáº£n pháº©m trong kho
    await this.donhangRepository.restoreProductStock(
      existingOrder.MaCTSP,
      existingOrder.SoLuong,
    );

    // Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh HUY
    const cancelledOrder = await this.donhangRepository.cancelOrder(MaDH);

    return this.mapToResponseDto(cancelledOrder);
  }

  /**
   * XÃ³a Ä‘Æ¡n hÃ ng hoÃ n toÃ n
   */
  async deleteOrder(MaDH: string): Promise<{ message: string }> {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chá»‰ cho phÃ©p xÃ³a Ä‘Æ¡n hÃ ng Ä‘Ã£ há»§y, Ä‘Ã£ giao hoáº·c Ä‘Ã£ xÃ¡c nháº­n lá»—i
    if (
      currentStatus !== TrangThaiDonHang.HUY &&
      currentStatus !== TrangThaiDonHang.DA_GIAO &&
      currentStatus !== TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        'Chá»‰ cÃ³ thá»ƒ xÃ³a Ä‘Æ¡n hÃ ng Ä‘Ã£ giao, Ä‘Ã£ há»§y hoáº·c Ä‘Ã£ xÃ¡c nháº­n lá»—i',
      );
    }

    await this.donhangRepository.deleteOrder(MaDH);

    return {
      message: 'XÃ³a Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    };
  }

  /**
   * Láº¥y tá»•ng há»£p thÃ´ng tin Ä‘Æ¡n hÃ ng
   */
  async getOrderSummary(MaTK_KH?: string) {
    return await this.donhangRepository.getOrderSummary(MaTK_KH);
  }

  /**
   * Map dá»¯ liá»‡u tá»« Prisma sang DTO
   */
  private mapToResponseDto(order: any) {
    return {
      MaDH: order.MaDH,
      created_at: order.created_at,
      SoLuong: order.SoLuong,
      TongTien: order.TongTien,
      CHITIETSANPHAM: {
        MaCTSP: order.CHITIETSANPHAM.MaCTSP,
        KichCo: order.CHITIETSANPHAM.KichCo,
        SoLuong: order.CHITIETSANPHAM.SoLuong,
        SANPHAM: {
          MaSP: order.CHITIETSANPHAM.SANPHAM.MaSP,
          TenSP: order.CHITIETSANPHAM.SANPHAM.TenSP,
          GiaBan: order.CHITIETSANPHAM.SANPHAM.GiaBan,
          MoTa: order.CHITIETSANPHAM.SANPHAM.MoTa,
          MauSac: order.CHITIETSANPHAM.SANPHAM.MauSac,
          HinhAnh: order.CHITIETSANPHAM.SANPHAM.HinhAnh,
        },
      },
      VOUCHER: order.VOUCHER
        ? {
            MaVoucher: order.VOUCHER.MaVoucher,
            TenVoucher: order.VOUCHER.TenVoucher,
            SoTien: order.VOUCHER.SoTien,
            FreeShip: order.VOUCHER.FreeShip,
          }
        : null,
      SUKIENUUDAI: order.SUKIENUUDAI
        ? {
            MaSK: order.SUKIENUUDAI.MaSK,
            TenSK: order.SUKIENUUDAI.TenSK,
            PhanTramGiam: order.SUKIENUUDAI.PhanTramGiam,
          }
        : null,
      KHACHHANG_ACCOUNT: order.KHACHHANG_ACCOUNT
        ? {
            MaTK: order.KHACHHANG_ACCOUNT.MaTK,
            Username: order.KHACHHANG_ACCOUNT.Username,
            Avatar: order.KHACHHANG_ACCOUNT.Avatar,
          }
        : null,
      TINHTRANGDONHANG: order.TINHTRANGDONHANG.map((status: any) => ({
        MaTTDH: status.MaTTDH,
        TrangThai: status.TrangThai,
        created_at: status.created_at,
      })),
    };
  }

  // ThÃªm tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
  async addOrderStatus(body: { MaDH: string; TrangThai: TrangThaiDonHang }) {
    const existingOrder = await this.donhangRepository.findOrderById(
      body.MaDH,
    );

    if (!existingOrder) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Kiá»ƒm tra tráº¡ng thÃ¡i hiá»‡n táº¡i
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chá»‰ cho phÃ©p thÃªm tráº¡ng thÃ¡i náº¿u Ä‘Æ¡n hÃ ng chÆ°a hoÃ n táº¥t
    if (currentStatus === TrangThaiDonHang.DA_GIAO || currentStatus === TrangThaiDonHang.HUY) {
      throw new BadRequestException('KhÃ´ng thá»ƒ thÃªm tráº¡ng thÃ¡i cho Ä‘Æ¡n hÃ ng Ä‘Ã£ giao');
    }

    // ThÃªm tráº¡ng thÃ¡i má»›i
    const newStatus = await this.donhangRepository.addOrderStatus(body);

    return newStatus;
  }
}
