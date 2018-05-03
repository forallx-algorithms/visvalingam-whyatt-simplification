const { expect } = require('chai');
const { computeTriangleArea, visvalingamWhyattSimplification } = require('./visvalingam_whyatt_simplification');

describe('Visvalingam Whyatt simplification', () => {
  describe('computeTriangleArea function', () => {
    it('should compute area of triangle', () => {
      const triangle = [[0, 0], [5, 0], [0, 5]];
      const test = computeTriangleArea(triangle);
      expect(test).to.eql(Math.pow(5, 2) / 2);
    });
  
  });

  describe('visvalingamWhyattSimplification', () => {
    let exampleLine;

    beforeEach(() => {
      exampleLine = [[0, 0], [1, -1], [2, 0], [10, -10]];
    });

    it('should leave 2 points', () => {
      const test = visvalingamWhyattSimplification(exampleLine, 1/4);
      expect(test.length).to.eql(2);
    });

    it('should simplify line (case 1)', () => {
      const test = visvalingamWhyattSimplification(exampleLine, 3/4);
      expect(test).to.eql([[0, 0], [2, 0], [10, -10]]);
    });

    it('should simplify line (case 2)', () => {
      const line = [
        [33, 23],
        [133, 71],
        [300, 11],
        [430, 47],
        [500, 83],
        [666, 28]
      ];

      const test1 = visvalingamWhyattSimplification(line, 6/6);
      expect(test1).to.eql(line);

      const test2 = visvalingamWhyattSimplification(line, 5/6);
      const test2Should = line.slice(0, 3).concat(line.slice(4));
      expect(test2).to.eql(test2Should);

      const test3 = visvalingamWhyattSimplification(line, 4/6);
      const test3Should = test2Should.slice(0, 1).concat(test2Should.slice(2));
      expect(test3).to.eql(test3Should);

      const test4 = visvalingamWhyattSimplification(line, 3/6);
      const test4Should = test3Should.slice(0, 1).concat(test3Should.slice(2));
      expect(test4).to.eql(test4Should);

      const test5 = visvalingamWhyattSimplification(line, 2/6);
      const test5Should = test4Should.slice(0, 1).concat(test4Should.slice(2));
      expect(test5).to.eql(test5Should);

      const test6 = visvalingamWhyattSimplification(line, 1/6);
      expect(test6).to.eql(test5Should);
    });
  });
});

