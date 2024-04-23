export class BaseController {
    protected sendResponse(res: any, code: number, data: object) {
        return res.status(code).json(data);
    }
}
