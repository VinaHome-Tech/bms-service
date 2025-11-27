export class RouteNameCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly route_name: string,
  ) {}
}
