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
import { QueryColumn, t } from '@superset-ui/core';
import {
  ColumnMeta,
  ColumnOption,
  ControlPanelsContainerProps,
  ControlPanelSectionConfig,
  ControlSetRow,
  Dataset,
  DATASET_TIME_COLUMN_OPTION,
  DEFAULT_SORT_SERIES_DATA,
  ExtraControlProps,
  FilterOption,
  QUERY_TIME_COLUMN_OPTION,
  sections,
} from '@superset-ui/chart-controls';
import { DEFAULT_LEGEND_FORM_DATA } from '../constants';
import { defaultXAxis } from '../defaults';
import {
  EchartsTimeseriesSeriesType,
  LegendOrientation,
  LegendType,
  OrientationType,
} from '../types';
import { EchartsDrillDownFormData } from './types';

export const DEFAULT_FORM_DATA: Partial<EchartsDrillDownFormData> = {
  legendMargin: null,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  showLegend: true,
  // ...DEFAULT_TITLE_FORM_DATA, // TODO: figure out why these break things for stories (e.g. Bubble Chart)
  // here are the contents of DEFAULT_TITLE_FORM_DATA:
  xAxisTitle: '',
  xAxisTitleMargin: 0,
  yAxisTitle: '',
  yAxisTitleMargin: 0,
  yAxisTitlePosition: 'Top',
  // Now that the weird bug workaround is over, here's the rest...
  ...DEFAULT_SORT_SERIES_DATA,
  annotationLayers: sections.annotationLayers,
  area: false,
  forecastEnabled: sections.FORECAST_DEFAULT_DATA.forecastEnabled,
  forecastInterval: sections.FORECAST_DEFAULT_DATA.forecastInterval,
  forecastPeriods: sections.FORECAST_DEFAULT_DATA.forecastPeriods,
  forecastSeasonalityDaily:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityDaily,
  forecastSeasonalityWeekly:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityWeekly,
  forecastSeasonalityYearly:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityYearly,
  logAxis: false,
  markerEnabled: false,
  markerSize: 6,
  minorSplitLine: false,
  opacity: 0.2,
  orderDesc: true,
  rowLimit: 10000,
  seriesType: EchartsTimeseriesSeriesType.Bar,
  stack: false,
  tooltipTimeFormat: 'smart_date',
  truncateXAxis: true,
  truncateYAxis: false,
  yAxisBounds: [null, null],
  zoomable: false,
  richTooltip: true,
  xAxisForceCategorical: false,
  xAxisLabelRotation: defaultXAxis.xAxisLabelRotation,
  groupby: [],
  showValue: false,
  onlyTotal: false,
  percentageThreshold: 0,
  orientation: OrientationType.Vertical,
  sort_series_type: 'sum',
  sort_series_ascending: false,
  seriesFilterColumn: '',
  seriesFilterValues: '',
};

export const customElements: ControlSetRow[] = [
  [
    {
      name: 'series_filter_column',
      config: {
        type: 'TextControl',
        label: t('Filter column'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesGradientMin,
        description: t('Minimal Gradient Value.'),
        // visibility: ({ controls }: ControlPanelsContainerProps) =>
        //   Boolean(controls?.show_legend?.value),
      },
    },
  ],
  // [
  //   {
  //     name: 'series_filter_values1',
  //     config: {
  //       type: 'DndColumnSelect',
  //       label: t('Filter Values'),
  //       description: t('Maximal Gradient Value.'),
  //       multi: true,
  //       freeForm: true,
  //       clearable: true,
  //       default: [],
  //       includeTime: false,
  //     },
  //   },
  // ],

  [
    {
      name: 'series_filter_values',
      config: {
        type: 'TextControl',
        label: t('Filter Values'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesGradientMax,
        description: t('Maximal Gradient Value.'),
      },
    },
  ],
];
