import { json } from "@sveltejs/kit";
import { createHelia } from 'helia'
import { json as HeliaJson } from '@helia/json'
import type { RequestHandler } from "./$types";
import { CID } from 'multiformats/cid'

const helia = await createHelia();
const j = HeliaJson(helia);

export const GET: RequestHandler = async ({
    request
}) => {
    const queryParams = new URL(request.url).searchParams;

    const id = queryParams.get('id');

    if (!id) {
        return json({ content: "" });
    }

    try {
        const content = await j.get(CID.parse(id));

        return json({ content });
    } catch (error) {
        return json({ content: "" });
    }
}

export const POST: RequestHandler = async ({
    request
}) => {
    const { content } = await request.json();

    const cid = await j.add(content);

    return json({ id: cid.toString() });
}
