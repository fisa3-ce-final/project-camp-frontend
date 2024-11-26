import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import SuccessComponent from './SuccessComponent';

const Page = async () => {
    const session = await getServerSession(authOptions);
    
    return (
        <SuccessComponent 
            idToken={session?.user.id_token} 
        />
    );
};

export default Page;