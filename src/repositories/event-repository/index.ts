import { prisma } from "@/config";
import { ProcessPayment, TicketStatus, TicketType } from "@prisma/client";

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

async function findFirstTicketType(ticketTypeId: number): Promise<TicketType> {
  const info = prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId
    }
  });

  return info;
}

async function makePayment(payInfo: ProcessPayment) {
  const arr = payInfo.cardData.number;
  const cardLastDigits = arr[arr.length-4] + arr[arr.length-3] + arr[arr.length-2] + arr[arr.length-1];
  const ticket = await checkTicketByUserId(payInfo.ticketId);
  const ticketType = await findFirstTicketType(ticket.id);

  if(!ticketType) {
    return 404;
  }

  return prisma.payment.create({
    data: {
      ticketId: payInfo.ticketId,
      value: ticketType.price,
      cardIssuer: payInfo.cardData.issuer,
      cardLastDigits
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
  checkTicketByUserId,
  makePayment
};

export default eventRepository;
