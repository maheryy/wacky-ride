import { Op } from "sequelize";
import sequelize, { db } from "../database/sequelize";
import {
  IConversation,
  TConversationWithUsers,
  TConversationWithUsersAndMessages,
} from "../types/conversation";
import { IUser } from "../types/user";

const { Conversation } = db;

export async function createConversation(
  senderId: IUser["id"],
  receiverId: IUser["id"]
) {
  const transaction = await sequelize.transaction();

  try {
    const { id } = await Conversation.create({
      senderId,
      receiverId,
    });

    const conversation = (await Conversation.findByPk(
      id
    )) as TConversationWithUsers;

    const isReceiver = conversation.receiver.id === receiverId;

    if (isReceiver) {
      return swapSenderAndReceiver(conversation);
    }

    await transaction.commit();

    return conversation;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export async function getConversation(
  userId: IUser["id"],
  conversationId: IConversation["id"]
) {
  const conversation = (await Conversation.scope("withMessages").findOne({
    where: {
      id: conversationId,
      [Op.or]: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
  })) as TConversationWithUsersAndMessages | null;

  const isReceiver = conversation?.receiver.id === userId;

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

export function getOrCreateConversation(
  userId1: IUser["id"],
  userId2: IUser["id"]
) {
  return Conversation.findOrCreate({
    defaults: {
      senderId: userId1,
      receiverId: userId2,
    },
    where: {
      [Op.or]: [
        {
          senderId: userId1,
          receiverId: userId2,
        },
        {
          senderId: userId2,
          receiverId: userId1,
        },
      ],
    },
  });
}

export async function endConversation(
  adminId: IUser["id"],
  conversationId: IConversation["id"]
) {
  const [, [conversation]] = await Conversation.update(
    {
      endedAt: new Date(),
    },
    {
      where: {
        id: conversationId,
        [Op.or]: [
          {
            senderId: adminId,
          },
          {
            receiverId: adminId,
          },
        ],
      },
      returning: true,
    }
  );

  return conversation;
}

export function getNotEndedConversation(userId: IUser["id"]) {
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
    },
  });
}

function swapSenderAndReceiver(conversation: TConversationWithUsers) {
  return conversation.set({
    sender: conversation.receiver,
    receiver: conversation.sender,
  });
}

