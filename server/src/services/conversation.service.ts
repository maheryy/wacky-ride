import { Op } from "sequelize";
import sequelize, { db } from "../database/sequelize";
import {
  TConversationCreateAttributes,
  TConversationWithUsers,
  TConversationWithUsersAndMessages,
} from "../types/conversation";
import { IUser } from "../types/user";

const { Conversation } = db;

export async function createConversation(
  fields: TConversationCreateAttributes
) {
  const transaction = await sequelize.transaction();

  try {
    const { id } = await Conversation.create(fields, { transaction });

    const conversation = (await Conversation.scope("withMessages").findByPk(
      id,
      { transaction }
    )) as TConversationWithUsersAndMessages;

    await transaction.commit();

    return conversation;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export async function getConversation(user1: IUser["id"], user2: IUser["id"]) {
  const conversation = (await Conversation.scope("withMessages").findOne({
    where: {
      [Op.or]: [
        {
          senderId: user1,
          receiverId: user2,
        },
        {
          senderId: user2,
          receiverId: user1,
        },
      ],
    },
  })) as TConversationWithUsersAndMessages | null;

  const isReceiver = conversation?.receiver.id === user1;

  if (isReceiver) {
    return swapSenderAndReceiver(conversation);
  }

  return conversation;
}

export async function getConversationByUsers(
  user1: IUser["id"],
  user2: IUser["id"]
) {
  const conversation = (await Conversation.scope("withMessages").findOne({
    where: {
      [Op.or]: [
        {
          senderId: user1,
          receiverId: user2,
        },
        {
          senderId: user2,
          receiverId: user1,
        },
      ],
    },
  })) as TConversationWithUsersAndMessages | null;

  const isReceiver = conversation?.receiver.id === user1;

  if (isReceiver) {
    return swapSenderAndReceiver(conversation);
  }

  return conversation;
}

export async function getConversations(userId: IUser["id"]) {
  const conversations = (await Conversation.findAll({
    where: {
      [Op.or]: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
  })) as TConversationWithUsers[];

  return conversations.map((conversation) => {
    const isReceiver = conversation.receiver.id === userId;

    if (isReceiver) {
      return swapSenderAndReceiver(conversation);
    }

    return conversation;
  });
}

export async function endConversation(user1: IUser["id"], user2: IUser["id"]) {
  const transaction = await sequelize.transaction();

  try {
    const [, [{ id }]] = await Conversation.update(
      {
        endedAt: new Date(),
      },
      {
        where: {
          [Op.or]: [
            {
              senderId: user1,
              receiverId: user2,
            },
            {
              senderId: user2,
              receiverId: user1,
            },
          ],
        },
        returning: true,
        transaction,
      }
    );

    const conversation = await Conversation.findByPk(id, { transaction });

    await transaction.commit();

    return conversation as TConversationWithUsers;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export function getNotEndedAdvisorConversation(userId: IUser["id"]) {
  return Conversation.findOne({
    where: {
      [Op.or]: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
      endedAt: null,
      isAdvise: true,
    },
  });
}

export function swapSenderAndReceiver<T extends TConversationWithUsers>(
  conversation: T
) {
  return conversation.set({
    sender: conversation.receiver,
    receiver: conversation.sender,
  });
}

