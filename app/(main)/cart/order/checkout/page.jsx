import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import CheckoutPage from "./checkout";

const Page = async () => {
    const session = await getServerSession(authOptions);
    
    return (
        <CheckoutPage 
            idToken={session?.user.id_token} 
        />
    );
};

export default Page;