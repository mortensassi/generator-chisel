const fs = require('fs-extra');

global.chiselTestHelpers.tmpCurrentDirectory();

const defaultAnswers = [
  null,
  {
    app: {
      name: 'FrontEnd',
      author: 'Xfive Tester',
      projectType: 'fe',
      browsers: ['modern', 'edge'],
    },
  },
  {
    fe: {
      additionalFeatures: [],
    },
  },
];

function pageMatchesSnapshot() {
  expect(
    fs
      .readFileSync('./dist/some-page.html', 'utf8')
      .replace(/(?<=styles\/main\.)[a-z0-9]+(?=\.)/g, '--HASH--'),
  ).toMatchSnapshot();
}

describe('FE Build', () => {
  test('Generate and build FE Project and process twigs and assets', async () => {
    await global.chiselTestHelpers.generateProjectWithAnswers(
      ['create', '--link', '--skip-format-and-build'],
      defaultAnswers,
    );

    //
    // test simple build
    //

    const consoleMock = jest.spyOn(console, 'log');
    await global.chiselTestHelpers.runChiselScript(['build']);

    global.chiselTestHelpers.fixHashesInConsoleMock(consoleMock);
    expect(consoleMock.mock.calls).toMatchSnapshot();
    consoleMock.mockClear();

    await global.chiselTestHelpers.expectFilesToMatchSnapshot(['./dist']);

    //
    // test assets, public, twig processing
    //

    fs.outputFileSync('./src/assets/hello.txt', 'hello content');
    fs.outputFileSync('./src/assets/not-used.bin', 'hello not used content');
    fs.outputFileSync('./src/assets/nested/hello.txt', 'nested hello content');
    fs.outputFileSync(
      './src/assets/nested/hello-not-used.txt',
      'nested hello not used content',
    );
    // bug?: deeply nested paths are not preserved
    fs.outputFileSync(
      './src/assets/deeply/nested/file.abc',
      'nested deeply file content',
    );
    fs.outputFileSync('./public/public.txt', 'public file');
    fs.outputFileSync('./public/nested/public.jpg', 'public jpg');
    fs.outputFileSync('./public/very/deeply/nested/file.png', 'file png');

    fs.outputFileSync(
      './src/templates/some-page.twig',
      `
        {% extends "layouts/base.twig" %}
        {% set pageName = 'Some Page' %}

        {% block content %}
          <h1>Hello <span class="js-greeting"></span></h1>
          <ul>
              <li>{{ assetPath('hello.txt') }}</li>
              <li>{{ assetPath('deeply/nested/file.abc') }}</li>
              <li>{{ assetPath('nested/hello.txt') }}</li>
          </ul>
        {% endblock %}
      `,
    );

    await global.chiselTestHelpers.runChiselScript(['build']);

    global.chiselTestHelpers.fixHashesInConsoleMock(consoleMock);
    expect(consoleMock.mock.calls).toMatchSnapshot();
    consoleMock.mockClear();

    await global.chiselTestHelpers.expectFilesToMatchSnapshot(['./dist']);

    pageMatchesSnapshot();
  });

  const somePageSimple = `
    {% extends "layouts/base.twig" %}
    {% set pageName = 'Some Page' %}
    {% block content %}
      <h1>Hello <span class="js-greeting"></span></h1>
    {% endblock %}
  `;

  test('Generate and build FE Project and minify', async () => {
    await global.chiselTestHelpers.generateProjectWithAnswers(
      ['create', '--link', '--skip-format-and-build'],
      defaultAnswers,
    );

    fs.outputFileSync('./src/templates/some-page.twig', somePageSimple);

    await fs.writeFile(
      './chisel.config.js',
      (await fs.readFile('./chisel.config.js', 'utf8')).replace(
        'staticFrontend: {',
        "staticFrontend: { buildFormat: 'minify',",
      ),
    );

    await global.chiselTestHelpers.runChiselScript(['build']);

    pageMatchesSnapshot();
  });

  test("Generate and build FE Project and don't format", async () => {
    await global.chiselTestHelpers.generateProjectWithAnswers(
      ['create', '--link', '--skip-format-and-build'],
      defaultAnswers,
    );

    fs.outputFileSync('./src/templates/some-page.twig', somePageSimple);

    await fs.writeFile(
      './chisel.config.js',
      (await fs.readFile('./chisel.config.js', 'utf8')).replace(
        'staticFrontend: {',
        "staticFrontend: { buildFormat: 'as-is',",
      ),
    );

    await global.chiselTestHelpers.runChiselScript(['build']);

    pageMatchesSnapshot();
  });
});
