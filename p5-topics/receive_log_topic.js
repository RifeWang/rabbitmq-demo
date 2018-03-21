// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// var args = process.argv.slice(2);

// if (args.length == 0) {
//     console.log("Usage: receive_logs_topic.js <facility>.<severity>");
//     process.exit(1);
// }

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var ex = 'topic_logs';

//         ch.assertExchange(ex, 'topic', { durable: false });

//         ch.assertQueue('', { exclusive: true }, function (err, q) {
//             console.log(' [*] Waiting for logs. To exit press CTRL+C');

//             args.forEach(function (key) {
//                 ch.bindQueue(q.queue, ex, key);
//             });

//             ch.consume(q.queue, function (msg) {
//                 console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
//             }, { noAck: true });
//         });
//     });
// });


const amqp = require('amqplib');

(async () => {
    try {
        const args = process.argv.slice(2);
        if (args.length == 0) {
            console.log("Usage: receive_logs_topic.js <facility>.<severity>");
            process.exit(1);
        }

        const conn = await amqp.connect('amqp://localhost');    //建立连接
        const ch = await conn.createChannel();     //建立信道
        
        const ex = 'topic_logs';
        await ch.assertExchange(ex, 'topic', { durable: false });   //声明交换器
        const q = await ch.assertQueue('', { exclusive: true });    //声明队列
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        args.forEach(async key => {
            await ch.bindQueue(q.queue, ex, key);   //绑定交换器和队列
        });

        ch.consume(q.queue, msg => {    //订阅队列接收消息
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        }, { noAck: true });
    } catch (error) {
        console.log(error);
    }
})()