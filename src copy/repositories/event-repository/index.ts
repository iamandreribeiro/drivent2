import { prisma } from "@/config";

async function findFirst() {
  return prisma.event.findFirst();
}

async function findTickets() {
  return prisma.ticketType.findMany();
}

const eventRepository = {
  findFirst,
  findTickets
};

export default eventRepository;
