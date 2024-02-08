import SmoothScrollbar, { ScrollbarPlugin } from "smooth-scrollbar";

export class ScrollLockPlugin extends ScrollbarPlugin {
    static pluginName = "scroll-lock";

    static defaultOptions = {
        x_locked: false,
        y_locked: false,
    };

    transformDelta(delta: any) {
        return {
            x: this.options.x_locked ? 0 : delta.x,
            y: this.options.y_locked ? 0 : delta.y,
        };
    }
}

SmoothScrollbar.use(ScrollLockPlugin);
