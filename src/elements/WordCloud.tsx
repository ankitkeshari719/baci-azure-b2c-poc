import { FunctionComponent, useEffect, useState } from 'react';

import d3Cloud from 'd3-cloud';
import { interpolateWarm, interpolateGreens} from 'd3-scale-chromatic';

export interface Word {
  text: string;
  size: number;
}

export interface WordCloudProps {
  data: Word[];
  showOn: string;
}

const WordCloud: FunctionComponent<WordCloudProps> = ({ data, showOn }) => {
  let cloudWords: d3Cloud.Word[] = [];
  const [cloud, setCloud] = useState(cloudWords);
  let colorsGreen=['#48706A','#8AC269','#5D965B','#467E59','#C9E092'];
  let colorOrange=['#73503C','#D9A86C','#591C16','#D9C0A3','#BF9169'];
  useEffect(() => {
    d3Cloud()
      .size([500, 250])
      .timeInterval(20)
      .words(data)
      .font(({ text, size }, i) => ['Poppins', 'Poppins', 'Poppins'][i % 3])
      .fontSize(datum => {
        // if(datum.size === 10){
        //   return 32;
        // }else{
        //   return datum.size ? datum.size * 5 : 0;
        // }
        return datum.size ? 5 + datum.size * 7 / 3 : 0; 
      })
      .padding(4)
      .rotate(() => 0)
      .text(datum => {
        return datum.text ?? '';
      })
      .on('end', words => setCloud(words))
      .start();
  }, [data]);
function fillcolor(){

}
  return (
    <svg viewBox="0 0 500 250" width={'100%'} height={'100%'} >
      <g transform={`translate(${250},${125})`}>
        {cloud &&
          cloud.map(word => {
            return (
              <text
                key={word.text}
                style={{
                  fontSize: word.size + 'px',
                  fontFamily: word.font,
                  fill: showOn === 'whatWentWell'? colorsGreen[Math.floor(Math.random() * colorsGreen.length)]: colorOrange[Math.floor(Math.random() * colorOrange.length)],
                  backgroundColor: 'yellow',
                  top: '5px',
                  right: '5px',
                  bottom: '5px',
                  left: '5px'
                }}
                textAnchor="middle"
                transform={`translate(${word.x},${word.y}) rotate(${word.rotate})`}
              >
                {word.text}
              </text>
            );
          })}
      </g>
    </svg>
  );
};

export default WordCloud;
