'use strict';

/* global chai: false, sinon: false */

var expect = chai.expect;

describe('The EMailer run block', function() {

  var $rootScope, jmap, searchService;

  beforeEach(function() {
    module('linagora.esn.unifiedinbox');
  });

  beforeEach(inject(function(_$rootScope_, _jmap_, _searchService_) {
    $rootScope = _$rootScope_;
    jmap = _jmap_;
    searchService = sinon.mock(_searchService_);
  }));

  afterEach(function() {
    searchService.verify();
  });

  it('should add a "resolve" method to jmap.EMailer instances', function() {
    expect(new jmap.EMailer().resolve).to.be.a('function');
  });

  it('should query the search service and use displayName and photo if available', function() {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.when({
        displayName: 'displayName',
        photo: '/photo'
      }));

    emailer.resolve();
    $rootScope.$digest();

    expect(emailer.avatarUrl).to.equal('/photo');
    expect(emailer.name).to.equal('displayName');
  });

  it('should query the search service and use existing name and generated avatar if not info is not available', function() {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.when({}));

    emailer.resolve();
    $rootScope.$digest();

    expect(emailer.avatarUrl).to.equal('/api/avatars?email=a@a.com&objectType=email&displayName=a');
    expect(emailer.name).to.equal('a');
  });

  it('should query the search service and use existing name and generated avatar if search fails', function() {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.reject(new Error()));

    emailer.resolve();
    $rootScope.$digest();

    expect(emailer.avatarUrl).to.equal('/api/avatars?email=a@a.com&objectType=email&displayName=a');
    expect(emailer.name).to.equal('a');
  });

  it('should define objectType and id from the found match', function() {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.when({
        objectType: 'user',
        id: 'myId',
        displayName: 'displayName',
        photo: '/photo'
      }));

    emailer.resolve();
    $rootScope.$digest();

    expect(emailer.objectType).to.equal('user');
    expect(emailer.id).to.equal('myId');
  });

  it('should resolve with an object suitable for esnAvatar', function(done) {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.when({
        objectType: 'user',
        id: 'myId',
        displayName: 'displayName',
        photo: '/photo'
      }));

    emailer.resolve().then(function(avatar) {
      expect(avatar).to.deep.equal({
        id: 'myId',
        url: '/photo',
        email: 'a@a.com'
      });

      done();
    });
    $rootScope.$digest();
  });

  it('should set avatar.id only if the match is a user', function(done) {
    var emailer = new jmap.EMailer({ email: 'a@a.com', name: 'a' });

    searchService
      .expects('searchByEmail')
      .once()
      .withExactArgs('a@a.com')
      .returns($q.when({
        objectType: 'contact',
        id: 'myId',
        displayName: 'displayName',
        photo: '/photo'
      }));

    emailer.resolve().then(function(avatar) {
      expect(avatar).to.deep.equal({
        id: false,
        url: '/photo',
        email: 'a@a.com'
      });

      done();
    });
    $rootScope.$digest();
  });

});
