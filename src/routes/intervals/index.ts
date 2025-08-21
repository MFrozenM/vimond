import {Response, Router} from "express";
import {ApiResponse, Request} from "@models/response";
import {PostIntervalsRequestModel, PostIntervalsReturnModel} from "./intervals.model";
import {IntervalCalculator} from "./IntervalCalculator";
import {TypedError} from "@core/TypedError";

const router = Router();

router.post("/intervals", (
    req: Request<PostIntervalsRequestModel>,
    res: Response<ApiResponse<PostIntervalsReturnModel>>
) => {
    const includes = req.body.includes;
    const excludes = req.body.excludes;

    try {
        const calculator = new IntervalCalculator(includes, excludes);
        const result = calculator.getFormattedResult();

        res.send({
            status: "success",
            data: {
                result
            }
        });
    } catch (error: any) {
        if (error instanceof TypedError) {
            res.status(400).send({
                status: "error",
                message: error.message
            });
        } else {
            res.status(500).send({
                status: "error",
                message: "An unexpected error occurred"
            });
        }
    }
});

export default router
