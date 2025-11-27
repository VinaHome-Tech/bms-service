import { RouteNameVO } from '../value-objects/route-name.vo';

export class RouteNameDomainService {
  ensureValidName(name: RouteNameVO) {
    // ví dụ sau này bạn có nhiều rule hơn thì gom vào đây
    if (!name.getValue().match(/[a-zA-Z]/)) {
      throw new Error('Route name must contain at least one letter');
    }
  }
}
