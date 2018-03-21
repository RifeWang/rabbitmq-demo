// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var ex = 'topic_logs';
//         var args = process.argv.slice(2);
//         var key = (args.length > 0) ? args[0] : 'anonymous.info';
//         var msg = args.slice(1).join(' ') || 'Hello World!';

//         ch.assertExchange(ex, 'topic', { durable: false });
//         ch.publish(ex, key, new Buffer(msg));
//         console.log(" [x] Sent %s: '%s'", key, msg);
//     });

//     setTimeout(function () { conn.close(); process.exit(0) }, 500);
// });


const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();   //建立信道
        
        const ex = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World!';

        await ch.assertExchange(ex, 'topic', { durable: false });  //声明交换器
        ch.publish(ex, key, new Buffer(msg));   //发送消息，指定 routing key
        console.log(" [x] Sent %s: '%s'", key, msg);
        
        await ch.close();   //关闭信道
        await conn.close();  //关闭连接
    } catch (error) {
        console.log(error);
    }
})()