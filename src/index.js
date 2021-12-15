const { ViolationType, NO_ERROR_MSG, NUM_TOP_VIOLATIONS } = require("./constants");
const { showTopViolations } = require("./utils/display");
const { getFlattenedViolations } = require("./utils/formatter");

const isAllCodeClean = ({ errors, warnings }) => {
    return !errors.length && !warnings.length;
}

module.exports = function (rawResults, context) {
    const results = rawResults || [];

    const { errors, warnings } = getFlattenedViolations(results, context);

    if (isAllCodeClean({ errors, warnings })) {
        return NO_ERROR_MSG;
    }

    if (errors.length) {
        showTopViolations({ violations: errors, violationType: ViolationType.error, numOfTopViolations: NUM_TOP_VIOLATIONS });
    }

    if (warnings.length) {
        showTopViolations({ violations: warnings, violationType: ViolationType.warning, numOfTopViolations: NUM_TOP_VIOLATIONS });
    }
};