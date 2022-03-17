import fs from 'node:fs';
import path from 'node:path';
import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';

const iconsDir = path.resolve(process.cwd(), 'icons');

/**
 * Checks if icon data matches a subject icon.
 * @param {import('..').SimpleIcon} icon Icon data
 * @param {import('..').SimpleIcon} subject Icon to check against icon data
 * @param {String} slug Icon data slug
 */
export const testIcon = (icon, subject, slug) => {
  const svgPath = path.resolve(iconsDir, `${slug}.svg`);

  describe(icon.title, () => {
    it('has the correct "title"', () => {
      assert.equal(subject.title, icon.title);
    });

    it('has the correct "slug"', () => {
      assert.equal(subject.slug, slug);
    });

    it('has the correct "hex" value', () => {
      assert.equal(subject.hex, icon.hex);
    });

    it('has the correct "source"', () => {
      assert.equal(subject.source, icon.source);
    });

    it('has an "svg" value', () => {
      assert.equal(typeof subject.svg, 'string');
    });

    it('has a valid "path" value', () => {
      assert.match(subject.path, /^[MmZzLlHhVvCcSsQqTtAaEe0-9-,.\s]+$/g);
    });

    it(`has ${icon.guidelines ? 'the correct' : 'no'} "guidelines"`, () => {
      if (icon.guidelines) {
        assert.equal(subject.guidelines, icon.guidelines);
      } else {
        assert.equal(subject.guidelines, undefined);
      }
    });

    it(`has ${icon.license ? 'the correct' : 'no'} "license"`, () => {
      if (icon.license) {
        assert.equal(subject.license.type, icon.license.type);
        if (icon.license.type === 'custom') {
          assert.equal(subject.license.url, icon.license.url);
        } else {
          assert.match(subject.license.url, /^https?:\/\/[^\s]+$/);
        }
      } else {
        assert.equal(subject.license, undefined);
      }
    });

    it('has a valid svg value', () => {
      const svgFileContents = fs
        .readFileSync(svgPath, 'utf8')
        .replace(/\r?\n/, '');
      assert.equal(subject.svg, svgFileContents);
    });
  });
};
