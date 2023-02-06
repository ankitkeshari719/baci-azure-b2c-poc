import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-normalized-horizontal-bar
export function StackedBarChartSVG(
  data,
  {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    z = (d, i) => i, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 200, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yDomain, // array of y-values
    yRange, // [bottom, top]
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    zDomain, // array of z-values
    offset = d3.stackOffsetExpand, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat = '%', // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    colors = d3.schemeTableau10, // array of colors
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default y- and z-domains, and unique them.
  if (yDomain === undefined) yDomain = Y;
  if (zDomain === undefined) zDomain = Z;
  yDomain = new d3.InternSet(yDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the y- and z-domains.
  const I = d3
    .range(X.length)
    .filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

  // If the height is not specified, derive it from the y-domain.
  if (height === undefined)
    height = yDomain.size * 25 + marginTop + marginBottom;
  if (yRange === undefined) yRange = [height - marginBottom, marginTop];

  // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
  // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique y- and z-value.
  const series = d3
    .stack()
    .keys(zDomain)
    .value(([, I], z) => X[I.get(z)])
    .order(order)
    .offset(offset)(
      d3.rollup(
        I,
        ([i]) => i,
        i => Y[i],
        i => Z[i]
      )
    )
    .map(s => s.map(d => Object.assign(d, { i: d.data[1].get(s.key) })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisTop(xScale).ticks(width / 160, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${Z[i]}\n${X[i].toLocaleString()}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3
    .create('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  const s = svg.append('g').selectAll('g').data(series);

  const d = s
    .join('g')
    .attr('fill', ([{ i }]) => color(Z[i]))
    .selectAll('rect')
    .data(d => d);

  d.join('rect')
    .attr('x', ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
    .attr('y', ({ i }) => yScale(Y[i]))
    .attr('width', ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
    .attr('height', yScale.bandwidth());

  d.join('image')
    .attr(
      'href',
      ({ i }) =>
        [
          '/images/sad-button.png',
          '/images/neutral-button.png',
          '/images/happy-button.png',
        ][Z[i] - 1]
    )
    .attr('x', ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
    .attr('y', ({ i }) => yScale(Y[i]))
    .attr('width', ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
    .attr('height', yScale.bandwidth());

  svg
    .append('g')
    .attr('transform', `translate(0,${marginTop})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .call(g =>
      g
        .append('text')
        .attr('x', width - marginRight)
        .attr('y', -22)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(xLabel)
    );

  svg
    .append('g')
    .attr('transform', `translate(${xScale(0)},0)`)
    .call(yAxis);

  return Object.assign(svg.node(), { scales: { color } });
}
