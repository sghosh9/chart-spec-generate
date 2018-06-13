import FusionCharts from '../core';
import chartType from './__CHART_TYPE__';
import chartValidator from '../_internal/misc/test-sanity/template.sanity';
import ignoreCaseExt from '../features/ignore-case-ext';
import { setup, getSVG, initDimensions, resizeDimensions, CONTAINER_ID } from '../_internal/misc/test-sanity/utility';
import { extend2 } from '../_internal/lib/lib';
import CommonTests from '../_internal/misc/test-sanity/common.sanity';
import * as chartData from '../_internal/misc/test-data/data-by-chart';

FusionCharts.addDep(chartType);
FusionCharts.addDep(ignoreCaseExt);
var svgElement, chartName = chartType.getName(), chartID = chartName.toLowerCase(), doc = window.document;

describe('Running common chart tests for ' + chartName, () => {
  var chart = {
      type: chartID,
      renderAt: CONTAINER_ID,
      width: initDimensions.width,
      height: initDimensions.height,
      dataFormat: 'json',
      dataSource: {}
    },
    config = { chartID: chartID, chart: chart, document: doc, chartWrapperId: CONTAINER_ID };

  CommonTests.forEach((test) => {
    var itArr;
    if (test.name && test.run) {
      it(test.name, (done) => {
        test.run(config, (result) => {
          expect(result).toBe(true);
          done();
        });
      });
    } else if (test.iterator) {
      // Iterate over an array of run methods.
      itArr = test.iterator(chart);
      itArr.forEach((subTest) => {
        it(subTest.name, (done) => {
          subTest.run(config, (result) => {
            expect(result).toBe(true);
            done();
          });
        });
      });
    }
  });
});

describe('Chart basic testing: ' + chartName, () => {
  var chart, chartObj, itResize,
    renderData = chartValidator.BASIC.newChart,
    updateData = chartValidator.BASIC.updateChart;

  chart = {
    type: chartID,
    renderAt: CONTAINER_ID
  };
  extend2(chart, renderData);
  // eslint-disable-next-line
  chart.dataSource = chart.dataSource ? chart.dataSource : chartData[chartID]['default'];
  chart.dataSource.chart.animation = '0';

  beforeEach(() => {
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    if (chartObj && !chartObj.disposed) chartObj.dispose();
  });

  // 1. RENDER
  it('Rendered chart validation passes', (done) => {
    expect(chartObj).toBeDefined();
    let renderComplete = () => {
      let response = chartValidator.BASIC.validate(chartObj);
      expect(response.flag).toBe(true, response.messages.join(' && '));
      done();
    };
    chartObj.render();
    chartObj.addEventListener('renderComplete', renderComplete);
  });

  // 2. UPDATE
  it('Chart update passes', (done) => {
    expect(chartObj).toBeDefined();
    var called = 0;
    let renderComplete = () => {
      if (called === 0) { // Initial Data
        called++;
        chartObj.setChartData(updateData || chart.dataSource, 'json');
      } else if (called === 1) { // Final Data
        let response = chartValidator.BASIC.updateValidate(chartObj);
        expect(response.flag).toBe(true, response.messages.join(' && '));
        done();
      }
    };
    chartObj.addEventListener('renderComplete', renderComplete);
    chartObj.render();
  });

  // 3. RESIZE
  // We should be able to carry out resize for a set of dimensions.
  itResize = resizeDimensions => {
    it('Chart resize passes for ' + resizeDimensions.width + ' x ' + resizeDimensions.height, (done) => {
      expect(chartObj).toBeDefined();
      let renderComplete = () => {
        let response = chartValidator.BASIC.resizeValidate(chartObj);
        expect(response.flag).toBe(true, response.messages.join(' && '));
        done();
      };
      chartObj.addEventListener('renderComplete', renderComplete);
      chartObj.render(() => {
        chartObj.resizeTo(resizeDimensions.width, resizeDimensions.height);
      });
    });
  };
  for (let index = 0; index < resizeDimensions.length; index++) {
    itResize(resizeDimensions[index]);
  }
});

describe('Chart EI testing: ' + chartType.getName(), () => {
  var chart, chartObj, eiMethods,
    renderData = chartValidator.EI.newChart;

  chart = {
    type: chartID,
    renderAt: CONTAINER_ID
  };
  extend2(chart, renderData);
  // eslint-disable-next-line
  chart.dataSource = chart.dataSource ? chart.dataSource : chartData[chartID]['default'];
  chart.dataSource.chart.animation = '0';

  beforeEach(() => {
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    if (chartObj && !chartObj.disposed) chartObj.dispose();
  });

  eiMethods = methodObj => {
    it(methodObj.name, (done) => {
      expect(chartObj).toBeDefined();
      let renderComplete = () => {
        svgElement = getSVG(chartObj);
        methodObj.fn(svgElement, chartObj, (result) => {
          expect(result).toBe(true);
          done();
        });
      };
      chartObj.addEventListener('renderComplete', renderComplete);
      chartObj.render();
    });
  };

  for (const key in chartValidator.EI.methods) {
    if (chartValidator.EI.methods.hasOwnProperty(key)) {
      eiMethods(chartValidator.EI.methods[key]);
    }
  }
});
