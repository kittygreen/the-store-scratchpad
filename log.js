/* PREVIEW BUILD — analytics disabled.

   The real log.js POSTs every event to the Inconvenience Store's Google Apps
   Script. On a preview site that fills the live spreadsheet with demo traffic,
   so it is stubbed out here.

   To re-enable: replace this file with source/log.js from the project folder. */
function logEvent(name, payload) {
  console.log('[preview: analytics disabled]', name, payload);
}
window.logEvent = logEvent;
