// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var q = 'task_queue';

//         ch.assertQueue(q, { durable: true });
//         ch.prefetch(1);  // prefetch : rabbitmq 一次传递不超过指定数量的消息，直到之前的消息被 ack 完成（为了确保任务被均匀的消费，避免一个 worker 很忙而另一个却很闲）
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
//         ch.consume(q, function (msg) {
//             var secs = msg.content.toString().split('.').length - 1;

//             console.log(" [x] Received %s", msg.content.toString());
//             setTimeout(function () {
//                 console.log(" [x] Done");
//                 ch.ack(msg);
//             }, secs * 1000);
//         }, { noAck: false });
//     });
// });

const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();    //建立信道
        const queueName = 'task_queue';
        await ch.assertQueue(queueName, { durable: true });   //声明队列
        ch.prefetch(1);  //每次接收不超过指定数量的消息
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);

        ch.consume(queueName, msg => {
            const secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(() => {   //根据小数点的个数设置延时时长
                console.log(" [x] Done");
                ch.ack(msg);    //确认接收消息
            }, secs * 1000);
        }, { noAck: false });   //对消息需要接收确认

    } catch (error) {
        console.log(error);
    }
})()