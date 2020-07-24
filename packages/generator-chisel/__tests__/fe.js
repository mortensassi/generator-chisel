const globby = require('globby');
const fs = require('fs-extra');
const path = require('path');
const prettier = require('prettier');
const chisel = require('../bin/chisel');

const binPath = path.resolve(__dirname, '../bin/chisel.js');

global.chiselTestHelpers.tmpCurrentDirectory();

const defaultAnswers = (additionalFeatures = []) => (data) => [
  null,
  () => ({
    ...data,
    app: {
      name: 'FrontEnd',
      author: 'Xfive Tester',
      projectType: 'fe',
      browsers: ['modern', 'edge'],
    },
  }),
  () => ({
    ...data,
    fe: {
      additionalFeatures,
    },
  }),
];

describe('Static', () => {
  test('Generates all expected files and config', async () => {
    global.chiselTestHelpers.mockPromptAnswers(defaultAnswers());

    await chisel([
      process.argv[0],
      binPath,
      'create',
      '--skip-dependencies-install',
      '--skip-format-and-build',
    ]);

    const files = (await globby('./', { dot: true })).sort();

    expect(files).toMatchSnapshot();
    expect(
      prettier.format(await fs.readFile('./chisel.config.js', 'utf8'), {
        parser: 'babel',
      }),
    ).toMatchSnapshot();
  });

  test('Generates all expected files and config with serveDist', async () => {
    global.chiselTestHelpers.mockPromptAnswers(defaultAnswers(['serveDist']));

    await chisel([
      process.argv[0],
      binPath,
      'create',
      '--skip-dependencies-install',
      '--skip-fe-add-index',
      '--skip-format-and-build',
    ]);

    const files = (await globby('./', { dot: true })).sort();

    expect(files).toMatchSnapshot();
    expect(
      prettier.format(await fs.readFile('./chisel.config.js', 'utf8'), {
        parser: 'babel',
      }),
    ).toMatchSnapshot();
  });

  test('Generates all expected files and config with skipHtmlExtension', async () => {
    global.chiselTestHelpers.mockPromptAnswers(
      defaultAnswers(['skipHtmlExtension']),
    );

    await chisel([
      process.argv[0],
      binPath,
      'create',
      '--skip-dependencies-install',
      '--skip-format-and-build',
    ]);

    const files = (await globby('./', { dot: true })).sort();

    expect(files).toMatchSnapshot();
    expect(
      prettier.format(await fs.readFile('./chisel.config.js', 'utf8'), {
        parser: 'babel',
      }),
    ).toMatchSnapshot();
  });

  test('Generate and build FE Project', async () => {
    global.chiselTestHelpers.mockPromptAnswers(defaultAnswers());

    await chisel([process.argv[0], binPath, 'create']);

    // bug: hash of the css is depends on path of
    const files = (
      await globby(['./', '!node_modules', '!yarn.lock'], { dot: true })
    )
      .sort()
      .map((val) =>
        val.replace(/(?<=styles\/main\.)[a-z0-9]+(?=\.)/, '--HASH--'),
      );

    expect(files).toMatchSnapshot();
    expect(await fs.readFile('./chisel.config.js', 'utf8')).toMatchSnapshot();
  });
});
