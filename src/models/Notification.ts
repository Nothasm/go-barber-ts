import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface INotification extends mongoose.Document {
    _id: string
    content: string
    user: string
    read: boolean
    createdAt: Date
    updatedAt: Date
}

const notificationSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);