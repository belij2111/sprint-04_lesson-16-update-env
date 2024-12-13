import { SecurityDevicesDocument } from '../../../domain/security-devices.entity';

export class SecurityDevicesViewModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(devices: SecurityDevicesDocument): SecurityDevicesViewModel {
    const model = new SecurityDevicesViewModel();
    model.ip = devices.ip;
    model.title = devices.deviceName;
    model.lastActiveDate = devices.iatDate;
    model.deviceId = devices.deviceId;
    return model;
  }
}
