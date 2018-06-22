'use strict';

/* global chai: false, sinon: false */

var expect = chai.expect;

describe('The inboxFilteredList factory', function() {

  var $rootScope, jmapClient, jmap, inboxFilteringService, inboxFilters, _, inboxFilteredList, esnSearchProvider, inboxHostedMailMessagesProvider, INBOX_EVENTS, PROVIDER_TYPES, counter, inboxConfigMock;

  beforeEach(module('linagora.esn.unifiedinbox', function($provide) {
    jmapClient = {
      getMailboxes: function() {
        return $q.when([
          new jmap.Mailbox(jmapClient, 'id_inbox', 'inbox', { role: 'inbox' })
        ]);
      }
    };

    $provide.value('withJmapClient', function(callback) { return callback(jmapClient); });

    inboxConfigMock = {};
    $provide.value('inboxConfig', function(key, defaultValue) {
      return $q.when(angular.isDefined(inboxConfigMock[key]) ? inboxConfigMock[key] : defaultValue);
    });
  }));

  beforeEach(inject(function(_$rootScope_, _jmap_, _inboxFilteringService_, _inboxFilters_, ___, _inboxFilteredList_,
                             _esnSearchProvider_,
                             _inboxHostedMailMessagesProvider_, _INBOX_EVENTS_, _PROVIDER_TYPES_) {
    $rootScope = _$rootScope_;
    jmap = _jmap_;
    inboxFilteringService = _inboxFilteringService_;
    inboxFilters = _inboxFilters_;
    _ = ___;
    inboxFilteredList = _inboxFilteredList_;
    inboxHostedMailMessagesProvider = _inboxHostedMailMessagesProvider_;
    esnSearchProvider = _esnSearchProvider_;
    INBOX_EVENTS = _INBOX_EVENTS_;
    PROVIDER_TYPES = _PROVIDER_TYPES_;
  }));

  function newMessage(options) {
    var message = new jmap.Message(jmapClient, 'id' + ++counter, 'blobId', 'threadId', ['id_inbox'], options);

    message.provider = inboxHostedMailMessagesProvider;

    return message;
  }

  beforeEach(function() {
    inboxFilteringService.setProviderFilters({ types: ['jmap'] });
    _.find(inboxFilters, { id: 'isUnread' }).checked = true;

    counter = 0;
  });

  it('should render the list when filters change', function() {
    var unreadMessage = newMessage({ isFlagged: true, isUnread: true, date: 1 }),
        readMessage = newMessage({ isFlagged: true, date: 0 });

    inboxFilteredList.addAll([
      readMessage,
      unreadMessage
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessage]);

    _.find(inboxFilters, { id: 'isUnread' }).checked = false;
    _.find(inboxFilters, { id: 'isFlagged' }).checked = true;
    $rootScope.$broadcast(INBOX_EVENTS.FILTER_CHANGED);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessage, readMessage]); // both messages are flagged
  });

  it('should render the list when filters are cleared, removing items fetched when filtering was active', function() {
    var unreadMessage = newMessage({ isUnread: true, date: 1 }),
        readMessage = newMessage({ date: 0 });

    inboxFilteredList.addAll([
      readMessage,
      unreadMessage
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessage]);
    expect(inboxFilteredList.getById(unreadMessage.id)).to.equal(unreadMessage);

    inboxFilteringService.clearFilters();
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([]);
    expect(inboxFilteredList.getById(unreadMessage.id)).to.equal(undefined);
  });

  it('should render the list when item flags change', function() {
    var unreadMessage = newMessage({ isUnread: true, date: 1 }),
        readMessage = newMessage({ date: 0 });

    inboxFilteredList.addAll([
      readMessage,
      unreadMessage
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessage]);

    unreadMessage.isUnread = false;
    $rootScope.$broadcast(INBOX_EVENTS.ITEM_FLAG_CHANGED);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([]);
  });

  it('should render the list when item mailbox ids change', function() {
    var unreadMessage = newMessage({ isUnread: true, date: 1 }),
        readMessage = newMessage({ date: 0 });

    inboxFilteredList.addAll([
      readMessage,
      unreadMessage
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessage]);

    unreadMessage.mailboxIds = ['another_mailbox'];
    $rootScope.$broadcast(INBOX_EVENTS.ITEM_MAILBOX_IDS_CHANGED);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([]);
  });

  it('should filter items by quickFilter when defined', function() {
    var unreadMessageMatchingFilter = newMessage({ isUnread: true, date: 1, subject: 'I am matching the xxx quick filter' });

    inboxFilteringService.setQuickFilter('xxx');
    inboxFilteredList.addAll([
      newMessage({ date: 0 }),
      newMessage({ isUnread: true, date: 1 }),
      unreadMessageMatchingFilter,
      newMessage({ isUnread: true, date: 2 }),
      newMessage({ date: 3 })
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadMessageMatchingFilter]);
  });

  it('should remove item from the list when draft message destroyed', function() {
    var unreadDraft = newMessage({ isUnread: true, date: 1 });

    inboxFilteredList.addAll([
      unreadDraft
    ]);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([unreadDraft]);

    $rootScope.$broadcast(INBOX_EVENTS.DRAFT_DESTROYED, unreadDraft);
    $rootScope.$digest();

    expect(inboxFilteredList.list()).to.deep.equal([]);
  });

  it('should not throw when message\'s provider has missing itemMatches function', function() {
    var message = new jmap.Message(jmapClient, 'id', 'blobId', 'threadId', ['id_inbox'], {}),
      fakeProvider = function() {
        return new esnSearchProvider({
          types: [PROVIDER_TYPES.JMAP, PROVIDER_TYPES.SOCIAL],
          name: 'Quacks',
          fetch: function() { },
          buildFetchContext: function() { },
          templateUrl: 'tada'
        });
    };

    message.provider = fakeProvider();
    inboxFilteredList.addAll([message]);
    $rootScope.$digest();
  });

  describe('The addAll function', function() {

    it('should render the list', function() {
      var messages = [
        newMessage({ isUnread: true, date: 1 }),
        newMessage({ isUnread: true, date: 0 }),
        newMessage({ isUnread: true, date: -1 })
      ];

      inboxFilteredList.addAll([
        messages[1],
        newMessage({ isUnread: false, date: 0 }),
        messages[2],
        newMessage({ isUnread: false, date: 0 }),
        messages[0]
      ]);
      $rootScope.$digest();

      expect(inboxFilteredList.list()).to.deep.equal(messages);
    });

    it('should link items, considering edges correctly', function() {
      var messages = [
        newMessage({ isUnread: true, date: 1 }),
        newMessage({ isUnread: true, date: -1 })
      ];

      inboxFilteredList.addAll([
        messages[1],
        newMessage({ isUnread: false, date: 0 }),
        messages[0]
      ]);
      $rootScope.$digest();

      expect(messages[0].previous).to.equal(null);
      expect(messages[0].next()).to.deep.equal(messages[1]);
      expect(messages[1].previous()).to.deep.equal(messages[0]);
      expect(messages[1].next).to.equal(null);
    });

  });

  describe('The asMdVirtualRepeatModel function', function() {

    it('should return the model', function() {
      var message = newMessage({ isUnread: true, date: 0 });

      inboxFilteredList.addAll([message]);
      $rootScope.$digest();

      var load = sinon.spy(),
          model = inboxFilteredList.asMdVirtualRepeatModel(load);

      expect(model.getLength()).to.equal(1);
      expect(model.getItemAtIndex(0)).to.equal(message);

      model.getItemAtIndex(1);

      expect(load).to.have.been.calledWith();
    });

  });

  describe('The getById function', function() {

    it('should return undefined if the element does not exist', function() {
      expect(inboxFilteredList.getById('nonExistentId')).to.equal(undefined);
    });

    it('should return the element if the it exists', function() {
      var message = newMessage();

      inboxFilteredList.addAll([message]);

      expect(inboxFilteredList.getById(message.id)).to.equal(message);
    });

  });

  describe('The removeFromList function', function() {

    it('should remove one element from the rendered list', function() {
      var messages = [
        newMessage({ isUnread: true, date: 1 }),
        newMessage({ isUnread: true, date: 0 }),
        newMessage({ isUnread: true, date: -1 }),
        newMessage({ isUnread: true, date: -2 })
      ];

      inboxFilteredList.addAll(messages);
      $rootScope.$digest();

      inboxFilteredList.removeFromList([messages[2].id]);
      $rootScope.$digest();

      expect(inboxFilteredList.list()).to.deep.equal([messages[0], messages[1], messages[3]]);
    });

    it('should remove all elements from the rendered list', function() {
      var messages = [
        newMessage({ isUnread: true, date: 1 }),
        newMessage({ isUnread: true, date: 0 })
      ];

      inboxFilteredList.addAll(messages);
      $rootScope.$digest();

      inboxFilteredList.removeFromList([messages[0].id, messages[1].id]);
      $rootScope.$digest();

      expect(inboxFilteredList.list()).to.deep.equal([]);
    });

    it('should return the list of emails that have been removed', function() {
      var messages = [
        newMessage({ isUnread: true, date: 1 }),
        newMessage({ isUnread: true, date: 0 }),
        newMessage({ isUnread: true, date: -1 }),
        newMessage({ isUnread: true, date: -2 })
      ];

      inboxFilteredList.addAll(messages);
      $rootScope.$digest();

      var removedItems = inboxFilteredList.removeFromList([messages[1].id, messages[3].id]);

      expect(removedItems).to.deep.equal([messages[1], messages[3]]);
    });

  });

});
