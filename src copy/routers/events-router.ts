import { Router } from "express";
import { getDefaultEvent } from "@/controllers";
import { getTicketsTypes, getUserTickets }from "@/controllers";
import { authenticateToken } from "@/middlewares";

const eventsRouter = Router();

eventsRouter.get("/", getDefaultEvent);
eventsRouter.get("/tickets/types", authenticateToken, getTicketsTypes);
eventsRouter.get("/tickets", authenticateToken, getUserTickets);

export { eventsRouter };
