function write(level, msg) {
    switch (level) {
        case "info":
            console.log(`[TextBroker] ${Date()} INFO: ${msg}`);
            break;
        case "warn":
            console.log(`[TextBroker] ${Date()} WARN: ${msg}`);
            break;
        case "error":
            console.log(`[TextBroker] ${Date()} ERROR: ${msg}`);
            break;
        default:
            console.log(`[TextBroker] ${Date()} MESSAGE: ${msg}`);
            break;
    }
}

module.exports = { write };