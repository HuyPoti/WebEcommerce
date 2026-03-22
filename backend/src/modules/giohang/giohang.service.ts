import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GiohangRepository } from 'src/common/repositories/giohang.repository';
import {
  AddToCartDto,
  UpdateQuantityDto,
} from './dto/giohang.dto';

@Injectable()
export class GiohangService {
  constructor(
    private prisma: PrismaService,
    private giohangRepository: GiohangRepository,
  ) {}

  //táº¡o giá» hÃ ng
  async createCart(MaTKKH: string) {
    const cart = await this.giohangRepository.createCart({ MaTKKH });
    return cart;
  }
  // Láº¥y hoáº·c táº¡o giá» hÃ ng cho user
  private async getCart(MaTKKH: string) {
    let cart = await this.giohangRepository.findCartByUserId(MaTKKH);
    // console.log('cart', cart);
    if (!cart) {
      throw new BadRequestException('KhÃ´ng tÃ¬m tháº¥y giá» hÃ ng cho ngÆ°á»i dÃ¹ng nÃ y');
    }
    return cart;
  }

  // Cáº­p nháº­t sáº£n pháº©m vÃ o giá» hÃ ng
  async updateCart(MaTKKH: string, addToCartDto: AddToCartDto[]) {
    const cart = await this.getCart(MaTKKH);
    if (!cart) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y giá» hÃ ng cho ngÆ°á»i dÃ¹ng nÃ y');
    }
    if (!addToCartDto || addToCartDto.length === 0) {
      const result = await this.clearCart(MaTKKH);
      if (!result){
        throw new Error('XÃ³a giá» hÃ ng tháº¥t báº¡i');
      }
      return result;
    }
    for (const item of addToCartDto) {
      const { MaCTSP, SoLuong } = item;
      const chiTietSanPham = await this.prisma.cHITIETSANPHAM.findFirst({
        where: { MaCTSP },
      });
      console.log('chiTietSanPham', chiTietSanPham);
      if (!chiTietSanPham) {
        throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y chi tiáº¿t sáº£n pháº©m');
      }
      // Kiá»ƒm tra sá»‘ lÆ°á»£ng tá»“n kho cá»§a cÃ¡c sáº£n pháº©m
      if (!SoLuong) {
        throw new BadRequestException('Sá»‘ lÆ°á»£ng lÃ  báº¯t buá»™c');
      }
      if (chiTietSanPham.SoLuong < SoLuong) {
        throw new BadRequestException(
          `KhÃ´ng Ä‘á»§ hÃ ng trong kho. Chá»‰ cÃ²n ${chiTietSanPham.SoLuong} sáº£n pháº©m`,
        );
      }
      //kiá»ƒm tra sáº£n pháº©m Ä‘Ã£ cÃ³ trong giá» hÃ ng chÆ°a
      if (!MaCTSP){
        throw new BadRequestException('MÃ£ chi tiáº¿t sáº£n pháº©m lÃ  báº¯t buá»™c');
      }
      const existingCartItem =
        await this.giohangRepository.findCartItemByProductDetail(
          cart.MaGH,
          MaCTSP,
        );

      if (existingCartItem) {
        // Cáº­p nháº­t sá»‘ lÆ°á»£ng
        const updatedCartItem = await this.giohangRepository.updateCartItemQuantity(
          existingCartItem.MaCTGH,
          SoLuong,
        );
        console.log('Updated Cart Item:', updatedCartItem);
      } else {
        // ThÃªm sáº£n pháº©m má»›i vÃ o giá»
        if (!MaCTSP) {
          throw new BadRequestException('MÃ£ chi tiáº¿t sáº£n pháº©m lÃ  báº¯t buá»™c');
        }
        const newCartItem = await this.giohangRepository.createCartItem({
          MaGH: cart.MaGH,
          MaCTSP,
          SoLuong,
        });
        console.log('New Cart Item:', newCartItem);
      }
    }
    const rowCartItems = await this.giohangRepository.findAllCartItems(
      cart.MaGH,
    );
    for (const item of rowCartItems) {
      if (!addToCartDto.find(i => i.MaCTSP === item.CHITIETSANPHAM.MaCTSP)) {
        await this.giohangRepository.deleteCartItem(item.MaCTGH);
      } 
    }
    return { message: 'Cáº­p nháº­t giá» hÃ ng thÃ nh cÃ´ng' };
  }

  // Láº¥y táº¥t cáº£ sáº£n pháº©m trong giá» hÃ ng
  async getCartItems(MaTKKH: string){
    const cart = await this.getCart(MaTKKH);
    const rawCartItems = await this.giohangRepository.findAllCartItems(
      cart.MaGH,
    );
    const cartItems = rawCartItems.map((item) => ({
      productId: item.CHITIETSANPHAM.MaCTSP,
      name: item.CHITIETSANPHAM.SANPHAM.TenSP,
      price: item.CHITIETSANPHAM.SANPHAM.GiaBan,
      quantity: item.SoLuong,
      size: item.CHITIETSANPHAM.KichCo,
      color: item.CHITIETSANPHAM.SANPHAM.MauSac,
      image: item.CHITIETSANPHAM.SANPHAM.HinhAnh[0],
    }));

    return cartItems;
  }

  // // Cáº­p nháº­t sá»‘ lÆ°á»£ng sáº£n pháº©m trong giá»
  // async updateQuantity(MaCTGH: string, updateQuantityDto: UpdateQuantityDto) {
  //   const { SoLuong } = updateQuantityDto;

  //   const cartItem = await this.giohangRepository.findCartItemById(MaCTGH);

  //   if (!cartItem) {
  //     throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng');
  //   }

  //   // Kiá»ƒm tra sá»‘ lÆ°á»£ng tá»“n kho
  //   if (cartItem.CHITIETSANPHAM.SoLuong < SoLuong) {
  //     throw new BadRequestException(
  //       `KhÃ´ng Ä‘á»§ hÃ ng trong kho. Chá»‰ cÃ²n ${cartItem.CHITIETSANPHAM.SoLuong} sáº£n pháº©m`,
  //     );
  //   }

  //   return await this.giohangRepository.updateCartItemQuantity(MaCTGH, SoLuong);
  // }

  // // XÃ³a sáº£n pháº©m khá»i giá» hÃ ng
  // async removeFromCart(MaCTGH: string) {
  //   const cartItem = await this.giohangRepository.findCartItemById(MaCTGH);

  //   if (!cartItem) {
  //     throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng');
  //   }

  //   await this.giohangRepository.deleteCartItem(MaCTGH);

  //   return { message: 'ÄÃ£ xÃ³a sáº£n pháº©m khá»i giá» hÃ ng' };
  // }

  // // Láº¥y sáº£n pháº©m Ä‘á»ƒ chuáº©n bá»‹ mua (checkout)
  // async getItemsForPurchase(MaTKKH: string) {
  //   const cartData = await this.getCartItems(MaTKKH);

  //   if (cartData.items.length === 0) {
  //     throw new BadRequestException('Giá» hÃ ng trá»‘ng');
  //   }

  //   // Kiá»ƒm tra tá»“n kho cho táº¥t cáº£ sáº£n pháº©m
  //   const validation = await this.giohangRepository.validateStockForCheckout(
  //     cartData.MaGH,
  //   );

  //   if (!validation.isValid) {
  //     const outOfStockNames = validation.outOfStockItems
  //       .map((item) => item.TenSP)
  //       .join(', ');
  //     throw new BadRequestException(
  //       `CÃ¡c sáº£n pháº©m sau khÃ´ng Ä‘á»§ hÃ ng: ${outOfStockNames}`,
  //     );
  //   }

  //   return {
  //     ...cartData,
  //     readyForPurchase: true,
  //     message: 'Táº¥t cáº£ sáº£n pháº©m sáºµn sÃ ng Ä‘á»ƒ mua',
  //   };
  // }

  // XÃ³a toÃ n bá»™ giá» hÃ ng
  async clearCart(MaTKKH: string) {
    const cart = await this.getCart(MaTKKH);

    await this.giohangRepository.deleteAllCartItems(cart.MaGH);

    return { message: 'ÄÃ£ xÃ³a toÃ n bá»™ giá» hÃ ng' };
  }
}
