// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var ex = 'logs';

//         ch.assertExchange(ex, 'fanout', { durable: false });

//         ch.assertQueue('', { exclusive: true }, function (err, q) {  // exclusive 连接关闭则 queue 被删除
//             console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//             ch.bindQueue(q.queue, ex, '');  //将 exchange 和 queue 绑定

//             ch.consume(q.queue, function (msg) {
//                 console.log(" [x] %s", msg.content.toString());
//             }, { noAck: true });
//         });
//     });
// });

const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();   //建立信道

        const ex = 'logs';
        await ch.assertExchange(ex, 'fanout', { durable: false });   //声明交换器
        const q = await ch.assertQueue('', { exclusive: true });   //声明队列，临时队列即用即删
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        await ch.bindQueue(q.queue, ex, '');   //绑定交换器和队列，参数：队列名、交换器名、绑定键值

        ch.consume(q.queue, msg => {   //订阅队列接收消息
            console.log(" [x] %s", msg.content.toString());
        }, { noAck: true });

    } catch (error) {
        console.log(error);
    }
})()
