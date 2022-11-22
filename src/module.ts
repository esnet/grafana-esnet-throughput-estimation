import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'labelx',
      name: 'Label: X Axis',
      description: 'Label for X Axis',
      defaultValue: 'Year',
    })
    .addSelect({
      path: "scalex",
      name: "X Axis Scale",
      description: "",
      defaultValue: "linear",
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'linear',
            label: 'linear',
          },
          {
            value: 'logarithmic',
            label: 'logarithmic',
          },
        ]
      }
    })
    .addSelect({
      path: "tickFormatX",
      name: "X Axis Tick Format",
      description: "",
      defaultValue: "%Y",
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: '%Y',
            label: 'Year',
          },
          {
            value: '%b %Y',
            label: 'Month (abbrev) + Year',
          },
          {
            value: '%m-%Y',
            label: 'Month (numeric)-Year',
          },
          {
            value: '%Y-%m',
            label: 'Year-Month (numeric)',
          },
        ]
      }
    })
    .addTextInput({
      path: 'labely',
      name: 'Label: Y Axis',
      description: 'Label for Y Axis',
      defaultValue: 'Data',
    })
    .addSelect({
      path: "scaley",
      name: "Y Axis Scale",
      description: "",
      defaultValue: "linear",
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'linear',
            label: 'linear',
          },
          {
            value: 'logarithmic',
            label: 'logarithmic',
          },
        ]
      }
    })
    .addSelect({
      path: "tickFormatY",
      name: "Y Axis Tick Format",
      description: "",
      defaultValue: "%Y",
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'd',
            label: 'Raw Units',
          },
          {
            value: 'bytes',
            label: 'Bit/Byte Size',
          },
        ]
      }
    })    .addSelect({
      path: 'algorithm',
      name: 'Projection Algorithm',
      description: 'Algorithm for projection line',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'linear',
            label: 'linear',
          },
          {
            value: 'exponential',
            label: 'exponential',
          },
          {
            value: 'logarithmic',
            label: 'logarithmic',
          },
          {
            value: 'power',
            label: 'power',
          },
          {
            value: 'polynomial',
            label: 'polynomial',
          },
        ]
      }
    })

    .addSliderInput({
      path: 'defaultTimeValue',
      name: 'Default Duration',
      description: 'Default value for time slider at panel top',
      defaultValue: 6,
      settings: {
        min: 1,
        max: 100,
        step: 1,
      },
    })
    .addSelect({
      path: 'defaultTimeInterval',
      name: 'Default Duration Time Unit',
      description: 'Default unit associated with time slider',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'seconds',
            label: 'seconds',
          },
          {
            value: 'minutes',
            label: 'minutes',
          },
          {
            value: 'hours',
            label: 'hours',
          },
          {
            value: 'days',
            label: 'days',
          },
          {
            value: 'months',
            label: 'months',
          },
          {
            value: 'years',
            label: 'years',
          },
        ]
      }
    })


    .addSliderInput({
      path: 'boundary',
      name: 'Dashed Line Boundary',
      defaultValue: 10,
      settings: {
        min: 1,
        max: 100,
        step: 1,
      },
    })
    .addSelect({
      path: 'boundaryUnits',
      name: 'Dashed Line Boundary Units',
      description: 'Units for Boundary Line',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 1,
            label: '1',
          },
          {
            value: 10,
            label: "10"
          },
          {
            value: 100,
            label: "100"
          },
          {
            value: 1000,
            label: "1k"
          },
          {
            value: 10000,
            label: "10k"
          },
          {
            value: 100000,
            label: "100k"
          },
          {
            value: 1000000,
            label: "1m"
          },
          {
            value: 1024**2,
            label: '1Mib',
          },
          {
            value: 1024**3,
            label: '1Gib',
          },
          {
            value: 1024**4,
            label: '1Tib',
          },
          {
            value: 1024**5,
            label: '1Pib',
          },
        ],
      }
    });
});
