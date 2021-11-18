const fs = require('fs');
const path = require('path');

const iconsDir = path.resolve(process.cwd(), 'icons');

/**
 * Checks if icon data matches a subject icon.
 * @param {import('..').SimpleIcon} icon Icon data
 * @param {import('..').SimpleIcon} subject Icon to check against icon data
 * @param {String} slug Icon data slug
 */
const testIcon = (icon, subject, slug) => {
  describe(icon.title, () => {
    const svgPath = path.resolve(iconsDir, `${slug}.svg`);

    it('has the correct "title"', () => {
      expect(subject.title).toStrictEqual(icon.title);
    });

    it('has the correct "slug"', () => {
      expect(subject.slug).toStrictEqual(slug);
    });

    it('has the correct "hex" value', () => {
      expect(subject.hex).toStrictEqual(icon.hex);
    });

    it('has the correct "source"', () => {
      expect(subject.source).toStrictEqual(icon.source);
    });

    it('has an "svg" value', () => {
      expect(typeof subject.svg).toBe('string');
    });

    it('has a valid "path" value', () => {
      expect(subject.path).toMatch(/^[MmZzLlHhVvCcSsQqTtAaEe0-9-,.\s]+$/g);
    });

    it(`has ${icon.guidelines ? 'the correct' : 'no'} "guidelines"`, () => {
      if (icon.guidelines) {
        expect(subject.guidelines).toStrictEqual(icon.guidelines);
      } else {
        expect(subject.guidelines).toBeUndefined();
      }
    });

    it(`has ${icon.license ? 'the correct' : 'no'} "license"`, () => {
      if (icon.license) {
        expect(subject.license).toHaveProperty('type', icon.license.type);
        if (icon.license.type === 'custom') {
          expect(subject.license).toHaveProperty('url', icon.license.url);
        } else {
          expect(subject.license.url).toMatch(/^https?:\/\/[^\s]+$/);
        }
      } else {
        expect(subject.license).toBeUndefined();
      }
    });

    it('has a valid svg value', () => {
      const svgFileContents = fs
        .readFileSync(svgPath, 'utf8')
        .replace(/\r?\n/, '');

      expect(subject.svg.substring(subject.svg.indexOf('<title>'))).toEqual(
        svgFileContents.substring(svgFileContents.indexOf('<title>')),
      );
    });
  });
};

module.exports = testIcon;
