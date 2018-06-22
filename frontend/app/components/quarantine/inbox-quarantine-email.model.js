(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')
    .factory('InboxQuarantineEmail', InboxQuarantineEmailFactory);

  function InboxQuarantineEmailFactory(_, $q, userAPI, userUtils) {
    function InboxQuarantineEmail(props) {
      _.assign(this, _.pick(props, ['name', 'sender', 'recipients', 'state', 'error', 'lastUpdated', 'htmlBody', 'textBody']));

      var bodyContent = [
        'A voter leaps below the nice shell. The visitor scores outside a retirement conjecture. Our planet dines with a hypocrite. Will the beaten fighter flower the dictionary? An upward firework joins the composer.',
        'Why won\'t a digest experiment? Outside the goodbye coughs our edge. The rattling onion wets a student. A spoiled verse prosecutes around a revolutionary. A pace balances the likelihood. Behind the estate suffers a stopped research.',
        'The newcomer soaps the circuitry. The wallet counts past the torture. The boiled analogue overlaps on top of a daft pace. Past the exam plays the spiral lifetime. The unfortunate industry bays behind an ideology. When will the delighted clash appall the sector?',
        'Above a protocol overflows our tool. When will the anthology clog a trailing project? How can the amateur cap recover from a reform? In the resigned newcomer indulges the shifting trigger. The crush compresses the reject. How does a legend reset a household?',
        'Why won\'t the dream overflow? The lonely damned fudges against an electronic campus. The employee strays within a realizing turntable. The freak spikes the isolating sister under each combat. The rabid pupil smells under a heel. Every pressed downhill smells throughout the completed doe.',
        '<html><body>\n' +
        '\n' +
        '<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; line-height: 1.7; color: #555;">\n' +
        '    <tr>\n' +
        '        <td>\n' +
        '            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 660px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; background: #FFF;">\n' +
        '                <tr>\n' +
        '                    <td style="border: 1px solid #ddd;">\n' +
        '                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">\n' +
        '                            <tr>\n' +
        '                                <td style="padding: 20px 20px 10px; text-align:left;">\n' +
        '                                    <img src="https://chat.linagora.com/static/images/logo-email.png" width="130px" style="opacity: 0.5" alt="">\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>\n' +
        '                                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 20px 50px 0; text-align: center; margin: 0 auto">\n' +
        '                                        <tr>\n' +
        '                                            <td style="border-bottom: 1px solid #ddd; padding: 0 0 20px;">\n' +
        '                                                <h2 style="font-weight: normal; margin-top: 10px;">You have one new message.</h2>\n' +
        '                                                <p>CHANNEL: <br>gtranxuan - 04:55 CEST, June 21<br><pre style="text-align:left;font-family: \'Lato\', sans-serif; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;">Haahahahahahahahaaaac </pre></p>\n' +
        '                                                <p style="margin: 20px 0 15px">\n' +
        '                                                    <a href="https://chat.linagora.com/linagora/pl/yfann9micfdkfcobywqb9wt6xh" style="background: #2389D7; display: inline-block; border-radius: 3px; color: #fff; border: none; outline: none; min-width: 170px; padding: 15px 25px; font-size: 14px; font-family: inherit; cursor: pointer; -webkit-appearance: none;text-decoration: none;">Go To Post</a>\n' +
        '                                                </p>\n' +
        '                                            </td>\n' +
        '                                        </tr>\n' +
        '                                        <tr>\n' +
        '                                            \n' +
        '\n' +
        '<td style="color: #999; padding-top: 20px; line-height: 25px; font-size: 13px;">\n' +
        '    Any questions at all, mail us any time: <a href=\'mailto:feedback@mattermost.com\' style=\'text-decoration: none; color:#2389D7;\'>feedback@mattermost.com</a>.<br>Best wishes,<br>The Mattermost Team<br>\n' +
        '</td>\n' +
        '\n' +
        '\n' +
        '                                        </tr>\n' +
        '                                    </table>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                \n' +
        '\n' +
        '<td style="text-align: center;color: #AAA; font-size: 11px; padding-bottom: 10px;">\n' +
        '    <p style="padding: 0 50px;">\n' +
        '        Sent by Linagora, Tour Franklin, 100 Terrasse Boieldieu, 92800 Puteaux<br>\n' +
        '        To change your notification preferences, log in to your team site and go to Account Settings &gt; Notifications.\n' +
        '    </p>\n' +
        '</td>\n' +
        '\n' +
        '\n' +
        '                            </tr>\n' +
        '                        </table>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '            </table>\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '\n' +
        '</body></html>\n'
      ];
      var subject = [
        'I need help',
        'We want this to be fixed',
        'Next meeting briefing',
        'Sam did nothing wrong',
        'Sam did it all wrong'
      ];

      this.htmlBody = bodyContent[5];
      this.subject = subject[Math.floor(Math.random() * Math.floor(5))];

      // For reuse inbox component purpose
      this.to = this.recipients.map(function(recipient) {
        return {
          email: recipient,
          name: recipient
        };
      });
      this.date = this.lastUpdated;
      this.from = this.sender;
    }

    return InboxQuarantineEmail;
  }
})(angular);
