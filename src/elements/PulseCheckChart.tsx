import { FunctionComponent, useEffect } from 'react';
import { groupSort, sum } from 'd3';

import React from 'react';
import { StackedBarChartSVG } from '../thirdparty/StackedBarChartSVG';

export interface Question {
  question: string;
  1: number;
  2: number;
  3: number;
}

export interface PulseCheckChartProps {
  questions: Question[];
}

const PulseCheckChart: FunctionComponent<PulseCheckChartProps> = ({
  questions,
}) => {
  const containerRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (questions.length !== 0) {
      const options = ['1', '2', '3'];
      const data = options.flatMap(option =>
        questions.map(d => ({
          question: d.question,
          option,
          count: (d as any)[option] as number,
        }))
      ); // pivot
      const svg = StackedBarChartSVG(data, {
        x: (d: any) => d.count,
        y: (d: any) => d.question,
        z: (d: any) => d.option,
        title: () => 'Pulse Check',
        yDomain: groupSort(
          data,
          D => D[0].count / sum(D, d => d.count), // proportion of first age group
          d => d.question // sort y by x
        ),
        zDomain: options,
        colors: ['#FBBC05', '#34A853', '#EA4335'], //schemeSpectral[options.length],
        width: 600,
        paddingTop: 10,
        paddingBottom: 10,
        height: 30 + 25 * questions.length,
      } as any);
      if (containerRef.current?.children[0])
        containerRef.current?.removeChild(containerRef.current?.children[0]);
      containerRef.current?.appendChild(svg as any);
    }
  }, [questions]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', padding: '20px' }}
    ></div>
  );
};

export default PulseCheckChart;
