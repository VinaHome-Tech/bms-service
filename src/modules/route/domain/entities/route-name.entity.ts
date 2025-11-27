export class RouteName {
    constructor(
        private readonly _id: string,
        private _route_name: string,
    ) { }
    get id(): string {
        return this._id;
    }

    get route_name(): string {
        return this._route_name;
    }

    rename(newName: string) {
        if (!newName || newName.trim().length === 0) {
            throw new Error('Route name cannot be empty');
        }
        this._route_name = newName.trim();
    }
}
