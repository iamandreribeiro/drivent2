import eventsService from "@/services/events-service";
import { resolve } from "dns";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { ProcessPayment } from "@prisma/client";

export async function getDefaultEvent(_req: Request, res: Response) {
  try {
    const event = await eventsService.getFirstEvent();
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicketsTypes(_req: Request, res: Response) {
  try {
    const tickets = await eventsService.getTickets();
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
   return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const tickets = await eventsService.getUserTickets(userId);

    if(!tickets) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
   return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function postUserTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketTypeId } = req.body;
  try {
    const insertTicket = await eventsService.postUserTicket(userId, ticketTypeId);
    if(insertTicket === 400) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if(insertTicket === 404) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    
    return res.status(httpStatus.OK).send(insertTicket);
  } catch (error) {
   return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketId } = req.query;
  try {
    const paymentInfo = await eventsService.getPaymentInfo(Number(ticketId), userId);

    if(paymentInfo === 400) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if(paymentInfo === 404) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(paymentInfo === 401) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.status(httpStatus.OK).send(paymentInfo);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const payInfo: ProcessPayment = req.body;

  try {
    const makePayment = await eventsService.insertPayment(payInfo, userId);

    if(makePayment === 400) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if(makePayment === 404) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(makePayment === 401) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.status(httpStatus.OK).send(makePayment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}