var fs = require('fs'),
  path = '../develop/src/viz/',
  // path = '../charttest/',
  filePath,
  fileData,
  chartList = [
    'area2d',
    'bar2d',
    'bar3d',
    'bubble',
    'column2d',
    'column3d',
    'doughnut2d',
    'doughnut3d',
    'line',
    'marimekko',
    'msarea',
    'msbar2d',
    'msbar3d',
    'mscolumn2d',
    'mscolumn3d',
    'mscolumn3dlinedy',
    'mscolumnline3d',
    'mscombi2d',
    'mscombi3d',
    'mscombidy2d',
    'msline',
    'msstackedcolumn2d',
    'msstackedcolumn2dlinedy',
    'msstackedcolumn2dsplinedy',
    'overlappedbar2d',
    'overlappedcolumn2d',
    'pareto2d',
    'pareto3d',
    'pie2d',
    'pie3d',
    'scatter',
    'scrollarea2d',
    'scrollcolumn2d',
    'scrollcombi2d',
    'scrollcombidy2d',
    'scrollline2d',
    'scrollstackedcolumn2d',
    'stackedarea2d',
    'stackedbar2d',
    'stackedbar3d',
    'stackedcolumn2d',
    'stackedcolumn2dline',
    'stackedcolumn3d',
    'stackedcolumn3dline',
    'stackedcolumn3dlinedy',

    // 'treemap',

    'zoomline',
    'zoomlinedy',

    // 'zoomscatter',

    'angulargauge',
    'boxandwhisker2d',
    'bulb',
    'candlestick',
    'cylinder',
    'dragarea',
    'dragcolumn2d',
    'dragline',
    'dragnode',

    // 'errorbar2d',
    // 'errorline',

    'errorscatter',
    'funnel',
    'gantt',
    'hbullet',
    'heatmap',
    // 'histogram',
    'hled',
    'hlineargauge',
    'inversemsarea',
    'inversemscolumn2d',
    'inversemsline',
    'kagi',
    'logmscolumn2d',
    'logmsline',
    'logstackedcolumn2d',

    // 'msspline',
    // 'mssplinearea',
    // 'mssplinedy',

    'msstepline',
    'multiaxisline',

    // 'multilevelpie',

    'pyramid',
    'radar',
    'realtimearea',
    'realtimecolumn',
    'realtimeline',
    'realtimelinedy',
    'realtimestackedarea',
    'realtimestackedcolumn',
    'selectscatter',
    'sparkcolumn',
    'sparkline',
    'sparkwinloss',
    'spline',
    'splinearea',
    'thermometer',
    'vbullet',
    'vled',
    'waterfall2d'
  ];

// 1. Loop through chartList
// 2. For each item -
// 2.1. Check if [item].spec.js exists, if not procees
// 2.2. Create [item].spec.js
// 2.3. Copy content of template.spec.js and replace __CHART_TYPE__ with the item
// 2.4. Fill [item].spec.js with above content

fs.readFile('template.spec.js', 'utf8', (err, data) => {
  if (err) throw err;
  chartList.forEach(element => {
    fileData = data.replace('__CHART_TYPE__', element);
    filePath = path + element + '.spec.js';
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, fileData, function (err) {
        if (err) throw err;
        console.log('Saved ' + element + '.spec.js!');
      });
    }
  });
});
