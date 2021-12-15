const _ = require('lodash');
const chalk = require('chalk');

const displayBarChart = require('./bar-chart');
const { ViolationType } = require('../constants');

const printSpacer = (num = 0) => {
    console.log('\n'.repeat(num));
}

const printSectionTitle = ({ violationType, violatedRules, totalViolations, }) => {
    const actualViolationsToShow = violatedRules.length;
    const title = `ESLint: Top ${actualViolationsToShow} ${violationType}s`.toUpperCase();
    const subTitle = ` (total occurrences: ${totalViolations})`;
    if (violationType === ViolationType.error) {
        console.log(chalk.red.bold.underline(title) + subTitle);
    } else {
        console.log(chalk.yellow.bold.underline(title) + subTitle);
    }
}

const showTopViolations = ({ violations, numOfTopViolations, violationType = ViolationType.error }) => {
    const totalViolations = violations.length;
    const groupedByRules = _.countBy(violations, 'ruleId');
    let sortedRules = Object.keys(groupedByRules)
        .map(rule => {
            const ruleViolationCount = groupedByRules[rule];
            const percent = ruleViolationCount / totalViolations;
            return ({ rule, count: ruleViolationCount, percent });
        })
        .sort((a, b) => {
            return b.count - a.count;
        });

    if (numOfTopViolations) {
        sortedRules = sortedRules.slice(0, numOfTopViolations);
    }

    const displayData = sortedRules.map(item => ({
        leftLabel: item.rule,
        value: item.count,
        percent: item.percent,
        rightLabel: item.percent.toFixed(2)
    }))

    const violatedRules = displayData.map(item => item.leftLabel);

    printSectionTitle({
        violationType,
        violatedRules,
        totalViolations
    });

    displayBarChart(displayData);
    printSpacer();
}

const showNextStep = ({ violationSummary, maxWarningsAllowed, } = {}) => {
    const { errors, warnings } = violationSummary;
    const stepList = [];

    const numOfErrors = errors.length;
    const numOfWarnings = warnings.length;
    const totalViolations = numOfErrors + numOfWarnings;

    if (typeof maxWarningsAllowed !== 'undefined' && (totalViolations > maxWarningsAllowed)) {
        stepList.push(`must fix newly added warnings, only ${maxWarningsAllowed} warnings allowed, yet you have ${totalViolations}.`);
    }

    if (errors.length > 0) {
        stepList.push(`must have 0 error, yet you have ${errors.length}.`);
    }

    if (_.isEmpty(stepList)) {
        return;
    }

    console.log(chalk.bgRed.bold.underline('What you must do'.toUpperCase()));
    stepList.forEach(item => {
        const prefix = '[-] ';
        console.log(chalk.red.bold(prefix + item));
    })
}

module.exports = {
    showTopViolations,
    showNextStep
}