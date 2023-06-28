import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { clientPreferenceValidationSchema } from 'validationSchema/client-preferences';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.client_preference
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getClientPreferenceById();
    case 'PUT':
      return updateClientPreferenceById();
    case 'DELETE':
      return deleteClientPreferenceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getClientPreferenceById() {
    const data = await prisma.client_preference.findFirst(convertQueryToPrismaUtil(req.query, 'client_preference'));
    return res.status(200).json(data);
  }

  async function updateClientPreferenceById() {
    await clientPreferenceValidationSchema.validate(req.body);
    const data = await prisma.client_preference.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteClientPreferenceById() {
    const data = await prisma.client_preference.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
