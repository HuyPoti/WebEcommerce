import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TinhtrangDonhangRepository } from 'src/common/repositories/tinhtrangdonhang.repository';
import {
  CreateTinhtrangDonhangDto,
  UpdateTinhtrangDonhangDto,
  TinhtrangDonhangResponseDto,
  TinhtrangDonhangHistoryDto,
  TinhtrangDonhangStatsDto,
  TrangThaiDonHang,
} from './dto/tinhtrangdonhang.dto';

@Injectable()
export class TinhtrangDonhangService {
  constructor(
    private readonly tinhtrangDonhangRepository: TinhtrangDonhangRepository
  ) {}

  /**
   * Táº¡o tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng má»›i
   */
  async createOrderStatus(
    createDto: CreateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    // Kiá»ƒm tra Ä‘Æ¡n hÃ ng tá»“n táº¡i
    const orderExists = await this.tinhtrangDonhangRepository.orderExists(
      createDto.MaDH
    );

    if (!orderExists) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Táº¡o tÃ¬nh tráº¡ng má»›i
    const orderStatus = await this.tinhtrangDonhangRepository.createOrderStatus({
      MaDH: createDto.MaDH,
      TrangThai: createDto.TrangThai,
    });

    return this.mapToResponseDto(orderStatus);
  }

  /**
   * Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng (táº¡o báº£n ghi má»›i)
   */
  async updateOrderStatus(
    MaDH: string,
    updateDto: UpdateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    // Kiá»ƒm tra Ä‘Æ¡n hÃ ng tá»“n táº¡i
    const order = await this.tinhtrangDonhangRepository.getOrder(MaDH);

    if (!order) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i
    const currentStatus = await this.tinhtrangDonhangRepository.getCurrentOrderStatus(
      MaDH
    );

    // Kiá»ƒm tra logic chuyá»ƒn tráº¡ng thÃ¡i
    if (currentStatus) {
      this.validateStatusTransition(
        currentStatus.TrangThai as TrangThaiDonHang,
        updateDto.TrangThai
      );
    }

    // Táº¡o báº£n ghi tráº¡ng thÃ¡i má»›i
    const newStatus = await this.tinhtrangDonhangRepository.updateOrderStatus(
      MaDH,
      updateDto.TrangThai
    );

    return this.mapToResponseDto(newStatus);
  }

  /**
   * Láº¥y táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng
   */
  async getAllOrderStatuses(
    MaDH?: string,
    TrangThai?: TrangThaiDonHang,
    page: number = 1,
    limit: number = 50
  ) {
    const skip = (page - 1) * limit;

    const { statuses, total } = await this.tinhtrangDonhangRepository.findAllOrderStatuses({
      MaDH,
      TrangThai,
      skip,
      take: limit,
    });

    return {
      statuses: statuses.map(status => this.mapToResponseDto(status)),
      total,
    };
  }

  /**
   * Láº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng theo ID
   */
  async getOrderStatusById(
    MaTTDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    const orderStatus = await this.tinhtrangDonhangRepository.findOrderStatusById(
      MaTTDH
    );

    if (!orderStatus) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng');
    }

