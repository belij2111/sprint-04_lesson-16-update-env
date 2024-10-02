import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('/testing/all-data')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    return this.testingService.deleteAllData();
  }
}
