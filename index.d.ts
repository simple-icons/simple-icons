export interface SimpleIcon {
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
}

export type I = SimpleIcon;

declare const icons: Record<string, SimpleIcon> & {
  /**
   * @deprecated use .Get instead
   */
  get(name: string): SimpleIcon;
  Get(name: string): SimpleIcon;
};

export default icons;
