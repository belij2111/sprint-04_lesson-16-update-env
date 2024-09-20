import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from '../application/testing.service';
import { appSettings } from '../../../settings/config';

@Controller(appSettings.getPath().TESTING)
export class TestingController {
  constructor(private readonly testingService: TestingService) {}
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    return this.testingService.deleteAllData();
  }
}
