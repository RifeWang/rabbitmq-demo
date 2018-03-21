// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         var q = 'rpc_queue';

//         ch.assertQueue(q, { durable: false });
//         ch.prefetch(1);
//         console.log(' [x] Awaiting RPC requests');
//         ch.consume(q, function reply(msg) {
//             var n = parseInt(msg.content.toString());

//             console.log(" [.] fib(%d)", n);

//             var r = fibonacci(n);

//             ch.sendToQueue(msg.properties.replyTo,
//                 new Buffer(r.toString()),
//                 { correlationId: msg.properties.correlationId });

//             ch.ack(msg);
//         });
//     });
// });



const amqp = require('amqplib');

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();   //建立信道
        const q = 'rpc_queue';

        await ch.assertQueue(q, { durable: false });  //声明队列
        await ch.prefetch(1);   //每次最大接收消息数量
        console.log(' [x] Awaiting RPC requests');
        
        ch.consume(q, function reply(msg) {     //订阅 RPC 队列接收请求
            const n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);
            const r = fibonacci(n);    //调用本地函数计算结果

            ch.sendToQueue(msg.properties.replyTo,    //将 RPC 请求结果发送到 callback 队列
                new Buffer(r.toString()),
                { correlationId: msg.properties.correlationId }
            );

            ch.ack(msg);
        });
    } catch (error) {
        console.log(error);
    }
})();

function fibonacci(n) {   //时间复杂度比较高
    let cache = {};
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}

// function fibonacci(n) {    // O(n)
//     if (n < 2) return n;
//     let a = 0, b = 1;
//     while (--n) {
//         var t = a + b;
//         a = b;
//         b = t;
//     }
//     return b;
// }