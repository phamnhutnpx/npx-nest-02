import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ValidationService } from 'src/utils/validateHelper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private readonly validationService: ValidationService,
  ) {}

  // Handle hash password
  hashPassword(password: string) {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }
  // Create
  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.hashPassword(createUserDto.password);
    Object.assign(createUserDto, {
      password: hashPassword,
    });
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  findAll() {
    return this.userModel.find();
  }
  // Get user by id
  findOne(id: string) {
    const idErr = this.validationService.checkValidId(id);
    if (idErr) return idErr;

    return this.userModel.findOne({
      _id: id,
    });
  }
  // Get user by user name
  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }
  isValidPassword(passInput: string, passUser: string) {
    return compareSync(passInput, passUser);
  }

  // Update detail info
  async update(updateUserDto: UpdateUserDto) {
    const idErr = this.validationService.checkValidId(updateUserDto._id);
    if (idErr) return idErr;

    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      { ...updateUserDto },
    );
  }

  // Remove
  async remove(id: string) {
    const idErr = this.validationService.checkValidId(id);
    if (idErr) return idErr;
    return await this.userModel.softDelete({
      _id: id,
    });
  }
}
