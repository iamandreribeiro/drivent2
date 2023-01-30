import eventsService from "@/services/events-service";
import { resolve } from "dns";
import { Request, Response } from "express";
import httpStatus from "http-status";

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
    return res.status(200).send(tickets);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getUserTickets(_req: Request, res: Response) {
  try {
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
}