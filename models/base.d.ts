import { Schema, Model, Document, ObjectId } from "mongoose";

export declare interface IComment {
    targetId: ObjectId;
    userId: ObjectId;
    comment: string;
}

export declare interface IRequest {
    userId: ObjectId;
    info: string;
}

export declare const CommentSchema: Schema<IComment>;
export declare const RequestSchema: Schema<IRequest>;