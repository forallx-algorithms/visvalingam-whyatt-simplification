/*
 * Visvalingam line simplification algorithm
 *
 * @author Evgeniy Kuznetsov
 * @date 12 april 2018
 */

function computeLineLength(line) {
  let a = Math.pow(line[0][0] - line[1][0], 2);
  let b = Math.pow(line[0][1] - line[1][1], 2);
  return Math.sqrt(a + b);
}


/*
 * @param {Number[]} a Point a
 * @param {Number[]} b Point b
 * @param {Number[]} c Point c
 * @returns {Number} Area of the given triangle
 */
function computeTriangleArea(triangle) {
  let a = computeLineLength([triangle[0], triangle[1]]);
  let b = computeLineLength([triangle[1], triangle[2]]);
  let c = computeLineLength([triangle[2], triangle[0]]);

  return 1/4 * Math.sqrt(
    (a + b + c) * (b + c - a) * (c + a - b) * (a + b - c)
  );
}

function computePolylineTripletAreas(polyline) {
  return polyline
    .map((coord, i) => {
      if (i == 0 || i == polyline.length - 1) {
        return [i, Infinity];
      } else {
        return [
          i,
          computeTriangleArea([polyline[i - 1], coord, polyline[i + 1]])
        ];
      }
    });
}

/*
 * @returns {Number[][]} polyline
 */
function eliminatePoints(polyline, polylineWithAreas, percentage) {
  let sorted = polylineWithAreas.sort((a, b) => b[1] - a[1]);
  let lastIndex = Math.max(2, Math.floor(sorted.length * percentage));
  let leftover = sorted.slice(0, lastIndex);
  return leftover
    .sort((a, b) => a[0] - b[0])
    .map((a) => polyline[a[0]]);
}

/*
 * @param {Number[][]} polyline Unsimplified polyline
 * @param {Number} percentage Percentage of points left, must be within [0, 1]
 * @returns {Number[][]} Simplified polyline
 */
function visvalingamSimplification(polyline, percentage) {
  return eliminatePoints(
    polyline, computePolylineTripletAreas(polyline), percentage);
}

// section: Tests

const triangle1 = [[0, 0], [5, 0], [0, 5]];
const test1 = computeTriangleArea(triangle1);
const test1Should = Math.pow(5, 2) / 2;

console.log('Triangle case 1:', test1 == test1Should, test1, test1Should);

const line1 = [[0, 0], [1, -1], [2, 0], [10, -10]];
const test2 = visvalingamSimplification(line1, 30/40);
const test2Should = [[0, 0], [2, 0], [10, -10]];

console.log('Visvalingam case 1:', test2.toString(), '==?', test2Should.toString());
