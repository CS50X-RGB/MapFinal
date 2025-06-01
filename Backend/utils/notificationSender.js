import axios from "axios";
import { AWS_NOTIFCATION_SERVER } from "../data/config.js";

export default async function sendNotificationSendAll(userId, message) {
    try {
        const sendObj = {
            user_id: userId,
            message
        };

        const response = await axios.post(`${AWS_NOTIFCATION_SERVER}/publish`, sendObj);

        console.log("Notification sent:", response.data);
        console.log("Status Code:", response.status);

        return {
            data: response.data,
            status: response.status
        };
    } catch (e) {
        console.error("Failed to send notification:", e.message);

        if (e.response) {
            console.error("Error Status:", e.response.status);
            return {
                error: e.message,
                status: e.response.status
            };
        }

        throw e;
    }
}
