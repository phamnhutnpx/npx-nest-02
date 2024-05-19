import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Định dạng email không đúng' })
  @IsNotEmpty({ message: 'Email không được để trốnng' })
  email: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  createAt: Date;
  updateAt: Date;
}
