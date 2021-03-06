const _ = require('lodash');
const {
    DEFAULT_CONTAINER_WIDTH,
    ASCII_BAR_SYMBOL,
    NORMAL_CONTAINER_PADDING,
    SMALL_CONTAINER_PADDING
} = require('../constants');

module.exports = function (barItemList, opts) {
    if (_.isEmpty(barItemList)) {
        throw new Error('must provide some data to draw bar chart');
    }
    opts = (opts && typeof opts === 'object') ? opts : {};


    const barSymbol = ASCII_BAR_SYMBOL;

    let containerWidth = require('window-size').width;
    if (!(typeof containerWidth === 'number' && containerWidth > 0)) {
        containerWidth = DEFAULT_CONTAINER_WIDTH;
    }
    const containerPadding = (containerWidth > 20 ? NORMAL_CONTAINER_PADDING : SMALL_CONTAINER_PADDING);
    const maxLabelLength = _.max(_.map(barItemList, ({ leftLabel }) => leftLabel.toString().length));
    const maxBarWidth = containerWidth * 0.75 - containerPadding - maxLabelLength;

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

        let barLine = leftLabel ?? '';
        barLine += ' : ';
        barLine += new Array(barWidth).join(barSymbol);
        barLine += '  ';
        barLine += rightLabel ?? '';
        return barLine;
    })

    console.log(barLines.join('\n'));
};
