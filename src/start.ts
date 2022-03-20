import Application from "app/Application";
import container from "container";

const app = new Application(container.cradle);

app.start().catch((error) => {
  console.log({ appStartError: error }, 993);
  // console.log({ appStartError: error });
  container.cradle.logger.error(error);
  // app.shutdown();
});

process.on("SIGINT", function onSigint(error) {
  console.log({ terminationSignal: error });
  // app.shutdown();
});

process.on("SIGTERM", function onSigterm(error) {
  console.log({ terminationSignal: error });
  // app.shutdown();
});

// process.on("uncaughtException", (error) => {
//   console.log({ uncaughtException: error });
//   app.shutdown();
//   // if (!error.isOperationalError) {
//   //   app.shutdown();
//   // }
// });

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on("unhandledRejection", (error) => {
  console.log(
    "\n\n--------Unhandled promise rejection error - Please handle all rejection--------\n\n"
  );
  container.cradle.logger.error(error);
  throw error;
});
