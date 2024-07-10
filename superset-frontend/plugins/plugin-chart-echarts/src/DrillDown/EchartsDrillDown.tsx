/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
} from 'react';
import { DataRecord, styled } from '@superset-ui/core';
import { ECharts, EChartsCoreOption, EChartsOption, init } from 'echarts';
import { EchartsDrillDownFormData } from './types';
import { EchartsHandler, EchartsProps, EchartsStylesProps } from '../types';

export default function EchartsDrillDown(props: EchartsDrillDownFormData) {
  const { height, width, echartOptions, refs } = props;
  return (
    <CustomEchart
      height={height}
      width={width}
      echartOptions={echartOptions}
      refs={refs}
    />
  );
}

const Styles = styled.div<EchartsStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

type EchartsCustomOptions = EChartsCoreOption & {
  dataset?: {
    source?: any[];
  };
  series?: any[];
};

type EchartsCustomProps = EchartsProps & {
  echartOptions: EchartsCustomOptions & {
    drilldownData: { dataGroupId: string; data: DataRecord[] }[];
  };
};

function Echart(
  {
    width,
    height,
    echartOptions,
    eventHandlers,
    zrEventHandlers,
    selectedValues = {},
    refs,
  }: EchartsCustomProps,
  ref: React.Ref<EchartsHandler>,
) {
  const divRef = useRef<HTMLDivElement>(null);
  if (refs) {
    // eslint-disable-next-line no-param-reassign
    refs.divRef = divRef;
  }
  const chartRef = useRef<ECharts>();
  const currentSelection = useMemo(
    () => Object.keys(selectedValues) || [],
    [selectedValues],
  );
  const previousSelection = useRef<string[]>([]);

  useImperativeHandle(ref, () => ({
    getEchartInstance: () => chartRef.current,
  }));

  useEffect(() => {
    if (!divRef.current) return;
    if (!chartRef.current) {
      chartRef.current = init(divRef.current);
    }

    Object.entries(eventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.off(name);
      chartRef.current?.on(name, handler);
    });

    Object.entries(zrEventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.getZr().off(name);
      chartRef.current?.getZr().on(name, handler);
    });

    chartRef.current.setOption(echartOptions, true);
  }, [echartOptions, eventHandlers, zrEventHandlers]);

  // highlighting
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.dispatchAction({
      type: 'downplay',
      dataIndex: previousSelection.current.filter(
        value => !currentSelection.includes(value),
      ),
    });
    if (currentSelection.length) {
      chartRef.current.dispatchAction({
        type: 'highlight',
        dataIndex: currentSelection,
      });
    }
    previousSelection.current = currentSelection;
  }, [currentSelection]);

  const handleSizeChange = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      if (chartRef.current) {
        chartRef.current.resize({ width, height });
      }
    },
    [],
  );

  // did mount
  useEffect(() => {
    handleSizeChange({ width, height });
    return () => chartRef.current?.dispose();
  }, []);

  useLayoutEffect(() => {
    handleSizeChange({ width, height });
  }, [width, height, handleSizeChange]);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current?.on('click', function (event: any) {
        const oldOptions = chartRef.current?.getOption();

        if (event?.data?.[0]) {
          const subData = echartOptions.drilldownData?.find(
            data => data.dataGroupId === event.data[0],
          );
          if (!subData) {
            return;
          }

          const newOpts = {
            xAxis: {
              data: subData.data.map(d => d[0]),
            },
            yAxis: {},
            series: [
              {
                type: 'bar',
                id: subData.dataGroupId,
                data: subData.data.map(d => d[1]),
              },
            ],
            graphic: [
              {
                type: 'text',
                left: 50,
                top: 20,
                style: {
                  text: 'Back',
                  fontSize: 18,
                },
                onclick: () => {
                  chartRef.current?.setOption(echartOptions, true);
                },
              },
            ],
          };

          console.log(
            'click',
            oldOptions,
            newOpts,
            echartOptions,
            event.data,
            chartRef.current,
          );

          chartRef.current?.setOption(newOpts, true);
        }
      });
      return () => {
        chartRef.current?.on('click', () => {});

        Object.entries(eventHandlers || {}).forEach(([name, handler]) => {
          chartRef.current?.off(name);
          chartRef.current?.on(name, handler);
        });

        Object.entries(zrEventHandlers || {}).forEach(([name, handler]) => {
          chartRef.current?.getZr().off(name);
          chartRef.current?.getZr().on(name, handler);
        });
      };
    }
  }, [echartOptions]);

  return <Styles ref={divRef} height={height} width={width} />;
}

const CustomEchart = forwardRef(Echart);
