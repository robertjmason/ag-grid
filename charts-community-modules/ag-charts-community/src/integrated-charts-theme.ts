import { themes as themeFactories } from './chart/mapping/themes';
import { ChartTheme as ChartThemeType } from './chart/themes/chartTheme';

export { getChartTheme } from './chart/mapping/themes';
export {
    ChartTheme,
    EXTENDS_SERIES_DEFAULTS,
    OVERRIDE_SERIES_LABEL_DEFAULTS,
    DEFAULT_FONT_FAMILY,
} from './chart/themes/chartTheme';

export const themes = Object.entries(themeFactories).reduce((obj, [name, factory]) => {
    obj[name as keyof typeof themeFactories] = factory!();
    return obj;
}, {} as Record<keyof typeof themeFactories, ChartThemeType>);
