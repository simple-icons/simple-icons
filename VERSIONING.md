# Versioning

We use [Semantic Versioning](https://semver.org/) to version Simple Icons. In short, this means that version numbers are structured as `MAJOR.MINOR.PATCH`. For example, version `3.1.4` is major version `3`, minor version `1`, and patch `4`. Increasing each of these numbers implies certain kinds of changes.

For Simple Icons, given a change to the version number you can expect the following kinds of changes:

| Version number increase | Kinds of changes |
| :---- | :---- |
| _Major_ | Removed icons; Renamed icons; Breaking API changes |
| _Minor_ | New icons; API changes |
| _Patch_ | Updated SVGs; Updated metadata |

## Release Schedule

_Minor_ releases and _patches_ are scheduled on a weekly basis and are generally released on a Sunday.

_Major_ releases are scheduled on a half-year basis, mainly to remove old SVGs. That is, approximately every 6 months a normal Sunday release is a _major_ release instead of a _minor_ release or _patch_.

## Deprecation

For approximately 3 months after a _major_ release, the _major_ release preceding it will be supported. After 3 months, the previous _major_ release is deprecated and will no longer be supported.

Support of a _major_ version entails the following:

- SVGs and metadata of brands will be updated on request. This excludes brands that were removed in the new _major_ release.
- Bugs in the npm library will be updated if reported.
