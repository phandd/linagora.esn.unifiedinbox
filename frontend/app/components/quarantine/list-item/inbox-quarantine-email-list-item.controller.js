(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .controller('inboxQuarantineEmailListItemController', inboxQuarantineEmailListItemController);

  function inboxQuarantineEmailListItemController(
    _,
    $q,
    jamesWebadminClient,
    InboxQuarantineEmail,
    userAPI,
    userUtils,
    INBOX_QUARANTINE_REPOSITORY
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      jamesWebadminClient.getMailRepositoryMail(INBOX_QUARANTINE_REPOSITORY, self.emailKey)
        .then(_populateSender)
        .then(function(email) {
          self.email = new InboxQuarantineEmail(email);
          console.log(123123, self.email);
        });
    }

    function _populateSender(email) {
      if (!email.sender) {
        return $q.when(email);
      }

      return userAPI.getUsersByEmail(email.sender)
        .then(function(response) {
          email.sender = {
            email: email.sender
          };

          if (response.data && response.data[0]) {
            _.assign(email.sender, response.data[0], {
              name: userUtils.displayNameOf(response.data[0])
            });
          }

          return email;
        });
    }
  }
})(angular);
