const Heap = require('heap');

/*
 * Visvalingam line simplification algorithm
 *
 * @author Evgeniy Kuznetsov
 * @date 12 april 2018
 */

/*
 * @returns {Number} Length of a given line
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

/*
 * @returns {Object}
 */
function createPointEntry(area, index, leftIndex, rightIndex) {
  return {
    area: area,
    index: index,
    left: leftIndex,
    right: rightIndex
  }
}

/*
 * @returns {Number}
 */
function computePolylineAreaByPointEntry(polyline, entry) {
  let triangle = [
    polyline[entry.index],
    polyline[entry.left],
    polyline[entry.right]
  ];

  return computeTriangleArea(triangle);
}

/* Make two given PointEntries neighbors
 * @returns {undefined}
 */
function linkPointEntries(left, right) {
  left.right = right.index;
  right.left = left.index;
}

/*
 * @returns {Boolean} True means area can be computed and updated,
 *  false otherwise
 */
function updatePointEntryArea(polyline, entry) {
  if (entry.left != null && entry.right != null) {
    entry.area = computePolylineAreaByPointEntry(polyline, entry);
    return true;
  } else {
    return false;
  }
}

/*
 * @returns {Number[][]} Array of PointEntries for each point
 *   in the given polyline
 */
function computePolylinePointEntries(polyline) {
  return polyline
    .map((coord, i) => {
      let isFirst = i == 0;
      let isLast = i == (polyline.length - 1);
      let left = isFirst ? null : i - 1;
      let right = isLast ? null : i + 1;

      let area;
      if (isFirst || isLast) {
        area = Infinity;
      } else {
        area = computeTriangleArea([polyline[left], coord, polyline[right]]);
      }

      return createPointEntry(area, i, left, right);
    });
}

/*
 * @param {Number} percentage Number of points in the result polyline
 *   given as a percentage of polyline points
 * @returns {Number[][]} polyline
 */
function eliminatePoints(polyline, pointEntries, percentage) {
  let deleted = {};
  // We always leave two points
  let howManyDelete = Math.min(pointEntries.length - 2, 
    pointEntries.length - Math.floor(pointEntries.length * percentage));

  let heap = new Heap((a, b) => a.area - b.area);
  for (let entry of pointEntries) {
    heap.push(entry);
  }

  while(howManyDelete-- > 0) {
    let entry = heap.pop();
    let leftEntry = pointEntries[entry.left];
    let rightEntry = pointEntries[entry.right];

    linkPointEntries(leftEntry, rightEntry);
    if (updatePointEntryArea(polyline, leftEntry)) { heap.updateItem(leftEntry); }
    if (updatePointEntryArea(polyline, rightEntry)) { heap.updateItem(rightEntry); }

    deleted[entry.index] = true;
  }

  return polyline
    .filter((coord, i) => !deleted[i]);
}

/*
 * @param {Number[][]} polyline Unsimplified polyline
 * @param {Number} percentage Percentage of points left, must be within [0, 1]
 * @returns {Number[][]} Simplified polyline
 */
function visvalingamSimplification(polyline, percentage) {
  return eliminatePoints(
    polyline, computePolylinePointEntries(polyline), percentage);
}

// section: Tests

const triangle1 = [[0, 0], [5, 0], [0, 5]];
const test1 = computeTriangleArea(triangle1);
const test1Should = Math.pow(5, 2) / 2;

console.log('Triangle case 1:', test1 == test1Should, test1, test1Should);

const line1 = [[0, 0], [1, -1], [2, 0], [10, -10]];
const test2 = visvalingamSimplification(line1, 3/4);
const test2Should = [[0, 0], [2, 0], [10, -10]];

console.log('Visvalingam case 1:', test2.toString(), '==?', test2Should.toString());
