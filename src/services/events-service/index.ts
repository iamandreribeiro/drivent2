import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event, ProcessPayment, TicketType } from "@prisma/client";
import dayjs from "dayjs";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

async function getTickets(): Promise<TicketType[]> {
  const tickets = await eventRepository.findTickets();
  return tickets;
}

async function getUserTickets(id: number) {
  const tickets = await eventRepository.findUsertickets(id);

  if(!tickets) {
    return
  }

  const TicketType = await eventRepository.getTicketsTypesInfo(tickets.ticketTypeId);
  const userTicket = {
    id: tickets.id,
    status: tickets.status,
    ticketTypeId: tickets.ticketTypeId,
    enrollmentId: tickets.enrollmentId,

    TicketType,

    createdAt: tickets.createdAt,
    updatedAt: tickets.updatedAt
  }

  return userTicket;
}

async function postUserTicket(id: number, ticketTypeId: number) {
  if(!ticketTypeId) {
    return 400;
  }

  const tickets = await eventRepository.postUserTicket(id, ticketTypeId);

  if(!tickets) {
    return 404;
  }

  const TicketType = await eventRepository.getTicketsTypesInfo(tickets.ticketTypeId);

  const userTicket = {
    id: tickets.id,
    status: tickets.status,
    ticketTypeId: tickets.ticketTypeId,
    enrollmentId: tickets.enrollmentId,

    TicketType,

    createdAt: tickets.createdAt,
    updatedAt: tickets.updatedAt
  }

  return userTicket;
}

async function getPaymentInfo(ticketId: number, userId: number) {
  if(!ticketId) {
    return 400;
  }

  const paymentInfo = await eventRepository.findPaymentInfo(ticketId);

  if(!paymentInfo) {
    return 404
  }

  const enrollmentId = await eventRepository.findEnrollmentId(userId);

  if(!enrollmentId) {
    return;
  }

  const findTicket = await eventRepository.checkTicketByUserId(ticketId);

  if(findTicket.enrollmentId != enrollmentId) {
    return 401;
  }

  return paymentInfo;
}

async function insertPayment(payInfo: ProcessPayment, userId: number) {
  if(!payInfo.ticketId || !payInfo.cardData) {
    return 400;
  }

  const findTicket = await eventRepository.checkTicketByUserId(payInfo.ticketId);
  const enrollmentId = await eventRepository.findEnrollmentId(userId);

  if(!findTicket) {
    return 404;
  }

  if(findTicket.enrollmentId != enrollmentId) {
    return 401;
  }

  const makePayment = await eventRepository.makePayment(payInfo);

  return makePayment;
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
  getTickets,
  getUserTickets,
  postUserTicket,
  getPaymentInfo,
  insertPayment
};

export default eventsService;
