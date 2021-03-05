const amqp = require('amqplib')

const channel_name = 'messages';

async function connect() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel();
        const result = await channel.assertQueue(channel_name);   // Makes sure the queue exists on the channel. Creates if it doesn't.

        channel.consume(channel_name, message => {
            const input = JSON.parse(message.content.toString());
            console.log('Received message with value: ', input.number);
            if (input.number % 3 === 0) {
                channel.ack(message); // acknowledges the message (removes it from the channel's queue)
            }
        });
        console.log('Waiting for messages...');

        setTimeout(() => connection.close(), 1000);

    } catch (ex) {
        console.log(ex);
    }
}

connect();
