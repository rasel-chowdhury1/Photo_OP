const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const settingRoute=require('./setting.routes')
const tournamentRoute=require('./tournament.routes')
const smallTournamentRoute=require('./smallTournament.routes')
const locationRoute=require('./location.routes')
const notificationRouter=require('./notifaction.routes')
const invitationRouter=require('./invitation.routes')
const requestToPlayRouter=require('./requestToPlay.routes')
const subscriptionRouter=require('./subscription.routes')
const sponserTournamentRouter=require('./sponserTournament.routes')
const looingToplayRouter=require('./lookingToPlay.routes')
const enteredRouter=require('./entered.routes')
const teesheetRouter=require('./teeSheet.routes')
const chalangeRouter=require('./chalenge.routes')
const compliteTournamentRoute=require('./complite.routes')
const winnerRoute=require('./winner.routes')
const winnerSkinRoute=require('./winnerSkin.routes')
const winnerKpsRouter=require('./winnerKps.routes')
const winnerChalangeMatchRouter=require('./winnerChalangeMatch.routes')
const winnerplayerScore=require('./winnerPlayerScore.routes')
const topplayer=require('./topplayer.routes')
const subscribRouter=require('./subscrib.routes')
const chatRoute=require('./chat.routes')
const messageRouter=require('./message.routes')




const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/location",
    route: locationRoute,
  },
  {
    path: "/setting",
    route: settingRoute,
  },
  {
    path: "/tournament",
    route: tournamentRoute,
  },
  {
    path: "/small-tournament",
    route: smallTournamentRoute,
  },
  {
    path: "/notification",
    route: notificationRouter,
  },
  {
    path: "/invitation",
    route: invitationRouter,
  },
  {
    path: "/request-to-play",
    route: requestToPlayRouter,
  },
  {
    path: "/sponser-tournament",
    route: sponserTournamentRouter,
  },
  {
    path: "/looking-toplay",
    route: looingToplayRouter,
  },
  {
    path: "/entered",
    route: enteredRouter,
  },
  {
    path: "/teeSheet",
    route: teesheetRouter,
  },
  {
    path: "/chaleng",
    route: chalangeRouter,
  },
  {
    path: "/subscription",
    route: subscriptionRouter,
  },
  {
    path: "/winner",
    route: winnerRoute,
  },
  {
    path: "/winner-skin",
    route: winnerSkinRoute,
  },
  {
    path: "/winner-kps",
    route: winnerKpsRouter,
  },
  {
    path: "/winner-chalangeMatch",
    route: winnerChalangeMatchRouter,
  },
  {
    path: "/winner-playerScore",
    route: winnerplayerScore,
  },
  {
    path: "/top-playear",
    route: topplayer,
  },
  {
    path: "/subscrib",
    route: subscribRouter,
  },
  {
    path: "/chat-room",
    route: chatRoute,
  },
  {
    path: "/message",
    route: messageRouter,
  },
  {
    path: "/complite-tournament",
    route: compliteTournamentRoute,
  },

];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
