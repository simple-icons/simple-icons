export type SimpleIcon = {
  title: string;
  slug: string;
  svg: string;
  path: string;
  source: string;
  hex: string;
  guidelines?: string | undefined;
  license?:
    | {
        type: string;
        url: string;
      }
    | undefined;
};

/**
 * @deprecated The `simple-icons` entrypoint will be removed in the next major. Please switch to using `import * as icons from "simple-icons/icons"` if you need an object with all the icons.
 */
declare const icons: Record<string, SimpleIcon> & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Get(name: string): SimpleIcon;
};

export default icons;
