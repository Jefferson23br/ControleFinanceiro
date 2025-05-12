declare module 'react-native-svg-charts' {
  import { ViewProps } from 'react-native';
  import { SvgProps } from 'react-native-svg';

  export interface BarChartProps<T> extends ViewProps {
    data: T[];
    yAccessor: (props: { item: T }) => number;
    contentInset?: { top?: number; bottom?: number; left?: number; right?: number };
    style?: ViewProps['style'];
  }

  export class BarChart<T> extends React.Component<BarChartProps<T>> {}
}