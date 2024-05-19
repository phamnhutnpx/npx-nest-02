import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company, CompanySchema } from './schema/company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidationService } from 'src/utils/validateHelper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, ValidationService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
