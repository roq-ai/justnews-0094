import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { newsCategoryValidationSchema } from 'validationSchema/news-categories';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getNewsCategories();
    case 'POST':
      return createNewsCategory();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNewsCategories() {
    const data = await prisma.news_category
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'news_category'));
    return res.status(200).json(data);
  }

  async function createNewsCategory() {
    await newsCategoryValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.client_preference?.length > 0) {
      const create_client_preference = body.client_preference;
      body.client_preference = {
        create: create_client_preference,
      };
    } else {
      delete body.client_preference;
    }
    if (body?.news_card?.length > 0) {
      const create_news_card = body.news_card;
      body.news_card = {
        create: create_news_card,
      };
    } else {
      delete body.news_card;
    }
    const data = await prisma.news_category.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
