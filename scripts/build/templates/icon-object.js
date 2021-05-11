{
  title: '%s',
  slug: '%s',
  svg: '%s',
  get path() {
    return this.svg.match(/<path\s+d="([^"]*)/)[1];
  },
  source: '%s',
  hex: '%s',
  guidelines: %s,
  license: %s,
}
