import FusionCharts from '../core';
import chartType from './__CHART_TYPE__';
import chartValidator from '../_internal/misc/test-sanity/template.sanity';
import ignoreCaseExt from '../features/ignore-case-ext';
import { setup, resizeDimensions, CONTAINER_ID } from '../_internal/misc/test-sanity/utility';
import { extend2 } from '../_internal/lib/lib';
import CommonTests from '../_internal/misc/test-sanity/common.sanity';

FusionCharts.addDep(chartType);
FusionCharts.addDep(ignoreCaseExt);
var svgElement, chartID = chartType.getName(), doc = window.document;

describe('Running common chart tests for ' + chartID, () => {
  var chart, chartObj;
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    if (chartObj && !chartObj.disposed) chartObj.dispose();
  });
  CommonTests.forEach((test) => {
    it(test.name, (done) => {
      var config = { document: doc, chartWrapperId: CONTAINER_ID, chartConfig: chart };
      if (test.configRequired) {
        // Run tests which need dom check
        test.run(chartObj, config, (result) => {
          expect(result).toBe(true);
          done();
        });
      } else {
        // Run tests which doesn't need dom check
        test.run(chartObj, (result) => {
          expect(result).toBe(true);
          done();
        });
      }
    });
  });
});

describe('Chart basic testing: ' + chartType.getName(), () => {
  var chart, chartObj, itResize;
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    if (chartObj && !chartObj.disposed) chartObj.dispose();
  });

  // 1. RENDER
  it('Rendered chart validation passes', (done) => {
    expect(chartObj).toBeDefined();
    let renderComplete = () => {
      svgElement = document.getElementById(chartObj.id);
      expect(chartValidator.BASIC.validate(svgElement)).toBe(true);
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
      // console.log(e);
      if (called === 0) { // Initial Data
        called++;
        chartObj.setChartData(chartValidator.BASIC.updateChart, 'json');
      } else if (called === 1) { // Final Data
        svgElement = document.getElementById(chartObj.id);
        expect(chartValidator.BASIC.updateValidate(svgElement)).toBe(true);
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
        svgElement = document.getElementById(chartObj.id);
        expect(chartValidator.BASIC.resizeValidate(svgElement)).toBe(true);
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
  var chart, chartObj, eiMethods;
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    if (chartObj && !chartObj.disposed) chartObj.dispose();
  });

  eiMethods = methodObj => {
    it(methodObj.name, (done) => {
      expect(chartObj).toBeDefined();
      let renderComplete = () => {
        svgElement = document.getElementById(chartObj.id);
        expect(methodObj.fn(svgElement, chartObj)).toBe(true);
        done();
      };
      chartObj.render();
      chartObj.addEventListener('addEventListener', renderComplete);
    });
  };

  for (const key in chartValidator.EI.methods) {
    if (chartValidator.EI.methods.hasOwnProperty(key)) {
      eiMethods(chartValidator.EI.methods[key]);
    }
  }
});
