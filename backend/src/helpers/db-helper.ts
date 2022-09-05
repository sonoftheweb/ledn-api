import mongoose, { ClientSession } from "mongoose";

type TransactionCallback = (session: ClientSession) => Promise<void>;

export const transactionWrapper = async (callback: TransactionCallback) => {
  const session: ClientSession = await mongoose.startSession();

  session.startTransaction();

  try {
    await callback(session);
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};
