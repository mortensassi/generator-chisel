/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs-extra');
const path = require('path');
const { merge } = require('lodash');

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
};
