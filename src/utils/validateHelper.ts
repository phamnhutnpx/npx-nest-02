import { Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidationService {
  isValidId(id: string): boolean {
    return isValidObjectId(id);
  }

  // Kiểm tra id và trả về thông báo tùy thuộc vào kết quả
  checkValidId(id: string): string {
    if (!this.isValidId(id)) {
      return 'ID không hợp lệ';
    }
    return null; // Trả về null nếu id hợp lệ
  }
}
