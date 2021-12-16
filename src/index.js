const { ViolationType, NO_ERROR_MSG, NUM_TOP_VIOLATIONS } = require("./constants");
const { showTopViolations, showNextStep, showErrorList } = require("./utils/display");
const { getFlattenedViolations } = require("./utils/formatter");

const isAllCodeClean = ({ errors, warnings }) => {
    return !errors.length && !warnings.length;
}

module.exports = function (rawResults, context) {
    const results = rawResults || [];
    const maxViolations = Number(process.env.MAX_VIOLATIONS) ?? 0;

    const violationSummary = getFlattenedViolations(results, context);
    const { errors, warnings } = violationSummary;

    if (isAllCodeClean({ errors, warnings })) {
        return NO_ERROR_MSG;
    }

    if (warnings.length) {
        showTopViolations({ violations: warnings, violationType: ViolationType.warning, numOfTopViolations: NUM_TOP_VIOLATIONS });
    }

    if (errors.length) {
        showTopViolations({ violations: errors, violationType: ViolationType.error, numOfTopViolations: NUM_TOP_VIOLATIONS });
        showErrorList(results);
    }

    showNextStep({
        violationSummary,
        maxViolations,
    })

};