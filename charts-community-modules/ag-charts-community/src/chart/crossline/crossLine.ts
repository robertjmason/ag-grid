import { PointerEvents } from '../../scene/node';
import { Group } from '../../scene/group';
import { Text } from '../../scene/shape/text';
import { BBox } from '../../scene/bbox';
import { Scale } from '../../scale/scale';
import { ContinuousScale } from '../../scale/continuousScale';
import { createId } from '../../util/id';
import { ChartAxisDirection } from '../chartAxisDirection';
import {
    CrossLineLabelPosition,
    labeldDirectionHandling,
    POSITION_TOP_COORDINATES,
    calculateLabelTranslation,
} from './crossLineLabelPosition';
import { checkDatum } from '../../util/value';
import { Layers } from '../layers';
import { Point } from '../../scene/point';
import { Range } from '../../scene/shape/range';
import {
    OPT_ARRAY,
    OPT_BOOLEAN,
    OPT_NUMBER,
    OPT_STRING,
    OPT_COLOR_STRING,
    STRING,
    Validate,
    OPT_LINE_DASH,
    OPT_FONT_STYLE,
    OPT_FONT_WEIGHT,
    NUMBER,
    OPTIONAL,
    predicateWithMessage,
} from '../../util/validation';
import { FontStyle, FontWeight, AgCrossLineLabelPosition } from '../agChartOptions';
import { calculateLabelRotation } from '../label';

const CROSSLINE_LABEL_POSITIONS = [
    'top',
    'left',
    'right',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'inside',
    'insideLeft',
    'insideRight',
    'insideTop',
    'insideBottom',
    'insideTopLeft',
    'insideBottomLeft',
    'insideTopRight',
    'insideBottomRight',
];

const OPT_CROSSLINE_LABEL_POSITION = predicateWithMessage(
    (v: any, ctx) => OPTIONAL(v, ctx, (v: any) => CROSSLINE_LABEL_POSITIONS.includes(v)),
    `expecting an optional crossLine label position keyword such as 'topLeft', 'topRight' or 'inside'`
);

const OPT_CROSSLINE_TYPE = predicateWithMessage(
    (v: any, ctx) => OPTIONAL(v, ctx, (v: any) => v === 'range' || v === 'line'),
    `expecting a crossLine type keyword such as 'range' or 'line'`
);

class CrossLineLabel {
    @Validate(OPT_BOOLEAN)
    enabled?: boolean = undefined;

    @Validate(OPT_STRING)
    text?: string = undefined;

    @Validate(OPT_FONT_STYLE)
    fontStyle?: FontStyle = undefined;

    @Validate(OPT_FONT_WEIGHT)
    fontWeight?: FontWeight = undefined;

    @Validate(NUMBER(0))
    fontSize: number = 14;

    @Validate(STRING)
    fontFamily: string = 'Verdana, sans-serif';

    /**
     * The padding between the label and the line.
     */
    @Validate(NUMBER(0))
    padding: number = 5;

    /**
     * The color of the labels.
     */
    @Validate(OPT_COLOR_STRING)
    color?: string = 'rgba(87, 87, 87, 1)';

    @Validate(OPT_CROSSLINE_LABEL_POSITION)
    position?: CrossLineLabelPosition = undefined;

    @Validate(OPT_NUMBER(-360, 360))
    rotation?: number = undefined;

    @Validate(OPT_BOOLEAN)
    parallel?: boolean = undefined;
}

type NodeData = number[];

type CrossLineType = 'line' | 'range';

export class CrossLine {
    protected static readonly LINE_LAYER_ZINDEX = Layers.SERIES_CROSSLINE_LINE_ZINDEX;
    protected static readonly RANGE_LAYER_ZINDEX = Layers.SERIES_CROSSLINE_RANGE_ZINDEX;

    static className = 'CrossLine';
    readonly id = createId(this);

    @Validate(OPT_BOOLEAN)
    enabled?: boolean = undefined;

    @Validate(OPT_CROSSLINE_TYPE)
    type?: CrossLineType = undefined;

    @Validate(OPT_ARRAY(2))
    range?: [any, any] = undefined;
    value?: any = undefined;

    @Validate(OPT_COLOR_STRING)
    fill?: string = undefined;

    @Validate(OPT_NUMBER(0, 1))
    fillOpacity?: number = undefined;

    @Validate(OPT_COLOR_STRING)
    stroke?: string = undefined;

    @Validate(OPT_NUMBER())
    strokeWidth?: number = undefined;

    @Validate(OPT_NUMBER(0, 1))
    strokeOpacity?: number = undefined;

