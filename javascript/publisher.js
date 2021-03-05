const amqp = require('amqplib')

const message = { number: process.argv[2] };
const channel_name = 'messages';

async function connect() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel();
        const result = await channel.assertQueue(channel_name);   // Makes sure the queue exists on the channel. Creates if it doesn't.
        console.log(result);
        channel.sendToQueue(channel_name, Buffer.from(JSON.stringify(message)));
        console.log('Message sent successfully: ', message.number);
        setTimeout(() => connection.close(), 1000);
    } catch (ex) {
        console.log(ex);
    }
}

connect();
