export class RouteNameVO {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Route name is required');
    }

    if (value.length > 255) {
      throw new Error('Route name is too long');
    }
  }

  getValue(): string {
    return this.value;
  }
}
