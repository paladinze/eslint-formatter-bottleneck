const _ = require('lodash');

const defaultContainerWidth = 80;
const AsciiBarSymbol = '=';
const NormalContainerPadding = 30;
const SmallContainerPadding = 1;

module.exports = function (barItemList, opts) {
    if (_.isEmpty(barItemList)) {
        throw new Error('must provide some data to draw bar chart');
    }
    opts = (opts && typeof opts === 'object') ? opts : {};


    const barSymbol = AsciiBarSymbol;

    let containerWidth = require('window-size').width;
    if (!(typeof containerWidth === 'number' && containerWidth > 0)) {
        containerWidth = defaultContainerWidth;
    }
    const containerPadding = (containerWidth > 20 ? NormalContainerPadding : SmallContainerPadding);
    const maxLabelLength = _.max(_.map(barItemList, ({ leftLabel }) => leftLabel.toString().length));
    const maxBarWidth = containerWidth - containerPadding - maxLabelLength;

    const maxPercent = _.maxBy(barItemList, 'percent').percent;
    const displayData = barItemList.map(item => {
        const { leftLabel, percent, value } = item;

        const leftPaddingWidth = maxLabelLength - leftLabel.toString().length + 1;
        const leftPadding = new Array(leftPaddingWidth).join(' ');
        const paddedLeftLabel = leftPaddingWidth > 0 ? leftLabel + leftPadding : '';

        let barWidth = Math.ceil(percent / maxPercent * maxBarWidth);
        if (barWidth <= 1) {
            barWidth = 0;
        }

        return {
            ...item,
            leftLabel: paddedLeftLabel,
            barWidth,
            rightLabel: (percent * 100).toFixed(2) + '%' + ` (${value})`,
        }
    });

    const barLines = displayData.map((item) => {
        const { leftLabel, rightLabel, barWidth } = item;

        let elementLine = leftLabel ?? '';
        elementLine += ' : ';
        elementLine += new Array(barWidth).join(barSymbol);
        elementLine += '  ';
        elementLine += rightLabel ?? '';
        return elementLine;
    })

    console.log(barLines.join('\n'));
};
