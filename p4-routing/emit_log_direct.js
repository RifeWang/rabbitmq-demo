// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var ex = 'direct_logs';
//         var args = process.argv.slice(2);
//         var msg = args.slice(1).join(' ') || 'Hello World!';
//         var severity = (args.length > 0) ? args[0] : 'info';

//         ch.assertExchange(ex, 'direct', { durable: false });
//         ch.publish(ex, severity, new Buffer(msg));  //severity as routing key
//         console.log(" [x] Sent %s: '%s'", severity, msg);
//     });

//     setTimeout(function () { conn.close(); process.exit(0) }, 500);
// });


const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();  //建立信道
        const ex = 'direct_logs';

        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || 'Hello World!';
        const severity = (args.length > 0) ? args[0] : 'info';

        await ch.assertExchange(ex, 'direct', { durable: false });  //声明 exchange ，类型为 direct
        ch.publish(ex, severity, new Buffer(msg));   //发送消息，参数：交换器、路由键、消息内容
        console.log(" [x] Sent %s: '%s'", severity, msg);
        
        await ch.close();   //关闭信道
        await conn.close();  //关闭连接
    } catch (error) {
        console.log(error);
    }
})();