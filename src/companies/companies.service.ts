import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { ValidationService } from 'src/utils/validateHelper';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    private readonly validationService: ValidationService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const createdCompany = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return createdCompany;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string) {
    return this.companyModel.findOne({ _id: id });
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    const idErr = this.validationService.checkValidId(updateCompanyDto._id);
    if (idErr) return idErr;

    return await this.companyModel.updateOne(
      {
        _id: updateCompanyDto._id,
      },
      { ...updateCompanyDto },
    );
  }

  async remove(id: string, user: IUser) {
    const idErr = this.validationService.checkValidId(id);
    if (idErr) return idErr;

    await this.companyModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.companyModel.softDelete({ _id: id });
  }

  uploadFile(file: Express.Multer.File) {
    return {
      fileName: file.filename,
      path: file.path,
    };
  }
}
