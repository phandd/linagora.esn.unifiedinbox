(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .run(injectAdminPage);

  function injectAdminPage(dynamicDirectiveService) {
    var directive = new dynamicDirectiveService.DynamicDirective(true, 'inbox-quarantine-email-list');

    dynamicDirectiveService.addInjection('admin-quarantine-content', directive);
  }
})(angular);
