import { Router, Request } from "express";
import JSONAPISerializer from "json-api-serializer";

export function getById<T>(type: string, router: Router, serializer: JSONAPISerializer, resolveFn: (req: Request) => Promise<T>) {
    router.get("/:id", async (req, res) => {
        const resolved = await resolveFn(req);
    
        res.send(await serializer.serializeAsync(type, resolved));
        res.status(200);
    });
}