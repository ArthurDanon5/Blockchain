const Block = require('./Block')

const socketListener = (socket, blockchain) => {

    socket.on('mine', (sender, receiver, qty) => {
        let block = new Block({sender, receiver, qty})
        blockchain.addNewBlock(block)
        console.info(`Block number ${block.index} just mined`)
    })

    socket.on('blockmined', (newChain) => {
        console.log(newChain)
        blockchain.chain = newChain
        console.info(`Blockchain synchronized`)
    })

    socket.on('newblock', (block) => {
        console.log(block);
        for (let index = 0; index < blockchain.chain.length; index++) {
            const old_block = blockchain.chain[index];
            const received_block = block[index];
            if(old_block != received_block) return console.log("mauvais block");
            
        }
        if(blockchain.chain() === block) return;
        blockchain.addNewBlock(block);
    })

    return socket
}

module.exports = socketListener