    return this.mapToResponseDto(orderStatus);
  }

  /**
   * Láº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i cá»§a Ä‘Æ¡n hÃ ng
   */
  async getOrderStatusHistory(
    MaDH: string
  ): Promise<TinhtrangDonhangHistoryDto> {
    const history = await this.tinhtrangDonhangRepository.getOrderStatusHistory(
      MaDH
    );

    if (history.length === 0) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng');
    }

    const currentStatus = history[history.length - 1];

    return {
      MaDH,
      history: history.map(status => this.mapToResponseDto(status)),
      total: history.length,
      currentStatus: currentStatus.TrangThai as TrangThaiDonHang,
    };
  }

  /**
   * Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i cá»§a Ä‘Æ¡n hÃ ng
   */
  async getCurrentOrderStatus(
    MaDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    const currentStatus = await this.tinhtrangDonhangRepository.getCurrentOrderStatus(
      MaDH
    );

    if (!currentStatus) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng');
    }

    return this.mapToResponseDto(currentStatus);
  }

  /**
   * XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng
   */
  async deleteOrderStatus(MaTTDH: string): Promise<{ message: string }> {
    const existingStatus = await this.tinhtrangDonhangRepository.findOrderStatusById(
      MaTTDH
    );

    if (!existingStatus) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng');
    }

    await this.tinhtrangDonhangRepository.deleteOrderStatus(MaTTDH);

    return {
      message: 'XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    };
  }

  /**
   * XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng cá»§a má»™t Ä‘Æ¡n hÃ ng
   */
  async deleteAllOrderStatuses(MaDH: string): Promise<{ message: string }> {
    const orderExists = await this.tinhtrangDonhangRepository.orderExists(
      MaDH
    );

    if (!orderExists) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    }

    await this.tinhtrangDonhangRepository.deleteAllOrderStatuses(MaDH);

    return {
      message: 'XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    };
  }

  /**
   * Láº¥y thá»‘ng kÃª tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
   */
  async getOrderStatusStatistics(): Promise<TinhtrangDonhangStatsDto> {
    return await this.tinhtrangDonhangRepository.getOrderStatusStatistics();
  }

  /**
   * Validate logic chuyá»ƒn tráº¡ng thÃ¡i
   */
  private validateStatusTransition(
    currentStatus: TrangThaiDonHang,
    newStatus: TrangThaiDonHang
  ): void {
    // KhÃ´ng cho phÃ©p chuyá»ƒn tá»« tráº¡ng thÃ¡i cuá»‘i
    if (
      currentStatus === TrangThaiDonHang.DA_GIAO ||
      currentStatus === TrangThaiDonHang.HUY ||
      currentStatus === TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        `KhÃ´ng thá»ƒ chuyá»ƒn tráº¡ng thÃ¡i tá»« ${currentStatus} sang ${newStatus}`
      );
    }

    // Logic chuyá»ƒn tráº¡ng thÃ¡i há»£p lá»‡
    const validTransitions: Record<TrangThaiDonHang, TrangThaiDonHang[]> = {
      [TrangThaiDonHang.CHUA_GIAO]: [
        TrangThaiDonHang.DANG_GIAO,
        TrangThaiDonHang.HUY,
      ],
      [TrangThaiDonHang.DANG_GIAO]: [
        TrangThaiDonHang.DA_GIAO,
        TrangThaiDonHang.LOI,
        TrangThaiDonHang.HUY,
      ],
      [TrangThaiDonHang.LOI]: [
        TrangThaiDonHang.XAC_NHAN_LOI,
        TrangThaiDonHang.DANG_GIAO,
      ],
      [TrangThaiDonHang.DA_GIAO]: [],
      [TrangThaiDonHang.HUY]: [],
      [TrangThaiDonHang.XAC_NHAN_LOI]: [],
    };

    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `KhÃ´ng thá»ƒ chuyá»ƒn tráº¡ng thÃ¡i tá»« ${currentStatus} sang ${newStatus}. ` +
        `CÃ¡c tráº¡ng thÃ¡i há»£p lá»‡: ${allowedStatuses.join(', ')}`
      );
    }
  }

  /**
   * Map dá»¯ liá»‡u tá»« Prisma sang DTO
   */
  private mapToResponseDto(orderStatus: any): TinhtrangDonhangResponseDto {
    return {
      MaTTDH: orderStatus.MaTTDH,
      created_at: orderStatus.created_at,
      TrangThai: orderStatus.TrangThai,
      MaDH: orderStatus.MaDH,
      DONHANG: orderStatus.DONHANG ? {
        MaDH: orderStatus.DONHANG.MaDH,
        TongTien: orderStatus.DONHANG.TongTien,
        created_at: orderStatus.DONHANG.created_at,
      } : null,
    };
  }
}
