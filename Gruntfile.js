'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc'
      },
      all: {
        src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/**/*.js', 'backend/**/*.js', 'frontend/app/**/*.js']
      }
    },
    lint_pattern: {
      options: {
        rules: [
          { pattern: /(describe|it)\.only/, message: 'Must not use .only in tests' }
        ]
      },
      all: {
        src: ['<%= eslint.all.src %>']
      },
      css: {
        options: {
          rules: [
            { pattern: /important;(\s*$|(?=\s+[^\/]))/, message: 'CSS important rules only allowed with explanatory comment' }
          ]
        },
        src: [
          'frontend/css/**/*.less'
        ]
      }
    },
    splitfiles: {
      options: {
        chunk: 1
      },
      midway: {
        options: {
          common: ['test/midway-backend/all.js'],
          target: 'mochacli:midway'
        },
        files: {
          src: ['test/midway-backend/**/*.js']
        }
      }
    },
    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 5000
      },
      backend: {
        options: {
          files: ['test/unit-backend/all.js', grunt.option('test') || 'test/unit-backend/**/*.js']
        }
      }
    },
    karma: {
      unit: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS']
      }
    },

    i18n_checker: {
      all: {
        options: {
          baseDir: __dirname,
          dirs: [{
            localeDir: 'backend/lib/i18n/locales',
            templateSrc: [
              'frontend/app/**/*.pug',
              'frontend/views/**/*.pug'
            ],
            core: true
          }],
          verifyOptions: {
            defaultLocale: 'en',
            locales: ['en', 'fr', 'vi']
          }
        }
      }
    },

    puglint: {
      all: {
        options: {
          config: {
            disallowAttributeInterpolation: true,
            disallowLegacyMixinCall: true,
            validateExtensions: true,
            validateIndentation: 2
          }
        },
        src: [
          'frontend/**/*.pug'
        ]
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('@linagora/grunt-lint-pattern');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('@linagora/grunt-i18n-checker');
  grunt.loadNpmTasks('grunt-puglint');

  grunt.loadTasks('tasks');

  grunt.registerTask('i18n', 'Check the translation files', ['i18n_checker']);
  grunt.registerTask('pug-linter', 'Check the pug/jade files', ['puglint:all']);
  grunt.registerTask('linters', 'Check code for lint', ['eslint:all', 'lint_pattern:all', 'pug-linter'/* Too complicated for now :( , 'i18n' */]);
  grunt.registerTask('linters-dev', 'Check changed files for lint', ['prepare-quick-lint', 'jshint:quick', 'jscs:quick', 'lint_pattern:quick']);
  grunt.registerTask('test-midway-backend', ['splitfiles:midway']);
  grunt.registerTask('test-unit-backend', 'Test backend code', ['mochacli:backend']);
  grunt.registerTask('test-unit-frontend', 'Unit test frontend code', ['karma:unit']);
  grunt.registerTask('test-frontend', 'Test frontend code', ['test-unit-frontend']);
  grunt.registerTask('test', ['linters', 'test-frontend', 'test-unit-backend', 'test-midway-backend']);
  grunt.registerTask('default', ['test']);
};
