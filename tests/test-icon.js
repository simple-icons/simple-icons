/**
 * Checks if icon data matches a subject icon.
 * @param {import('../index').SimpleIcon} icon Icon data
 * @param {import('../index').SimpleIcon} subject Icon to check against icon data
 * @param {String} slug Icon data slug
 */
const testIcon = (icon, subject, slug) => {
  describe(icon.title, () => {
    it('has the correct "title"', () => {
      expect(typeof subject.title).toBe('string');
      expect(subject.title).toStrictEqual(icon.title);
    });

    it('has the correct "slug"', () => {
      expect(typeof subject.slug).toBe('string');
      expect(subject.slug).toEqual(slug);
    });

    it('has the correct "hex" value', () => {
      expect(typeof subject.hex).toBe('string');
      expect(subject.hex).toEqual(icon.hex);
    });

    it('has the correct "source"', () => {
      expect(typeof subject.source).toBe('string');
      expect(subject.source).toEqual(icon.source);
    });

    it('has an "svg" value', () => {
      expect(typeof subject.svg).toBe('string');
    });

    it('has a valid "path" value', () => {
      expect(typeof subject.path).toBe('string');
      expect(subject.path).toMatch(/^[MmZzLlHhVvCcSsQqTtAaEe0-9-,.\s]+$/g);
    });

    it(`has ${icon.guidelines ? 'the correct' : 'no'} "guidelines"`, () => {
      if (icon.guidelines) {
        expect(typeof subject.guidelines).toBe('string');
        expect(subject.guidelines).toEqual(icon.guidelines);
      } else {
        expect(subject.guidelines).toBeUndefined();
      }
    });

    it(`has ${icon.license ? 'the correct' : 'no'} "license"`, () => {
      if (icon.license) {
        expect(typeof subject.license).toBe('object');
        expect(subject.license).toHaveProperty('type', icon.license.type);
        if (icon.license.type === 'custom') {
          expect(subject.license).toHaveProperty('url', icon.license.url);
        } else {
          expect(typeof subject.license.url).toBe('string');
          expect(subject.license.url).toMatch(/^https?:\/\/[^\s]+$/);
        }
      } else {
        expect(subject.license).toBeUndefined();
      }
    });
  });
};

module.exports = testIcon;
