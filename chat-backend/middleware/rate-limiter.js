// rate-limiter.js
const rateLimiter = require("express-rate-limit");


/*
General limiter to reduce load on all endpoints
responds with statuscode 429 ( Too many)
1 minute cooldown
*/
const limiter = rateLimiter({
max: 100,
windowMS: 60000, // 10 seconds
message: "You can't make any more requests at the moment. Try again later",
});

/*
Specific limiter to limit login attempts
responds with statuscode 429 ( Too many)
1 minute cooldown
*/
const signInLimiter = rateLimiter({
max: 2,
windowMS: 60000, //10 seconds
message: "Too many sign-in attempts. Try again later."
})
module.exports = {
  limiter,
  signInLimiter
}