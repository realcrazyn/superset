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
import { t } from '@superset-ui/core';
import {
  ControlPanelsContainerProps,
  ControlPanelSectionConfig,
  ControlSetRow,
  DEFAULT_SORT_SERIES_DATA,
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
import { EchartsCustomLineStyleFormData } from './types';

export const PRIMARY_COLOR = { r: 0, g: 122, b: 135, a: 1 };

export const DEFAULT_FORM_DATA: Partial<EchartsCustomLineStyleFormData> = {
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
  seriesType: EchartsTimeseriesSeriesType.Line,
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
  seriesEdit: false,
  seriesSymbol: 'none',
  seriesSymbolSize: 20,
  seriesLineWidth: 4,
  seriesLineColor: PRIMARY_COLOR,
  seriesLineType: 'solid',
  seriesSymbolBorderWidth: 0,
  seriesSymbolBorderColor: PRIMARY_COLOR,
  seriesSymbolColor: PRIMARY_COLOR,
};

export const SERIES_SYMBOL_CHOICES = [
  ['circle', t('circle')],
  ['rect', t('rect')],
  ['roundRect', t('roundRect')],
  ['triangle', t('triangle')],
  ['diamond', t('diamond')],
  ['pin', t('pin')],
  ['arrow', t('arrow')],
  ['none', t('none')],
];
export const SERIES_LINE_TYPE_CHOICES = [
  ['solid', t('solid')],
  ['dashed', t('dashed')],
  ['dotted', t('dotted')],
];

export const customStyleElements: ControlSetRow[] = [
  [
    {
      name: 'series_edit',
      config: {
        type: 'CheckboxControl',
        label: t('Enable series edit'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesEdit,
        description: t('Enable series edit'),
      },
    },
  ],
  [
    {
      name: 'series_line_color',
      config: {
        type: 'ColorPickerControl',
        label: t('Line color'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesLineColor,
        description: t('Maximal Gradient Value.'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.series_edit?.value),
      },
    },
  ],
  [
    {
      name: 'markerEnabled',
      config: {
        type: 'CheckboxControl',
        label: t('Marker'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.markerEnabled,
        description: t(
          'Draw a marker on data points. Only applicable for line types.',
        ),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.series_edit?.value),
      },
    },
  ],
  [
    {
      name: 'series_line_type',
      config: {
        type: 'SelectControl',
        freeForm: false,
        label: t('Select series line type'),
        choices: SERIES_LINE_TYPE_CHOICES,
        default: DEFAULT_FORM_DATA.serieslineType,
        renderTrigger: true,
        description: t('You can select series line type'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.series_edit?.value),
      },
    },
  ],
  [
    {
      name: 'series_line_width',
      config: {
        type: 'SliderControl',
        label: t('Line Size'),
        renderTrigger: true,
        min: 0,
        max: 20,
        default: DEFAULT_FORM_DATA.seriesLineWidth,
        description: t('Size of line. Also applies to forecast observations.'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.series_edit?.value),
      },
    },
  ],
  [
    {
      name: 'series_symbol',
      config: {
        type: 'SelectControl',
        freeForm: false,
        label: t('Select series symbol'),
        choices: SERIES_SYMBOL_CHOICES,
        default: DEFAULT_FORM_DATA.seriesSymbol,
        renderTrigger: true,
        description: t('You can select series symbol'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.markerEnabled?.value),
      },
    },
  ],
  [
    {
      name: 'markerSize',
      config: {
        type: 'SliderControl',
        label: t('Marker Size'),
        renderTrigger: true,
        min: 0,
        max: 20,
        default: DEFAULT_FORM_DATA.markerSize,
        description: t(
          'Size of marker. Also applies to forecast observations.',
        ),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.markerEnabled?.value),
      },
    },
  ],
  [
    {
      name: 'series_symbol_border_width',
      config: {
        type: 'SliderControl',
        label: t('Marker border width'),
        renderTrigger: true,
        min: 0,
        max: 20,
        default: DEFAULT_FORM_DATA.markerSize,
        description: t(
          'Size of marker. Also applies to forecast observations.',
        ),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.markerEnabled?.value),
      },
    },
  ],
  [
    {
      name: 'series_symbol_border_color',
      config: {
        type: 'ColorPickerControl',
        label: t('Marker border color'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesSymbolBorderColor,
        description: t('Maximal Gradient Value.'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.markerEnabled?.value),
      },
    },
  ],
  [
    {
      name: 'series_symbol_color',
      config: {
        type: 'ColorPickerControl',
        label: t('Marker color'),
        renderTrigger: true,
        default: DEFAULT_FORM_DATA.seriesSymbolColor,
        description: t('Maximal Gradient Value.'),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          Boolean(controls?.markerEnabled?.value),
      },
    },
  ],
  // [
  //   {
  //     name: 'series_symbol_size',
  //     config: {
  //       type: 'TextControl',
  //       label: t('Symbol size'),
  //       renderTrigger: true,
  //       isInt: true,
  //       default: DEFAULT_FORM_DATA.seriesSymbolSize,
  //       description: t('Symbol size'),
  //       visibility: ({ controls }: ControlPanelsContainerProps) =>
  //         Boolean(controls?.series_edit?.value),
  //     },
  //   },
  // ],

  // [
  //   {
  //     name: 'series_line_width',
  //     config: {
  //       type: 'TextControl',
  //       label: t('Series line width'),
  //       renderTrigger: true,
  //       isInt: true,
  //       default: DEFAULT_FORM_DATA.serieslineWidth,
  //       description: t('Maximal Gradient Value.'),
  //       visibility: ({ controls }: ControlPanelsContainerProps) =>
  //         Boolean(controls?.series_edit?.value),
  //     },
  //   },
  // ],
];
