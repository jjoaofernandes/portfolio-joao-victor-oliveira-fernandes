import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Speed Dating Feature Routers
  speedDating: router({
    events: router({
      list: publicProcedure.query(async () => {
        return [
          {
            id: 1,
            title: "Speed Dating - Encontrinho",
            description: "Encontros rápidos de 3 minutos com pessoas incríveis",
            eventType: "general",
            startTime: new Date(),
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            maxParticipants: 50,
            currentParticipants: 12,
            callDurationSeconds: 180,
            status: "active",
          },
          {
            id: 2,
            title: "Speed Dating - Sexta à Noite",
            description: "Encontros especiais para o fim de semana",
            eventType: "general",
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
            maxParticipants: 100,
            currentParticipants: 0,
            callDurationSeconds: 180,
            status: "scheduled",
          },
        ];
      }),
    }),

    queue: router({
      join: protectedProcedure
        .input(z.object({ eventId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          return {
            success: true,
            message: "Você entrou na fila de espera",
            position: Math.floor(Math.random() * 10) + 1,
          };
        }),

      getStatus: protectedProcedure
        .input(z.object({ eventId: z.number() }))
        .query(async ({ ctx, input }) => {
          return {
            eventId: input.eventId,
            position: Math.floor(Math.random() * 10) + 1,
            estimatedWaitTime: Math.floor(Math.random() * 300) + 30,
            totalInQueue: Math.floor(Math.random() * 20) + 5,
          };
        }),
    }),

    calls: router({
      startSession: protectedProcedure
        .input(z.object({ eventId: z.number(), partnerId: z.number(), roomName: z.string() }))
        .mutation(async ({ ctx, input }) => {
          return {
            success: true,
            sessionId: Math.floor(Math.random() * 10000),
            roomName: input.roomName,
            jitsiUrl: `https://8x8.vc/vpaas-magic-cookie-free/${input.roomName}`,
          };
        }),

      endSession: protectedProcedure
        .input(z.object({ callSessionId: z.number(), durationSeconds: z.number(), rating: z.number().optional() }))
        .mutation(async ({ ctx, input }) => {
          return {
            success: true,
            message: "Encontro finalizado com sucesso",
          };
        }),
    }),

    matches: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        return [
          {
            id: 1,
            name: "Ana Silva",
            age: 26,
            bio: "Amante de viagens e café",
            photoUri: "https://via.placeholder.com/150",
            isMutualMatch: true,
            lastMessageTime: new Date(),
          },
          {
            id: 2,
            name: "Beatriz Santos",
            age: 24,
            bio: "Yoga e natureza",
            photoUri: "https://via.placeholder.com/150",
            isMutualMatch: true,
            lastMessageTime: new Date(),
          },
        ];
      }),

      recordLike: protectedProcedure
        .input(z.object({ callSessionId: z.number(), liked: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
          return {
            success: true,
            message: input.liked ? "Você curtiu este encontro!" : "Encontro pulado",
          };
        }),
    }),

    chat: router({
      sendMessage: protectedProcedure
        .input(z.object({ matchId: z.number(), message: z.string() }))
        .mutation(async ({ ctx, input }) => {
          return {
            success: true,
            messageId: Math.floor(Math.random() * 10000),
            timestamp: new Date(),
          };
        }),

      getMessages: protectedProcedure
        .input(z.object({ matchId: z.number() }))
        .query(async ({ input }) => {
          return [
            {
              id: 1,
              senderId: 1,
              senderName: "Você",
              message: "Oi! Como você está?",
              timestamp: new Date(Date.now() - 5 * 60 * 1000),
            },
            {
              id: 2,
              senderId: 2,
              senderName: "Ana Silva",
              message: "Oi! Tudo bem! Adorei nosso encontro 😊",
              timestamp: new Date(Date.now() - 2 * 60 * 1000),
            },
          ];
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
