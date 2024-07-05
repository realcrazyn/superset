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
import { styled } from '@superset-ui/core';
import { ECharts, EChartsCoreOption, EChartsOption, init } from 'echarts';
import { EchartsShareDatasetFormData } from './types';
import { EchartsHandler, EchartsProps, EchartsStylesProps } from '../types';
import { indexOf } from 'lodash';

export default function EchartsLinearGradient(
  props: EchartsShareDatasetFormData,
) {
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
  echartOptions: EchartsCustomOptions;
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
      chartRef.current?.on(
        'updateAxisPointer',
        function (event: any, b: any, c: any) {
          const dataset = echartOptions?.dataset?.source;

          const xAxisInfo = event.axesInfo[0];
          if (xAxisInfo && dataset) {
            const keys = dataset[0].filter(
              (key: string, index: number) => index !== 0,
            );

            const dimension = xAxisInfo.value;
            const pieData = dataset.find(
              datasetElem => datasetElem[0] === dimension,
            );
            const finalData = keys.map(key => {
              const keyIndex = indexOf(dataset[0], key);

              return {
                name: key,
                value: pieData[keyIndex],
                itemStyle: echartOptions?.series?.[keyIndex]?.itemStyle,
              };
            });

            const pieSeries = echartOptions.series?.length
              ? echartOptions.series?.[echartOptions.series?.length - 1]
              : undefined;

            chartRef.current?.setOption({
              series: {
                id: 'pie',
                label: pieSeries?.label,
                data: finalData,
              },
            });
          }
        },
      );
      return () => chartRef.current?.on('updateAxisPointer', () => {});
    }
  }, [echartOptions]);

  return <Styles ref={divRef} height={height} width={width} />;
}

const CustomEchart = forwardRef(Echart);
