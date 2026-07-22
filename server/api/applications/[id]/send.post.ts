import {withAuth} from "~~/server/utils/withAuth";
import {sendApplicationEmail} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    const {id} = event.context.params || {};
    const body = await readBody(event).catch(() => ({}));
    const code = body?.code || undefined;
    const attachCv = body?.attach_cv !== false;

    return await sendApplicationEmail(event, id, code, attachCv);
});
