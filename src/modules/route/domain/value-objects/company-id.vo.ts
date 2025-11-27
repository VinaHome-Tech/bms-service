export class CompanyIdVO {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Company ID is required');
    }
  }

  getValue(): string {
    return this.value;
  }
}