    @Validate(OPT_LINE_DASH)
    lineDash?: [] = undefined;

    label: CrossLineLabel = new CrossLineLabel();

    scale?: Scale<any, number> = undefined;
    clippedRange: [number, number] = [-Infinity, Infinity];
    gridLength: number = 0;
    sideFlag: 1 | -1 = -1;
    parallelFlipRotation: number = 0;
    regularFlipRotation: number = 0;
    direction: ChartAxisDirection = ChartAxisDirection.X;

    readonly group = new Group({ name: `${this.id}`, layer: true, zIndex: CrossLine.LINE_LAYER_ZINDEX });
    private crossLineRange: Range = new Range();
    private crossLineLabel = new Text();
    private labelPoint?: Point = undefined;

    private data: NodeData = [];
    private startLine: boolean = false;
    private endLine: boolean = false;
    private isRange: boolean = false;

    constructor() {
        const { group, crossLineRange, crossLineLabel } = this;

        group.append([crossLineRange, crossLineLabel]);

        crossLineRange.pointerEvents = PointerEvents.None;
    }

    update(visible: boolean) {
        if (!this.enabled) {
            return;
        }

        this.group.visible = visible;

        if (!visible) {
            return;
        }

        const dataCreated = this.createNodeData();

        if (!dataCreated) {
            this.group.visible = false;
            return;
        }

        this.updateNodes();

        this.group.zIndex = this.getZIndex(this.isRange);
    }

    private updateNodes() {
        this.updateRangeNode();

        if (this.label.enabled) {
            this.updateLabel();
            this.positionLabel();
        }
    }

    private createNodeData(): boolean {
        const {
            scale,
            gridLength,
            sideFlag,
            direction,
            label: { position = 'top' },
            clippedRange,
            strokeWidth = 0,
        } = this;

        if (!scale) {
            return false;
        }

        const bandwidth = scale.bandwidth ?? 0;
        const clippedRangeClamper = (x: number) =>
            Math.max(Math.min(...clippedRange), Math.min(Math.max(...clippedRange), x));

        const [xStart, xEnd] = [0, sideFlag * gridLength];
        let [yStart, yEnd] = this.getRange();

        let [clampedYStart, clampedYEnd] = [
            Number(scale.convert(yStart, { strict: false })),
            scale.convert(yEnd, { strict: false }) + bandwidth,
        ];
        clampedYStart = clippedRangeClamper(clampedYStart);
        clampedYEnd = clippedRangeClamper(clampedYEnd);
        [yStart, yEnd] = [Number(scale.convert(yStart)), scale.convert(yEnd) + bandwidth];

        const validRange =
            !isNaN(clampedYStart) &&
            !isNaN(clampedYEnd) &&
            (yStart === clampedYStart || yEnd === clampedYEnd || clampedYStart !== clampedYEnd) &&
            Math.abs(clampedYEnd - clampedYStart) > 0;

        if (validRange) {
            const reverse = clampedYStart !== Math.min(clampedYStart, clampedYEnd);

            if (reverse) {
                [clampedYStart, clampedYEnd] = [
                    Math.min(clampedYStart, clampedYEnd),
                    Math.max(clampedYStart, clampedYEnd),
                ];
                [yStart, yEnd] = [yEnd, yStart];
            }
        }

        this.isRange = validRange;
        this.startLine = !isNaN(yStart) && strokeWidth > 0 && yStart === clampedYStart;
        this.endLine = !isNaN(yEnd) && strokeWidth > 0 && yEnd === clampedYEnd;

        if (!validRange && !this.startLine && !this.endLine) {
            return false;
        }

        this.data = [clampedYStart, clampedYEnd];

        if (this.label.enabled) {
            const yDirection = direction === ChartAxisDirection.Y;

            const { c = POSITION_TOP_COORDINATES } = labeldDirectionHandling[position] ?? {};
            const { x: labelX, y: labelY } = c({ yDirection, xStart, xEnd, yStart: clampedYStart, yEnd: clampedYEnd });

            this.labelPoint = {
                x: labelX,
                y: labelY,
            };
        }

        return true;
    }

    private updateRangeNode() {
        const {
            crossLineRange,
            sideFlag,
            gridLength,
            data,
            startLine,
            endLine,
            isRange,
            fill,
            fillOpacity,
            stroke,
            strokeWidth,
            lineDash,
        } = this;

        crossLineRange.x1 = 0;
        crossLineRange.x2 = sideFlag * gridLength;
        crossLineRange.y1 = data[0];
        crossLineRange.y2 = data[1];
        crossLineRange.startLine = startLine;
        crossLineRange.endLine = endLine;
        crossLineRange.isRange = isRange;

        crossLineRange.fill = fill;
        crossLineRange.fillOpacity = fillOpacity ?? 1;

        crossLineRange.stroke = stroke;
        crossLineRange.strokeWidth = strokeWidth ?? 1;
        crossLineRange.strokeOpacity = this.strokeOpacity ?? 1;
        crossLineRange.lineDash = lineDash;
    }

