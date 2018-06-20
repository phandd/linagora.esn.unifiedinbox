(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .controller('inboxQuarantineEmailListController', inboxQuarantineEmailListController);

  function inboxQuarantineEmailListController(infiniteScrollHelper, inboxQuarantineEmailService, jamesWebadminClient) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      if (self.type) {
        options.type = self.type;
      }

      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);

      _loadNextItems();
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return inboxQuarantineEmailService.list(options);
    }

    var repo = 'file://var/mail/sample/';

    jamesWebadminClient.listMailRepositoryMails(repo).then(function(mails) {
      // console.log(111, mails);

      mails.forEach(function(mailKey) {
        jamesWebadminClient.getMailRepositoryMail(repo, mailKey, {
          additionalFields: ['attributes', 'headers', 'textBody', 'htmlBody', 'messageSize']
        }).then(function(detail) {
          console.log(222, mailKey, detail);
        });
      });
    });
  }
})(angular);
