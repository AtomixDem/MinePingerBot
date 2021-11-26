module.exports = {
    name: "ready",
    execute() {
        console.log('The Bot is ONLINE!')
        client.user.setActivity('\n?help - ?invite', { type: 'PLAYING' }) // Set PLAYING - LISTENING - WATCHING
        .catch(console.error);
    }

}