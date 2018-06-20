(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .controller('inboxQuarantineEmailListItemController', inboxQuarantineEmailListItemController);

  function inboxQuarantineEmailListItemController(
    jamesWebadminClient,
    InboxQuarantineEmail,
    INBOX_QUARANTINE_REPOSITORY
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      jamesWebadminClient.getMailRepositoryMail(INBOX_QUARANTINE_REPOSITORY, self.emailKey)
        .then(function(email) {
          self.email = new InboxQuarantineEmail(email);
          self.numberOfRecipients = email.recipients && email.recipients.length;
        });
    }
  }
})(angular);
