const _ = require('lodash');
const chalk = require('chalk');
const table = require("text-table");

const displayBarChart = require('./bar-chart');
const { ViolationType } = require('../constants');

const printSpacer = (num = 0) => {
    console.log('\n'.repeat(num));
}

const printSectionTitle = ({ violationType, violatedRules, totalViolations, }) => {
    const actualViolationsToShow = violatedRules.length;
    const title = `ESLint: Top ${actualViolationsToShow} ${violationType} types`.toUpperCase();
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

const showNextStep = ({ violationSummary, maxViolations, } = {}) => {
    const { errors, warnings } = violationSummary;
    const stepList = [];

    const numOfErrors = errors.length;
    const numOfWarnings = warnings.length;
    const totalViolations = numOfErrors + numOfWarnings;

    if (typeof maxViolations !== 'undefined' && (totalViolations > maxViolations)) {
        stepList.push(`must fix newly added warnings, only ${maxViolations} warnings allowed, yet you have ${totalViolations}.`);
    }

    if (errors.length > 0) {
        stepList.push(`must have 0 error, yet you have ${errors.length}.`);
    }

    if (_.isEmpty(stepList)) {
        console.log(chalk.bgGreen.bold.underline('Eslint Summary: All Clear'.toUpperCase()));
        const successMsgList = [];
        if (totalViolations === 0) {
            successMsgList.push('Good job! you have 0 warning and 0 error');
        } else {
            successMsgList.push('You have met all requirements, but there is still room for improvements!');
        }
        successMsgList.forEach(item => {
            const prefix = '[+] ';
            console.log(chalk.green.bold(prefix + item));
        })
        printSpacer();
        return;
    }

    console.log(chalk.bgRed.bold.underline('What you must do'.toUpperCase()));
    stepList.forEach(item => {
        const prefix = '[-] ';
        console.log(chalk.red.bold(prefix + item));
    })
    printSpacer();
}

const showErrorList = (results) => {
    let fileErrorSummary = "";
    results.forEach(result => {
        const { messages, filePath } = result;
        const errorMsgs = messages.filter(msg => {
            return msg.fatal || msg.severity === 2
        });
        if (errorMsgs.length === 0) {
            return;
        }

        fileErrorSummary += `${chalk.underline(filePath)}\n`;
        fileErrorSummary += `${table(
            errorMsgs.slice(0, 3).map(msg => {
                return [
                    "",
                    msg.line || 0,
                    msg.column || 0,
                    chalk.red("error"),
                    msg.message.replace(/([^ ])\.$/u, "$1"),
                    chalk.dim(msg.ruleId || "")
                ];
            }), {
              align: ["", "r", "l"],
              stringLength(str) { return (str).length; }
            })
            .split("\n")
            .map(el => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
            .join("\n")
        }\n\n`;
    });
    console.log(fileErrorSummary);
}

module.exports = {
    showTopViolations,
    showNextStep,
    showErrorList,
}