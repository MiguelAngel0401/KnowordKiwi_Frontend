import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a youtube video
       */
      setYoutubeVideo: (options: { src: string; start?: number }) => ReturnType;
    };
  }
}

export interface YoutubeOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
  allowFullscreen: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  pip: boolean;
  quality:
    | "auto"
    | "small"
    | "medium"
    | "large"
    | "hd720"
    | "hd1080"
    | "highres"
    | (string & {});
}

const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const Youtube = Node.create<YoutubeOptions>({
  name: "youtube",

  addOptions() {
    return {
      inline: false,
      allowFullscreen: true,
      autoplay: false,
      loop: false,
      muted: false,
      pip: false,
      quality: "auto",
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      start: {
        default: 0,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video] iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = this.options.HTMLAttributes.class?.includes("mb-4")
      ? HTMLAttributes.src
      : `${HTMLAttributes.src}&autoplay=${this.options.autoplay ? "1" : "0"}&loop=${this.options.loop ? "1" : "0"}&mute=${this.options.muted ? "1" : "0"}&pip=${this.options.pip ? "1" : "0"}&quality=${this.options.quality}`;

    return [
      "div",
      { "data-youtube-video": "" },
      [
        "div",
        { class: "relative pt-[56.25%] h-0 mb-4" }, // 16:9 Aspect Ratio
        [
          "iframe",
          mergeAttributes(this.options.HTMLAttributes, {
            src: HTMLAttributes.src,
            width: HTMLAttributes.width || "100%",
            height: HTMLAttributes.height || "100%",
            allowfullscreen: this.options.allowFullscreen,
            class: "absolute top-0 left-0 w-full h-full rounded-lg border-0",
          }),
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options) =>
        ({ commands }) => {
          if (!options.src) {
            return false;
          }
          const videoId = getYouTubeVideoId(options.src);

          if (!videoId) {
            return false;
          }

          const startTime = options.start ? `&start=${options.start}` : "";
          const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${startTime}`;

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: embedUrl,
              start: options.start,
            },
          });
        },
    };
  },
});
