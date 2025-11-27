export class RouteIdVO {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Route ID is required');
    }
  }

  getValue(): string {
    return this.value;
  }
}
