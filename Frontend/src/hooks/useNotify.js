import { useEffect } from "react";
import { toast } from "sonner";

export default function useNotify(userId, setMessage) {
    useEffect(() => {
        if (!userId) return; 
        const ws = new WebSocket(`http://13.233.34.140:8082/subscribe?user_id=${userId}`);
        ws.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        ws.onmessage = (event) => {
            console.log("📨 Message received:", event.data);
            toast.success(event.data,{
                position : "top-right",
            });
            setMessage(event.data); 
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("🛑 WebSocket closed");
        };

        return () => {
            ws.close();
        };
    }, [userId, setMessage]);
}
