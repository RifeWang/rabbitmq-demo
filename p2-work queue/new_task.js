// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var q = 'task_queue';
//         var msg = process.argv.slice(2).join(' ') || "Hello World!";

//         ch.assertQueue(q, { durable: true });  // durable 确保 queue 不会被丢失，即使 rabbitmq 重启。
//         ch.sendToQueue(q, new Buffer(msg), { persistent: true });  // persistent 确保消息持久化（rabbitmq 会把消息保存到磁盘，不能保证完全不丢失）
//         console.log(" [x] Sent '%s'", msg);
//     });
//     setTimeout(function () { conn.close(); process.exit(0) }, 500);
// });


const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();   //建立信道
        const queueName = 'task_queue';
        await ch.assertQueue(queueName, { durable: true });   //声明队列，durable：true 持久化队列

        for (let i = 1; i < 10; i++) {   //生成 9 条信息并在尾部添加小数点
            let msg = i.toString().padEnd(i+1, '.');
            ch.sendToQueue(queueName, new Buffer(msg), { persistent: true });   //发送消息，persistent：true 将消息持久化
            console.log(" [x] Sent '%s'", msg);
        }

        await ch.close();     //关闭信道
        await conn.close();    //关闭连接
    } catch (error) {
        console.log(error);
    }
})()