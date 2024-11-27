import { FC } from "react";
import MypageCoupons from "./mypage-coupons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface MypageCouponsPageProps {}

const MypageCouponsPage: FC<MypageCouponsPageProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <MypageCoupons />
        </div>
    );
};

export default MypageCouponsPage;
