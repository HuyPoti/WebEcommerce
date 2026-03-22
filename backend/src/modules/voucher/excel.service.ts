import * as ExcelJS from 'exceljs';
export class ExcelService {
    async generateToExcel(data: any[]): Promise<Buffer> {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('BÃ¡o cÃ¡o voucher');
    
            // Äá»‹nh nghÄ©a cÃ¡c cá»™t
            worksheet.columns = [
                { header: 'TÃªn Voucher', key: 'TenVoucher', width: 30 },
                { header: 'GiÃ¡ Trá»‹', key: 'SoTien', width: 15 },
                { header: 'FreeShip', key: 'FreeShip', width: 15 },
                { header: 'NgÃ y Báº¯t Äáº§u', key: 'NgayBatDau', width: 15 },
                { header: 'NgÃ y Káº¿t ThÃºc', key: 'NgayKetThuc', width: 15 },
                { header: 'Äiá»u Kiá»‡n', key: 'DieuKien', width: 15 },
                { header: 'Tráº¡ng ThÃ¡i', key: 'TrangThai', width: 15 },
                    ];
                    worksheet.getRow(1).values = ['TÃªn Voucher', 'GiÃ¡ Trá»‹', 'FreeShip', 'NgÃ y Báº¯t Äáº§u', 'NgÃ y Káº¿t ThÃºc', 'Äiá»u Kiá»‡n', 'Tráº¡ng ThÃ¡i'];
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '366092' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
                };
            });
            // ThÃªm dá»¯ liá»‡u vÃ o worksheet
            data.forEach((item, index) => {
                const row = worksheet.addRow({
                    TenVoucher: item.TenVoucher,
                    SoTien: item.SoTien,
                    FreeShip: item.FreeShip ? 'CÃ³' : 'KhÃ´ng',
                    NgayBatDau: item.NgayBatDau ? new Date(item.NgayBatDau).toLocaleDateString() : '',
                    NgayKetThuc: item.NgayKetThuc ? new Date(item.NgayKetThuc).toLocaleDateString() : '',
                    DieuKien: item.DieuKien,
                    TrangThai: item.TrangThai,
                });
    
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
                if (index % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F2F2F2' }
                    };
                }
            });
            //auto-fit width
            worksheet.columns.forEach(column => {
                if (column.key) {
                    let maxLength = 0;
                    const columnKey = column.key;
                    
                    worksheet.eachRow((row) => {
                    const cell = row.getCell(columnKey);
                    const cellValue = cell.value ? cell.value.toString() : '';
                    if (cellValue.length > maxLength) {
                        maxLength = cellValue.length;
                    }
                    });
                    
                    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
                }
            });
            // Táº¡o buffer tá»« workbook
            const buffer = await workbook.xlsx.writeBuffer();
            return Buffer.from(buffer);
        } 
}
