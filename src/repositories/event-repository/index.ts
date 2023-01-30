import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

async function findFirst() {
  return prisma.event.findFirst();
}

async function findTickets() {
  return prisma.ticketType.findMany();
}

async function findUsertickets(id: number) {
  const enrollmentId = await findEnrollmentId(id);

  if(enrollmentId === false) {
    return 
  }

  return prisma.ticket.findFirst({
    where: {
      id: enrollmentId
    }
  })
}

async function getTicketsTypesInfo(id: number) {
  return prisma.ticketType.findFirst({
    where: {
      id
    }
  })
}

async function findEnrollmentId(id: number): Promise <number | false> {
  const enrollmentId = await prisma.enrollment.findFirst({
    where: {
      userId: id
    }
  });

  if(!enrollmentId) {
    return false;
  }

  return enrollmentId.id;
}

async function postUserTicket(id: number, ticketTypeId: number) {
  const enrollmentId = await findEnrollmentId(id);
  const status: TicketStatus = "RESERVED";

  if(enrollmentId === false) {
    return
  }
  
    return prisma.ticket.create({
      data: {
        ticketTypeId,
        enrollmentId,
        status      
      }
    });
}

async function findPaymentInfo(id: number) {
  const payInfo = prisma.payment.findFirst({
    where: {
      ticketId: id
    }
  })

  return payInfo;
}

async function checkTicketByUserId(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId
    }
  })
}

const eventRepository = {
  findFirst,
  findTickets,
  findUsertickets,
  postUserTicket,
  getTicketsTypesInfo,
  findPaymentInfo,
  findEnrollmentId,
  checkTicketByUserId
};

export default eventRepository;
