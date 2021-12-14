module.exports = function (rawResults, context) {
    const results = rawResults || [];

    const summary = results.reduce(
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
                    logMessage.type = 'warning';
                    seq.warnings.push(logMessage);
                }
                if (msg.severity === 2) {
                    logMessage.type = 'error';
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

    if (summary.errors.length > 0 || summary.warnings.length > 0) {
        return (
            `Errors: ${summary.errors.length
            }, Warnings: ${summary.warnings.length
            }\n`
        );
    }

    return 'Your code is super clean 😇';
};
