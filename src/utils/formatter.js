const { ViolationType } = require("../constants");

const getFlattenedViolations = (results, context) => results.reduce(
    (seq, current) => {
        current.messages.forEach((msg) => {
            const logMessage = {
                filePath: current.filePath,
                ruleId: msg.ruleId,
                ruleUrl: context.rulesMeta[msg.ruleId]?.docs.url,
                message: msg.message,
                line: msg.line,
                column: msg.column,
                terminal: `${current.filePath}:${msg.line}:${msg.column}`,
            };

            if (msg.severity === 1) {
                logMessage.type = ViolationType.warning;
                seq.warnings.push(logMessage);
            }
            if (msg.severity === 2) {
                logMessage.type = ViolationType.error;
                seq.errors.push(logMessage);
            }
        });
        return seq;
    },
    {
        errors: [],
        warnings: [],
    },
);

module.exports = {
    getFlattenedViolations
}