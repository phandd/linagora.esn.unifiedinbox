(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .service('inboxQuarantineEmailService', inboxQuarantineEmailService);

  function inboxQuarantineEmailService(
    $q,
    InboxQuarantineEmail,
    jamesWebadminClient,
    INBOX_QUARANTINE_REPOSITORY
  ) {
    return {
      list: list
    };

    function list(options) {
      return jamesWebadminClient.listMailRepositoryMails(INBOX_QUARANTINE_REPOSITORY, options);
    }
  }
})(angular);
