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
  ControlPanelConfig,
  formatSelectOptions,
  sections,
  ControlPanelsContainerProps,
  sharedControls,
  D3_FORMAT_OPTIONS,
  D3_FORMAT_DOCS,
  D3_NUMBER_FORMAT_DESCRIPTION_VALUES_TEXT,
} from '@superset-ui/chart-controls';

import { DEFAULT_FORM_DATA } from './constants';
import {
  legendSection,
  truncateXAxis,
  xAxisBounds,
  xAxisLabelRotation,
} from '../controls';
import { defaultYAxis } from '../defaults';

const { logAxis, numberFormat, showLabels } = DEFAULT_FORM_DATA;

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['x'],
        // ['groupby'],
        ['metric'],

        ['series'],
        ['row_limit'],
        ['adhoc_filters'],
        [
          {
            name: 'sort_by_metric',
            config: {
              default: true,
              type: 'CheckboxControl',
              label: t('Sort by metric'),
              description: t(
                'Whether to sort results by the selected metric in descending order.',
              ),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        ['color_scheme'],
        ...legendSection,
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Number format'),
              renderTrigger: true,
              default: numberFormat,
              choices: D3_FORMAT_OPTIONS,
              description: `${D3_FORMAT_DOCS} ${D3_NUMBER_FORMAT_DESCRIPTION_VALUES_TEXT}`,
            },
          },
        ],
        ['currency_format'],
        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              default: showLabels,
              description: t('Whether to display the labels.'),
            },
          },
        ],
        [
          {
            name: 'show_tooltip_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Tooltip Labels'),
              renderTrigger: true,
              default: showLabels,
              description: t('Whether to display the tooltip labels.'),
            },
          },
        ],
        // [
        //   {
        //     name: 'color',
        //     config: {
        //       type: 'TextControl',
        //       label: t('Bars Color'),
        //       renderTrigger: true,
        //       default: color,
        //       description: t('Color of bars'),
        //     },
        //   },
        // ],
        // [
        //   {
        //     name: 'opacity',
        //     config: {
        //       type: 'SliderControl',
        //       label: t('Bars Opacity'),
        //       renderTrigger: true,
        //       min: 0,
        //       max: 1,
        //       step: 0.1,
        //       default: opacity,
        //       description: t(
        //         'Opacity of bars, 0 means completely transparent, 1 means opaque',
        //       ),
        //     },
        //   },
        // ],
      ],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'x_axis_title_margin',
            config: {
              type: 'SelectControl',
              freeForm: true,
              clearable: true,
              label: t('X AXIS TITLE MARGIN'),
              renderTrigger: true,
              default: sections.TITLE_MARGIN_OPTIONS[1],
              choices: formatSelectOptions(sections.TITLE_MARGIN_OPTIONS),
            },
          },
        ],
        [
          {
            name: 'xAxisFormat',
            config: {
              ...sharedControls.y_axis_format,
              label: t('X Axis Format'),
            },
          },
        ],
        [
          {
            name: 'logXAxis',
            config: {
              type: 'CheckboxControl',
              label: t('Logarithmic x-axis'),
              renderTrigger: true,
              default: logAxis,
              description: t('Logarithmic x-axis'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
