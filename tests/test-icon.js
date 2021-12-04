import fs from 'fs';
import path from 'path';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const iconsDir = path.resolve(process.cwd(), 'icons');

/**
 * Checks if icon data matches a subject icon.
 * @param {import('..').SimpleIcon} icon Icon data
 * @param {import('..').SimpleIcon} subject Icon to check against icon data
 * @param {String} slug Icon data slug
 */
export const testIcon = (icon, subject, slug) => {
  const test = suite(icon.title);
  const svgPath = path.resolve(iconsDir, `${slug}.svg`);

  test('has the correct "title"', () => {
    assert.is(subject.title, icon.title);
  });

  test('has the correct "slug"', () => {
    assert.is(subject.slug, slug);
  });

  test('has the correct "hex" value', () => {
    assert.is(subject.hex, icon.hex);
  });

  test('has the correct "source"', () => {
    assert.is(subject.source, icon.source);
  });

  test('has an "svg" value', () => {
    assert.type(subject.svg, 'string');
  });

  test('has a valid "path" value', () => {
    assert.match(subject.path, /^[MmZzLlHhVvCcSsQqTtAaEe0-9-,.\s]+$/g);
  });

  test(`has ${icon.guidelines ? 'the correct' : 'no'} "guidelines"`, () => {
    if (icon.guidelines) {
      assert.is(subject.guidelines, icon.guidelines);
    } else {
      assert.is(subject.guidelines, undefined);
    }
  });

  test(`has ${icon.license ? 'the correct' : 'no'} "license"`, () => {
    if (icon.license) {
      assert.is(subject.license.type, icon.license.type);
      if (icon.license.type === 'custom') {
        assert.is(subject.license.url, icon.license.url);
      } else {
        assert.match(subject.license.url, /^https?:\/\/[^\s]+$/);
      }
    } else {
      assert.is(subject.license, undefined);
    }
  });

  test('has a valid svg value', () => {
    const svgFileContents = fs
      .readFileSync(svgPath, 'utf8')
      .replace(/\r?\n/, '');
    assert.is(subject.svg, svgFileContents);
  });

  test.run();
};
