export class ResponseResult<T> {
  constructor(
    public readonly success: boolean,
    public readonly statusCode: number = 200,
    public readonly message: string = 'Success',
    public readonly result: T,

  ) {}
}
