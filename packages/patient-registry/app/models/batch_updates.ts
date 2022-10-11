import config from "@amrs-integrations/core";
import { Consumer, Message, Producer } from "redis-smq";
import { getBatchUpdateData } from "./queries";

export async function bacthUpdate() {
    const toQueue = await getBatchUpdateData();
    toQueue.forEach((e: any) => {
        queueClientForBatchUpdate(e);
    })
}


function queueClientForBatchUpdate(payload: any) {
    const producer = new Producer();
    const message = new Message();
    message
        .setBody(JSON.stringify(payload))
        .setTTL(3600000) // in millis
        .setQueue("batch_update_queue");
    producer.produce(message, (err) => {
        if (err) console.log(err);
        else {
            const msgId = message.getId(); // string
            console.log("Successfully produced. Message ID is ", msgId);
        }
    });
    producer.shutdown();
}