import FusionCharts from '../core';
import chartType from './__CHART_TYPE__';
import chartValidator from '../_internal/misc/test-sanity/template.sanity';
import ignoreCaseExt from '../features/ignore-case-ext';
import { setup, dispose, resizeDimensions } from '../_internal/misc/test-sanity/utility';
import { extend2 } from '../_internal/lib/lib';
import CommonTests from '../_internal/misc/test-sanity/common.sanity';

FusionCharts.addDep(chartType);
FusionCharts.addDep(ignoreCaseExt);

const CONTAINER_ID = 'test-chart';
var chartObj, svgElement, updateComplete, resizeComplete, chart,
  chartID = chartType.getName(), doc = window.document;

describe('Running common chart tests for ' + chartID, () => {
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    dispose();
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
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    dispose();
  });

  // 1. RENDER
  it('Rendered chart validation passes', (done) => {
    expect(chartObj).toBeDefined();
    chartObj.render(() => {
      svgElement = document.getElementById(chartObj.id);
      expect(chartValidator.BASIC.validate(svgElement)).toBe(true);
      done();
    });
  });

  // 2. UPDATE
  it('Chart update passes', (done) => {
    expect(chartObj).toBeDefined();
    chartObj.render(() => {
      updateComplete = () => {
        svgElement = document.getElementById(chartObj.id);
        expect(chartValidator.BASIC.updateValidate(svgElement)).toBe(true);
        done();
      };

      chartObj.addEventListener('renderComplete', updateComplete);

      chartObj.setChartData(chartValidator.BASIC.updateChart, 'json');
    });
  });

  // 3. RESIZE
  // We should be able to carry out resize for a set of dimensions.
  var itResize = resizeDimensions => {
    it('Chart resize passes for ' + resizeDimensions.width + ' x ' + resizeDimensions.height, (done) => {
      expect(chartObj).toBeDefined();
      chartObj.render(() => {
        resizeComplete = () => {
          svgElement = document.getElementById(chartObj.id);
          expect(chartValidator.BASIC.resizeValidate(svgElement)).toBe(true);
          done();
        };

        chartObj.addEventListener('renderComplete', resizeComplete);

        chartObj.resizeTo(resizeDimensions.width, resizeDimensions.height);
      });
    });
  };
  for (let index = 0; index < resizeDimensions.length; index++) {
    itResize(resizeDimensions[index]);
  }
});

describe('Chart EI testing: ' + chartType.getName(), () => {
  beforeEach(() => {
    chart = {
      type: chartID,
      renderAt: CONTAINER_ID
    };
    extend2(chart, chartValidator.BASIC.newChart);
    chartObj = setup(FusionCharts, chart);
  });
  afterEach(() => {
    dispose();
  });

  var eiMethods = methodObj => {
    it(methodObj.name, (done) => {
      expect(chartObj).toBeDefined();
      chartObj.render(() => {
        svgElement = document.getElementById(chartObj.id);
        expect(methodObj.fn(svgElement, chartObj)).toBe(true);
        done();
      });
    });
  };

  for (const key in chartValidator.EI.methods) {
    if (chartValidator.EI.methods.hasOwnProperty(key)) {
      eiMethods(chartValidator.EI.methods[key]);
    }
  }
});
