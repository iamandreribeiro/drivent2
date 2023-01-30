import eventsService from "@/services/events-service";
import { resolve } from "dns";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

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
    return res.status(500).send(error.message);
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
    console.log(error);
    return res.status(500).send(error.message);
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
    return res.status(500).send(error.message);
  }
}