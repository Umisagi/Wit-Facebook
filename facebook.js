'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const Config = require('./const.js');

const fbReq = request.defaults({
  uri: 'https://graph.facebook.com/me/messages',
  method: 'POST',
  json: true,
  qs: {
    access_token: Config.FB_PAGE_TOKEN
  },
  headers: {
    'Content-Type': 'application/json'
  },
});

const fbMessage = (recipientId, msg, cb) => {
  const opts = {
    form: {
      recipient: {
        id: recipientId,
      },
      message:{
    attachment:{
      type:"template",
      payload:{
        template_type:"generic",
        elements:[
           {
            title:"Welcome to Peter\'s Hats",
            image_url:"https://petersfancybrownhats.com/company_image.png",
            subtitle:"We\'ve got the right hat for everyone.",
            default_action: {
              type: "web_url",
              url: "https://peterssendreceiveapp.ngrok.io/view?item=103",
              messenger_extensions: true,
              webview_height_ratio: "tall",
              fallback_url: "https://peterssendreceiveapp.ngrok.io/"
            },
            buttons:[
              {
                type:"web_url",
                url:"https://petersfancybrownhats.com",
                title:"View Website"
              },{
                type:"postback",
                title:"Start Chatting",
                payload:"DEVELOPER_DEFINED_PAYLOAD"
              }              
            ]      
          }
        ]
      }
    }
  },
    },
  };

  fbReq(opts, (err, resp, data) => {
    if (cb) {
      cb(err || data.error && data.error.message, data);
    }
  });
};


// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
const getFirstMessagingEntry = (body) => {
  const val = body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];

  return val || null;
};


module.exports = {
  getFirstMessagingEntry: getFirstMessagingEntry,
  fbMessage: fbMessage,
  fbReq: fbReq
};
