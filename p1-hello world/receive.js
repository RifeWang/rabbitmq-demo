// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function(err, conn) {
//     conn.createChannel(function(err, ch) {
//         var q = 'hello';

//         ch.assertQueue(q, {durable: false});    //声明接受消息的队列
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
//         ch.consume(q, function(msg) {    //确认队列存在，然后接受消息
//             console.log(" [x] Received %s", msg.content.toString());
//         }, {noAck: true});
//     });
// });


const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();  //建立信道
        const queueName = 'hello';  
        await ch.assertQueue(queueName, { durable: false });  //声明队列，durable：false 不对队列持久化
        console.log(" [*] Waiting for messages in queue: %s. To exit press CTRL+C", queueName);
        ch.consume(queueName, msg => {   //订阅队列接受消息
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });   // noAck：true 不进行确认接受应答
    } catch (error) {
        console.log(error);
    }
})()