import { ResponseToolkit, ServerRoute } from "@hapi/hapi";

export const apiRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/push",
    handler: async function (request, h: ResponseToolkit) {
     console.log(request.raw);
     return "success"
    },
  }
];