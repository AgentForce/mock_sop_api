import * as Slack from 'slack-node';
const apiToken = 'xoxb-293816437472-tHbZebODcKuyPZZnvS01ProU';

const slack = new Slack(apiToken);

// slack.api("users.list", function (err, response) {
//     console.log(response);
// });
const SlackAlert = (text) => {
    slack.api('chat.postMessage', {
        as_user: 'alex',
        text: text,
        channel: '#api-notify'
    }, (err, response) => {
    });
};
export { SlackAlert };