const _ = require('lodash');
const chalk = require('chalk');

const displayBarChart = require('./bar-chart');
const { ViolationType } = require('../constants');

const printSpacer = (num = 1) => {
    console.log('\n'.repeat(num));
}

const printSectionTitle = ({
    violationType,
    violatedRules
}) => {
    const actualViolationsToShow = violatedRules.length;
    const title = `ESLint: Top ${actualViolationsToShow} ${violationType}s \n`.toUpperCase();
    if (violationType === ViolationType.error) {
        console.log(chalk.red.bold.underline(title));
    } else {
        console.log(chalk.yellow.bold.underline(title));
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
        violatedRules
    });

    displayBarChart(displayData);
    printSpacer();
}

module.exports = {
    showTopViolations
}