    private updateLabel() {
        const { crossLineLabel, label } = this;

        if (!label.text) {
            return;
        }

        crossLineLabel.fontStyle = label.fontStyle;
        crossLineLabel.fontWeight = label.fontWeight;
        crossLineLabel.fontSize = label.fontSize;
        crossLineLabel.fontFamily = label.fontFamily;
        crossLineLabel.fill = label.color;
        crossLineLabel.text = label.text;
    }

    private positionLabel() {
        const {
            crossLineLabel,
            labelPoint: { x = undefined, y = undefined } = {},
            label: { parallel, rotation, position = 'top', padding = 0 },
            direction,
            parallelFlipRotation,
            regularFlipRotation,
        } = this;

        if (x === undefined || y === undefined) {
            return;
        }

        const { autoRotation, labelRotation } = calculateLabelRotation({
            rotation,
            parallel,
            regularFlipRotation,
            parallelFlipRotation,
        });

        crossLineLabel.rotation = autoRotation + labelRotation;

        crossLineLabel.textBaseline = 'middle';
        crossLineLabel.textAlign = 'center';

        const bbox = this.computeLabelBBox();

        if (!bbox) {
            return;
        }

        const yDirection = direction === ChartAxisDirection.Y;
        const { xTranslation, yTranslation } = calculateLabelTranslation({ yDirection, padding, position, bbox });

        crossLineLabel.translationX = x + xTranslation;
        crossLineLabel.translationY = y + yTranslation;
    }

    protected getZIndex(isRange: boolean = false): number {
        if (isRange) {
            return CrossLine.RANGE_LAYER_ZINDEX;
        }

        return CrossLine.LINE_LAYER_ZINDEX;
    }

    private getRange(): [any, any] {
        const { value, range, scale } = this;

        const isContinuous = scale instanceof ContinuousScale;

        let [start, end] = range ?? [value, undefined];

        if (!isContinuous && end === undefined) {
            end = start;
        }

        start = checkDatum(start, isContinuous) != null ? start : undefined;
        end = checkDatum(end, isContinuous) != null ? end : undefined;

        if (isContinuous && start === end) {
            end = undefined;
        }

        if (start === undefined && end !== undefined) {
            start = end;
            end = undefined;
        }

        return [start, end];
    }

    private computeLabelBBox(): BBox | undefined {
        return this.crossLineLabel.computeTransformedBBox();
    }

    calculatePadding(padding: Partial<Record<AgCrossLineLabelPosition, number>>, seriesRect: BBox) {
        const { isRange, startLine, endLine } = this;
        if (!isRange && !startLine && !endLine) {
            return;
        }

        const crossLineLabelBBox = this.computeLabelBBox();

        const labelX = crossLineLabelBBox?.x;
        const labelY = crossLineLabelBBox?.y;

        if (labelX == undefined || labelY == undefined) {
            return;
        }

        const labelWidth = crossLineLabelBBox?.width ?? 0;
        const labelHeight = crossLineLabelBBox?.height ?? 0;

        if (labelWidth > seriesRect.width || labelHeight > seriesRect.height) {
            // If label is bigger than seriesRect, trying to pad is just going to cause
            // layout instability.
            return;
        }

        if (labelX + labelWidth >= seriesRect.x + seriesRect.width) {
            const paddingRight = labelX + labelWidth - (seriesRect.x + seriesRect.width);
            padding.right = (padding.right ?? 0) >= paddingRight ? padding.right : paddingRight;
        } else if (labelX <= seriesRect.x) {
            const paddingLeft = seriesRect.x - labelX;
            padding.left = (padding.left ?? 0) >= paddingLeft ? padding.left : paddingLeft;
        }

        if (labelY + labelHeight >= seriesRect.y + seriesRect.height) {
            const paddingBottom = labelY + labelHeight - (seriesRect.y + seriesRect.height);
            padding.bottom = (padding.bottom ?? 0) >= paddingBottom ? padding.bottom : paddingBottom;
        } else if (labelY <= seriesRect.y) {
            const paddingTop = seriesRect.y - labelY;
            padding.top = (padding.top ?? 0) >= paddingTop ? padding.top : paddingTop;
        }
    }
}
