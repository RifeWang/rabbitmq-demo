// #!/usr/bin/env node

// var amqp = require('amqplib/callback_api');

// var args = process.argv.slice(2);

// if (args.length === 0) {
//     console.log("Usage: rpc_client.js num");
//     process.exit(1);
// }

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {
//         ch.assertQueue('', { exclusive: true }, function (err, q) {
//             var corr = generateUuid();
//             var num = parseInt(args[0]);

//             console.log(' [x] Requesting fib(%d)', num);

//             ch.consume(q.queue, function (msg) {
//                 if (msg.properties.correlationId === corr) {
//                     console.log(' [.] Got %s', msg.content.toString());
//                     setTimeout(function () { conn.close(); process.exit(0) }, 500);
//                 }
//             }, { noAck: true });

//             ch.sendToQueue('rpc_queue',
//                 new Buffer(num.toString()),
//                 { correlationId: corr, replyTo: q.queue });
//         });
//     });
// });


const amqp = require('amqplib');

(async () => {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.log("Usage: rpc_client.js num");
            process.exit(1);
        }

        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();  //建立信道
        const q = await ch.assertQueue('', { exclusive: true });    //声明一个临时队列作为 callback 接收结果
                    
        const corr = generateUuid();
        const num = parseInt(args[0]);
        console.log(' [x] Requesting fib(%d)', num);

        ch.consume(q.queue, async (msg) => {   //订阅 callback 队列接收 RPC 结果
            if (msg.properties.correlationId === corr) {    //根据 correlationId 判断是否为请求的结果
                console.log(' [.] Got %s', msg.content.toString());
                await ch.close();   //关闭信道
                await conn.close();    //关闭连接
            }
        }, { noAck: true });

        ch.sendToQueue('rpc_queue',       //发送 RPC 请求
            new Buffer(num.toString()),
            {   
                correlationId: corr,      // correlationId 将 RPC 结果与对应的请求关联，replyTo 指定结果返回的队列
                replyTo: q.queue 
            }    
        );
    } catch (error) {
        console.log(error);
    }
})();

function generateUuid() {     //唯一标识
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
