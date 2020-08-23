
const config = require('./config');
const twit = require('twit');
const T = new twit(config);
const inspoQuotes = [
  'Everyone has inside them a piece of good news. The good news is you don’t know how great you can be! How much you can love! What you can accomplish! And what your potential is.',
  'Everything you need to accomplish your goals is already in you.',
  'I’m so proud of you.',
  'You’re not going to master the rest of your life in one day. Just relax. Master the day. Then just keep doing that every day.',
  'Sometimes when you are in a dark place you think you have been buried, but actually you have been planted.',
  'It doesn’t matter how slowly you go as long as you do not stop.',
  'Whenever you find yourself doubting how far you can go, just remember how far you have come. Remember everything you have faced, all the battles you have won, and all the fears you have overcome.',
  'There’s something in you that the world needs.',
  'A little progress everyday adds up to big results.',
  'Beautiful girl you were made to do hard things. So believe in yourself.',
  'You’re allowed to scream, you’re allowed to cry but do not give up.',
  'You are gold, baby. Solid gold.',
  'It always seems impossible until it is done.',
  'Soon, when all is well, you’re going to look back on this period of your life and be so glad that you never gave up.',
  'You have been assigned this mountain to show others it can be moved.',
  'Believe in yourself and you’ll be unstoppable.',
  'Be a pineapple stand tall wear a crown and be sweet on the inside.',
  'Strive not to be a success but rather to be of value.',
  'You only fail when you stop trying.',
  'I am not afraid of storms, for I am learning how to sail my ship',
  'Don’t think, just do.',
  'Expect problems and eat them for breakfast',
  'You just can’t beat the person who never gives up.',
  'The harder the conflict, the more glorious the triumph.',
  'Start where you are. Use what you have. Do what you can.',
  'The first step toward success is taken when you refuse to be a captive of the environment in which you first find yourself.',
  'Set your goals high, and don’t stop till you get there.',
  'A man can be as great as he wants to be. If you believe in yourself and have the courage, the determination, the dedication, the competitive drive and if you are willing to sacrifice the little things in life and pay the price for the things that are worthwhile, it can be done.',
  'Nobody can go back and start a new beginning, but anyone can start today and make a new ending.',
  'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.',
  'You will never do anything in this world without courage. It is the greatest quality in the mind next to honor.',
  'True happiness involves the full use of one’s power and talents.',
  'Even if you fall on your face, you’re still moving forward.',
  'Press on – nothing can take the place of persistence. Talent will not; nothing is more common than unsuccessful men with talent. Genius will not; unrewarded genius is almost a proverb. Education will not; the world is full of educated derelicts. Perseverance and determination alone are omnipotent.',
  'Be miserable. Or motivate yourself. Whatever has to be done, it’s always your choice.',
];

const rando = arr => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

const postTweet = () => {
  let randomPost = rando(inspoQuotes);
  if (typeof randomPost !== 'string') {
    console.log('tweet must be of type String');
  } else if (randomPost.length > 280) {
    console.log('tweet is too long: ' + randomPost.length);
  }
  T.post('statuses/update', { status: randomPost }, (err, response) => {
    if (response) console.log('Successfully posted: ' + randomPost);
    if (err)
      console.log('Something went wrong while posting a canned response...');
  });
};

const retweet = ()  => {
  let params = {
    q:
      "I'm publicly committing to the 100DaysOfCode Challenge starting today! Learn More and Join me! https://100DaysOfCode.com #100DaysOfCode",
    count: 100,
  };
  T.get('search/tweets', params, (err, data, response) => {
    let tweets = data.statuses;
    console.log(tweets)
  //   if (!err) {
  //     for (let dat of tweets) {
  //       let retweetId = dat.id_str;
  //       T.post('statuses/retweet/:id', { id: retweetId }, (err, response) => {
  //         if (response) console.log('Retweeted!!! ' + retweetId);
  //         if (err)
  //           console.log(
  //             'Something went wrong while RETWEETING... Duplication maybe...'
  //           );
  //       });
  //     }
  //   }
  });
}

function replyMentions() {
  // check for mentions
  // you can add parameter 'since_id' to limit returns
  T.get('statuses/mentions_timeline', { count: 100 }, function(
    err,
    data,
    response
  ) {
    if (data) {
      data.forEach(function(mention) {
        // reply if mention.id_str is not yet replied
        reply =
          '@' +
          mention.user.screen_name +
          ' thanks for the mention @' +
          mention.user.screen_name +
          ' keep up the hard work!';
        T.post(
          'statuses/update',
          { status: reply, in_reply_to_status_id: mention.id_str },
          function(err, data, response) {
            console.log(data);
            // mark data.id_str as replied
          }
        );
      });
    }
  });
}

function favoriteTweet() {
  let params = {
    q: `I'm publicly committing to the 100DaysOfCode Challenge starting today! Learn More and Join me! https://100DaysOfCode.com #100DaysOfCode`,
    count: 100,
  };
  T.get('search/tweets', params, (err, data, response) => {
    let tweets = data.statuses;
    if (!err) {
      for (let dat of tweets) {
        let retweetId = dat.id_str;
        T.post('favorites/create', { id: retweetId }, (err, response) => {
          if (response) console.log('Liked!!! ' + retweetId);
          if (err)
            console.log(
              'Something went wrong while LIKING... Duplication maybe...'
            );
        });
      }
    }
  });
}

// Post an inspirational quote once a day.


function replyTweet() {
  let params = {
    q: `I'm publicly committing to the 100DaysOfCode Challenge starting today! Learn More and Join me! https://100DaysOfCode.com #100DaysOfCode`,
    count: 100,
  };
  T.get('search/tweets', params, (err, data, response) => {


    let tweets = data.statuses;
    if (!err) {
      for (let dat of tweets) {
        let retweetId = dat.id_str;
        var res = {
          status: rando(inspoQuotes),
          in_reply_to_status_id: '' + retweetId
        };

        T.post('statuses/update', res,
          function(err, data, response) {
            console.log(data);
          }
            );
      }
    }
  });
}

function deleteTweets() {
  T.get('statuses/user_timeline', {
    count: 100
  }, (err, data, response) => {
if(!err) {
  for(let dat of data) {
    T.post(`statuses/destroy/:id`, {id: dat.id_str},  (err, response) => {
      if (response) console.log('Tweet deleted' + dat.text);
      if (err)
        console.log(
          'Something went wrong while deleting the tweet...'
        );
    });
  }
}
});
}

postTweet();

function callFunctionWithDelay(fn, ms) {
  setInterval(fn, ms);
}

callFunctionWithDelay(postTweet, 10800000)