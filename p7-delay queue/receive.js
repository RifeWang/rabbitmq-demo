

// const amqp = require('amqplib');

// (async () => {
//     try {
//         const conn = await amqp.connect('amqp://localhost');   //建立连接
//         const ch = await conn.createChannel();  //建立信道
//         const queueName = 'delay-queue-consumer';  
//         const ex = 'delay-exchange';
//         await ch.assertExchange(ex, 'direct', { durable: false });   //声明 exchange ，类型为 direct ，不持久化
//         await ch.assertQueue(queueName, { durable: false });  //声明队列，durable：false 不对队列持久化
//         await ch.bindQueue(queueName, ex, 'delay-router-key');  //绑定交换器和队列
        
//         console.log(" [*] Waiting for messages in queue: %s. To exit press CTRL+C", queueName);
//         ch.consume(queueName, msg => {   //订阅队列接受消息
//             console.log(" [x] Received %s", msg.content.toString());
//         }, { noAck: true });   // noAck：true 不进行确认接受应答
//     } catch (error) {
//         console.log(error);
//     }
// })()




const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();  //建立信道
        const queueName = 'delay-queue-consumer';  
        await ch.assertQueue(queueName, { durable: false });  //声明队列，durable：false 不对队列持久化
        console.log(" [*] Waiting for messages in queue: %s. To exit press CTRL+C", queueName);

        ch.consume(queueName, msg => {   //订阅队列接受消息
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });   // noAck：true 不进行确认接受应答
        
    } catch (error) {
        console.log(error);
    }
})()