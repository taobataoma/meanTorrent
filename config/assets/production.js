'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/Ionicons/css/ionicons.min.css',
        //img cropper
        'public/lib/ui-cropper/compile/minified/ui-cropper.css',
        //highlight
        'public/lib/highlightjs/styles/default.css',
        //flag-icon
        'public/lib/flag-icon-css/css/flag-icon.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/bootstrap-filestyle/src/bootstrap-filestyle.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        //marked
        'public/lib/marked/marked.min.js',
        'public/lib/angular-marked/dist/angular-marked.min.js',
        //moment
        'public/lib/moment/min/moment-with-locales.min.js',
        'public/lib/angular-moment/angular-moment.min.js',
        //file saver
        'public/lib/angular-file-saver/dist/angular-file-saver.min.js',
        'public/lib/angular-file-saver/dist/angular-file-saver.bundle.min.js',
        //img cropper
        'public/lib/ui-cropper/compile/minified/ui-cropper.js',
        //highlight
        'public/lib/highlightjs/highlight.pack.min.js',
        //local-storage
        'public/lib/angular-local-storage/dist/angular-local-storage.min.js',
        //translate
        'public/lib/angular-translate/angular-translate.min.js'

        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
