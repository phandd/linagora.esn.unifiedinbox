(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .factory('InboxQuarantineEmail', InboxQuarantineEmailFactory);

  function InboxQuarantineEmailFactory(_) {
    function InboxQuarantineEmail(props) {
      _.assign(this, _.pick(props, ['name', 'sender', 'recipients', 'state', 'error', 'lastUpdated', 'htmlBody', 'textBody']));

      var bodyContent = [
        'A voter leaps below the nice shell. The visitor scores outside a retirement conjecture. Our planet dines with a hypocrite. Will the beaten fighter flower the dictionary? An upward firework joins the composer.',
        'Why won\'t a digest experiment? Outside the goodbye coughs our edge. The rattling onion wets a student. A spoiled verse prosecutes around a revolutionary. A pace balances the likelihood. Behind the estate suffers a stopped research.',
        'The newcomer soaps the circuitry. The wallet counts past the torture. The boiled analogue overlaps on top of a daft pace. Past the exam plays the spiral lifetime. The unfortunate industry bays behind an ideology. When will the delighted clash appall the sector?',
        'Above a protocol overflows our tool. When will the anthology clog a trailing project? How can the amateur cap recover from a reform? In the resigned newcomer indulges the shifting trigger. The crush compresses the reject. How does a legend reset a household?',
        'Why won\'t the dream overflow? The lonely damned fudges against an electronic campus. The employee strays within a realizing turntable. The freak spikes the isolating sister under each combat. The rabid pupil smells under a heel. Every pressed downhill smells throughout the completed doe.'
      ];
      var subject = [
        'I need help',
        'We want this to be fixed',
        'Next meeting briefing',
        'Sam did nothing wrong',
        'Sam did it all wrong'
      ];

      this.textBody = bodyContent[Math.floor(Math.random() * Math.floor(5))];
      this.subject = subject[Math.floor(Math.random() * Math.floor(5))];
    }

    return InboxQuarantineEmail;
  }
})(angular);
