/*
 #  Copyright © Michael O'ROurke
 #
 #  gruntfile.js
 #  Gruntfile provides configuration for tasks and Grunt extensions. It reads data from package.json
 #  and _config.yml. Use caution when making changes here or within either of those files.
 #
 */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),
    banner: '/* \n' +
            ' * <%= pkg.name %>, Built on <%= grunt.template.today(\'mm-dd-yyyy\') %>\n' +
            ' * Copyright © <%= grunt.template.today(\'yyyy\') %> <%= site.github.owner %>. All rights reserved.\n' +
            ' * Code and documentation licensed under the <%= site.github.license %> license.\n' +
            ' */\n\n',

    shell: {
      gems: {
        command: ['gem update --system --no-document',
                  'gem install github-pages'].join('&&'),
        options: {
          stdout: true
        }
      }
    },

    clean: {
      assets: ['assets/css/main.min.css',
               'assets/js/main.min.js']
    },

    concat: {
      main: {
        options: {
          banner: '<%= banner %>'
        },
        src: ['vendors/transition.js',
              'vendors/collapse.js',
              'less/helpers/contents.js',
              'less/helpers/metabar.js',
              'less/helpers/scrolltop.js',
              'less/helpers/easing.js'],
        dest: 'assets/js/main.min.js'
      }
    },

    uglify: {
      main: {
        options: {
          banner: '<%= banner %>',
          report: 'min'
        },
        src: '<%= concat.main.dest %>',
        dest: 'assets/js/main.min.js'
      }
    },

    recess: {
      unminify: {
        options: {
          compile: true,
          compress: false,
          banner: '<%= banner %>'
        },
        src: ['less/hatch.less'],
        dest: 'assets/css/main.min.css'
      },
      minify: {
        options: {
          compile: true,
          compress: true,
          banner: '<%= banner %>'
        },
        src: ['<%= recess.unminify.src %>'],
        dest: '<%= recess.unminify.dest %>'
      }
    },

    pages: {
      start: {
        options: {
          watch: true,
          serve: true,
          baseurl: ['\'\'']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-jekyll-pages');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build',         ['clean', 'concat', 'uglify', 'recess:minify']);
  grunt.registerTask('build:pretty',  ['clean', 'concat', 'recess:unminify']);
  grunt.registerTask('install',       ['shell:gems']);
  grunt.registerTask('preview',       ['pages:start']);
  grunt.registerTask('serve',         ['build', 'pages:start']);
  grunt.registerTask('serve:pretty',  ['build:pretty', 'pages:start']);
};
