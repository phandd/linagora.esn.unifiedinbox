(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')

    .constant('INBOX_HIDDEN_SHAREDMAILBOXES_CONFIG_KEY', 'hiddenSharedMailboxes')
    .constant('INBOX_SHAREDMAILBOXES_NAMESPACE_TYPE', 'delegated')
    .constant('INBOX_MAILBOXES_NON_SHAREABLE', ['drafts', 'outbox', 'sent', 'trash']);

})();
