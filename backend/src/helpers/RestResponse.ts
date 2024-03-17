export class RestResponse {
  public static success(res: any, message: string, data: any = null) {
    return res.json({
      message,
      data,
    });
  }

  public static error(res: any, message: string) {
    return res.status(400).json({
      message,
    });
  }
}
