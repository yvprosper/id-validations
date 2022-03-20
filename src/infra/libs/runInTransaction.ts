import mongoose from "mongoose";

/**
 * Runs the provided `mutations` callback within a transaction and commits the changes to the DB
 * only when it has run successfully.
 *
 * @param mutations A callback which does DB writes and reads using a transaction session.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (mutations: (arg0: mongoose.ClientSession) => Promise<any>) => {
  return new Promise(async (resolve, reject) => {
    const session: mongoose.ClientSession = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const result = await mutations(session);
        // Return any value returned by `mutations` to make this function as transparent as possible.
        resolve(result);
      });
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      // Rethrow the error to be caught by the caller.
      reject(error);
    } finally {
      // End the previous session.
      session.endSession();
    }
  });
};
