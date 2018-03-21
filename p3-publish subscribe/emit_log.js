// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var ex = 'logs';
//         var msg = process.argv.slice(2).join(' ') || 'Hello World!';

//         ch.assertExchange(ex, 'fanout', { durable: false });  //定义 exchange 名称和类型
//         ch.publish(ex, '', new Buffer(msg));  
//         console.log(" [x] Sent %s", msg);
//     });

//     setTimeout(function () { conn.close(); process.exit(0) }, 500);
// });


const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();  //建立信道
        const ex = 'logs';
        const msg = process.argv.slice(2).join(' ') || 'Hello World!';

        await ch.assertExchange(ex, 'fanout', { durable: false });   //声明 exchange ，类型为 fanout ，不持久化
        ch.publish(ex, '', new Buffer(msg));   //发送消息，fanout 类型无需指定 routing key
        console.log(" [x] Sent %s", msg);

        await ch.close();   //关闭信道
        await conn.close();  //关闭连接
    } catch (error) {
        console.log(error);
    }
})();