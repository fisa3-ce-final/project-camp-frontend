import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { FailPage } from "./fail-page";

const Page = async () => {
    const session = await getServerSession(authOptions);

    return <FailPage idToken={session?.user.id_token} />;
};

export default Page;
