const { io } = require('socket.io-client');
const Block = require('./Block')

class Blockchain {

    constructor(io){
        this.chain = [this.startGenesisBlock()]
        this.difficulty = 4;
        this.nodes = []
        this.io = io
    }

    startGenesisBlock(){
        return new Block("Initial Block in the Chain");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addNewBlock(newBlock){
        newBlock.precedingHash = this.getLatestBlock().hash;
        newBlock.index = this.getLatestBlock().index + 1
        newBlock.proofOfWork(this.difficulty);
        this.chain.push(newBlock);
        this.io.emit('blockmined', this.chain)
        this.nodes.forEach(n => {
            n.emit("newblock", this.change)
        })
    }

    checkChainValidity(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const precedingBlock = chain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) return false;
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        return true;
    }

    addNewNode(node){
        this.nodes.push(node)
    }
}

module.exports = Blockchain