/** This file enables code intellisense for model Project. */
import { Model, Document, ObjectId } from "mongoose";
import { IComment } from "../base";

interface IReportedComment {
    comment: IComment;
    reporterId: ObjectId;
    reportDate: Date;
}

export declare const ReportedComment: Model<IReportedComment & Document>;