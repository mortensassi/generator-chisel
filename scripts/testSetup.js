/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs-extra');
const path = require('path');
const { merge } = require('lodash');
const globby = require('globby');
const Module = require('module');

process.env.CHISEL_TEST = true;

global.chiselTestHelpers = {
  tmpCurrentDirectory() {
    const initialDir = process.cwd();

    beforeEach(() => {
      const now = new Date().toISOString().replace(/[^\w\d]/g, '');
      const dir = path.resolve(initialDir, '.jest-projects', now);
      fs.mkdirpSync(dir);
      process.chdir(dir);
    });

    afterEach(async () => {
      const currentPwd = process.cwd();
      process.chdir(initialDir);
      if (currentPwd.includes('.jest-projects')) {
        // console.log('REMOVE SYNC');
        // await fs.remove(currentPwd);
        await fs.remove(currentPwd);
      }
    });
  },

  mockPromptAnswers(answersGenerator) {
    const inquirer = require('inquirer');

    let question = 0;
    const original = inquirer.prompt;
    inquirer.prompt = jest.fn(async (questions, data) => {
      question += 1;

      const answers = answersGenerator(data);

      return answers[question] ? answers[question]() : undefined;
    });

    return () => {
      inquirer.prompt = original;
    };
  },

  async generateProjectWithAnswers(params, answers) {
    const chisel = require('../packages/generator-chisel/bin/chisel');
    const binPath = path.resolve(
      __dirname,
      '../packages/generator-chisel/bin/chisel',
    );

    let unmockAnswers;
    if (answers) {
      unmockAnswers = global.chiselTestHelpers.mockPromptAnswers((data) =>
        answers.map((ans) => () => merge({}, data, ans)),
      );
    }

    await chisel([process.argv[0], binPath, ...params]);

    if (unmockAnswers) {
      unmockAnswers();
    }
  },

  async runChiselScript(args) {
    const generator = path.dirname(__dirname);
    const paths = Module._nodeModulePaths(process.cwd()).filter((p) =>
      p.startsWith(generator),
    );

    for (const p of paths) {
      const fibers = path.join(p, 'fibers');
      if (await fs.exists(fibers)) {
        await fs.remove(fibers);
      }
    }

    await require('chisel-scripts/bin/chisel-scripts')(args);
  },

  async expectFilesToMatchSnapshot(
    filesPaths = ['./', '!node_modules', '!yarn.lock'],
  ) {
    // bug: hash of the css is depends on path of
    const files = (await globby(filesPaths, { dot: true }))
      .sort()
      .map((val) =>
        val.replace(/(?<=styles\/main\.)[a-z0-9]+(?=\.)/, '--HASH--'),
      );

    expect(files).toMatchSnapshot();
  },

  fixHashesInConsoleMock(consoleMock) {
    if (consoleMock.mock.calls[1] && consoleMock.mock.calls[1][0]) {
      consoleMock.mock.calls[1][0] = consoleMock.mock.calls[1][0].replace(
        /(?<=styles\/main\.)[a-z0-9]+(?=\.)/g,
        '--HASH--',
      );
    }
  },
};
