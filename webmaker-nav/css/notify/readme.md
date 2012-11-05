# Badge Notifications

The LESS files in here act as a library of badge notification animation options. It's not expected that 
the notification will change that often once set, but it's nice to be able to compare several 
variation side by side, and have starting points to build off of for future improvements. 

These files should define everything needed to enable the animation, such that they can be enabled
by a simple `@import` from within `badge-ui.css`. A basic template for new animations is available
below:


    @import "../mixins";

    /* Define keyframes using mixins that handle vendor-prefixing
       where required. Your keyframe definitions should work cross-browser. */

    .keyframes() {
      0%   { /* Define keyframes here */
           }
      100% { /* Define keyframes here */
           }
    }

    /* Change the animation name to something more descriptive,
       if you'd like. If you do, make sure to change it in
       your animation: rules too. */

    @-webkit-keyframes notify {.keyframes;}
    @-moz-keyframes notify {.keyframes;}
    @-o-keyframes notify {.keyframes;}
    @-ms-keyframes notify {.keyframes;}
    @keyframes notify {.keyframes;}

    /* Attach the animation to the page. */

    .has-unread .badge-ui-icon-img {
      .animation(notify 1s);

Look in `templates/badge-ui-widget.html` for the available HTML, and check
`badge-ui.js` in the `bager.on("change:unreadBadgeCount", cb)` callback to
see how the `.has-unread` class gets set. 