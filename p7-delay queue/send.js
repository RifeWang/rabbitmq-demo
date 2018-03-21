
// const amqp = require('amqplib');
// const EventEmitter = require('events');
// class MyEmitter extends EventEmitter {}
// const myEmitter = new MyEmitter();

// (async () => {
//     try {
//         const conn = await amqp.connect('amqp://localhost');   //建立连接
//         const ch = await conn.createChannel();     //建立信道

//         const msg = 'Hello world';
//         const ex = 'delay-exchange';
//         const queueName = 'delay-queue-consumer';  

//         await ch.assertExchange(ex, 'direct', { durable: false });   //声明 exchange ，类型为 direct ，不持久化
//         await ch.assertQueue(queueName, { durable: false });  //声明队列，durable：false 不对队列持久化
//         await ch.bindQueue(queueName, ex, 'delay-router-key');  //绑定交换器和队列

//         await ch.assertQueue('delay-queue', { 
//             durable: false,
//             deadLetterExchange: ex,   //直接使用默认交换器 
//             deadLetterRoutingKey: 'delay-router-key',   //默认交换器路由键就是队列名
//             messageTtl: 5000    //延时 ms
//         });   //定义队列

        
//         for (let i = 0; i < 5; i++) {
//             setTimeout(() => {
//                 ch.sendToQueue('delay-queue', new Buffer(msg+i));   //发送消息
//                 console.log(' [x] Sent %s', msg+i);
//                 if (i == 4) {
//                     myEmitter.emit('sent done');
//                 }
//             }, 2000*i)
//         }

//         myEmitter.on('sent done', async () => {
//             await ch.close();   //关闭信道
//             await conn.close();  //关闭连接
//         });
        
//     } catch (error) {
//         console.log(error);   
//     }
// })()



const amqp = require('amqplib');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

(async () => {
    try {
        const conn = await amqp.connect('amqp://localhost');   //建立连接
        const ch = await conn.createChannel();     //建立信道

        const msg = 'Hello world';
        const queueName = 'delay-queue-consumer';  
        await ch.assertQueue(queueName, { durable: false });  //消息延时结束后会被转发到此队列，消费者直接订阅此队列即可

        await ch.assertQueue('delay-queue-dead-letter', {   //定义死信队列
            durable: false,
            deadLetterExchange: '',   //直接使用默认交换器 
            deadLetterRoutingKey: 'delay-queue-consumer',   //默认交换器路由键就是队列名
            messageTtl: 5000    //延时 ms
        });   
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                ch.sendToQueue('delay-queue-dead-letter', new Buffer(msg+i));   //发送消息
                console.log(' [x] Sent %s', msg+i);
                if (i == 4) {
                    myEmitter.emit('sent done');
                }
            }, 5000*i)
        }

        myEmitter.on('sent done', async () => {
            await ch.close();   //关闭信道
            await conn.close();  //关闭连接
        });
        
    } catch (error) {
        console.log(error);   
    }
})()