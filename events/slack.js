const Bot = require('slackbots');

let started;
const settings = {
  token: process.env.SLACK_API_TOKEN,
  name: 'robot'
};
const bot = new Bot(settings);
bot.on('start', () => {
  started = true;
});

/** Trigger Every Comment Or Post From Busy */
const trigger = (op) => {
  if (op[0] === 'comment') {
    let jsonMetadata;
    try {
      jsonMetadata = JSON.parse(op[1].json_metadata);
    } catch (err) { }

    if (started && jsonMetadata && jsonMetadata.app && typeof jsonMetadata.app === 'string') {

      if (jsonMetadata.app.includes('busy/1')) {
        postMessage('activity-1', op);
      }

      if (jsonMetadata.app.includes('busy/2')) {
        postMessage('activity-2', op);
      }
    }
  }
};

const postMessage = (channel, op) => {
  let jsonMetadata;
  try {
    jsonMetadata = JSON.parse(op[1].json_metadata);
  } catch (err) { }

  let message = `*<https://nd.busy.org/${op[1].parent_permlink}/@${op[1].author}/${op[1].permlink}|@${op[1].author}>* ${jsonMetadata.app} `;
  message += op[1].body.includes('@@') ? 'edit ' : 'new ';
  message += op[1].parent_author ? 'comment' : 'post';
  bot.postMessageToChannel(
    channel,
    message,
    { mrkdwn_in: ["text"] }
  );

  let log = op[1].body.includes('@@') ? 'Edit ' : 'New ';
  log += op[1].parent_author ? 'comment ' : 'post ';
  log += `@${op[1].author}/${op[1].permlink} with ${jsonMetadata.app}: `;
  if (jsonMetadata && jsonMetadata.app && typeof jsonMetadata.app === 'string' && jsonMetadata.app.includes('busy/')) {
    console.log(log);
  }
};

module.exports = trigger;
