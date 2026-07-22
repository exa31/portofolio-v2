import {withAuth} from "~~/server/utils/withAuth";
import {findAll} from "~~/server/services/application.service";

export default withAuth(async (event) => {
    return await findAll(event);
});
