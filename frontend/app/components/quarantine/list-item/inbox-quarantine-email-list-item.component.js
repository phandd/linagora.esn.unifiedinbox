(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .component('inboxQuarantineEmailListItem', {
      templateUrl: '/unifiedinbox/app/components/quarantine/list-item/inbox-quarantine-email-list-item.html',
      controller: 'inboxQuarantineEmailListItemController',
      bindings: {
        emailKey: '<'
      }
    });
})(angular);
