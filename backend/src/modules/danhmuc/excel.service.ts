import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
@Injectable()
export class ExcelService {
    async generateToExcel(data: any[], currentUserName: string): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('BÃ¡o cÃ¡o danh má»¥c sáº£n pháº©m');

        // Äá»‹nh nghÄ©a cÃ¡c cá»™t
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'TÃªn Danh Má»¥c', key: 'TenDanhMuc', width: 30 },
            { header: 'Tráº¡ng ThÃ¡i', key: 'trangThai', width: 15 },
            { header: 'Loáº¡i', key: 'loai', width: 15 },
        ];
        // worksheet.getRow(1).eachCell((cell) => {
        //     cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        //     cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: '366092' }
        //     };
        //     cell.alignment = { vertical: 'middle', horizontal: 'center' };
        //     cell.border = {
        //         top: { style: 'thin' },
        //         left: { style: 'thin' },
        //         bottom: { style: 'thin' },
        //         right: { style: 'thin' }
        //     };
        // });

        // worksheet.insertRow(1, ['BÃO CÃO DANH Má»¤C Sáº¢N PHáº¨M']);
        // worksheet.mergeCells('A1:D2');
        // const titleCell = worksheet.getCell('A1');
        // titleCell.font = { bold: true, size: 16 };
        // titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        // titleCell.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'D9EAD3' }
        // };

        // // ThÃªm thÃ´ng tin ngÆ°á»i xuáº¥t vÃ  ngÃ y xuáº¥t
        // const currentDate = new Date();
        // const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        // worksheet.addRow([]);
        // const infoRow = worksheet.addRow([`NgÆ°á»i xuáº¥t: ${currentUserName}`, `NgÃ y xuáº¥t: ${formattedDate}`]);
        // infoRow.getCell(3).font = { italic: true };
        // infoRow.getCell(4).font = { italic: true };
        // worksheet.mergeCells(`A${infoRow.number}:B${infoRow.number}`);
        // worksheet.mergeCells(`C${infoRow.number}:D${infoRow.number}`);
        // infoRow.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.getRow(1).values = ['Ten Danh Má»¥c', 'Tráº¡ng ThÃ¡i', 'Loáº¡i'];
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
                id: item.id,
                TenDanhMuc: item.TenDanhMuc,
                TrangThai: item.TrangThai ? 'Active' : 'Inactive',
                Loai: item.Loai,
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
