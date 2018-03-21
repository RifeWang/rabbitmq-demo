// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function(err, conn) {   //创建连接
//     conn.createChannel(function(err, ch) {   //创建channel
//         var q = 'hello';
//         var msg = 'Hello World!';

//         ch.assertQueue(q, {durable: false});   //声明一个队列，不存在则创建，durable: 消息队列持久化

//         ch.sendToQueue(q, new Buffer(msg));    //向队列里发送消息

//         console.log(" [x] Sent %s", msg);
//     });
//     setTimeout(function() { conn.close(); process.exit(0) }, 500);  //因为异步的原因消息并未发送完成就关闭连接会导致消费者接收不到消息
// });

const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();     //建立信道
        const queueName = 'hello';   
        const msg = 'Hello world';
        await ch.assertQueue(queueName, { durable: false });   //声明队列，durable：false 不对队列持久化
        ch.sendToQueue(queueName, new Buffer(msg));   //发送消息
        console.log(' [x] Sent %s', msg);
        await ch.close();   //关闭信道
        await conn.close();  //关闭连接
    } catch (error) {
        console.log(error);   
    }
})()