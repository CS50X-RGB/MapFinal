import PushNotifications from "@pusher/push-notifications-server";


const beamsClient = new PushNotifications({
        instanceId: "c41a756e-0c26-4252-9373-43bff3466a8b",
        secretKey: "B28F08010F5773E93A0CD71CC50B528AED7A6ACFAB2D95BAA2541B8559C2E51B",
});


export const sendNotification = async (req, res) => {
        try {
                const { intersts, title, message } = req.body;
                console.log(typeof (intersts));
                const publishResponse = await beamsClient.publishToInterests(
                        [intersts],
                        {
                                web: {
                                        notification: {
                                                title: title,
                                                body: message,
                                                deep_link: "https://map-0-share.vercel.app/main",
                                        },
                                },
                        }
                );

                console.log("Sent notification", publishResponse);
                res.status(200).json({
                        message: 'Notification sent',
                })
        } catch (error) {
                console.error("Error sending notification:", error);
                res.status(500).json({ error: "Internal Server Error" });
        }
}


export default { sendNotification};