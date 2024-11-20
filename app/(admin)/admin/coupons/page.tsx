import { authOptions } from "@/app/lib/auth-options";
import { CouponData } from "@/app/types/admin-coupon";
import { getServerSession } from "next-auth";
import { FC } from "react";
import CouponPage from "./coupon-page";

interface CouponPageProps {}

const AdminCouponPage: FC<CouponPageProps> = async ({}) => {
    const session = await getServerSession(authOptions);
    const response = await fetch(
        process.env.BACKEND_URL + "/admin/coupon?page=0&size=10",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.id_token!}`,
            },
            cache: "no-store",
        }
    );

    const data: CouponData = await response.json();

    return (
        <div className="p-5">
            <CouponPage couponData={data} idToken={session?.user.id_token!} />
        </div>
    );
};

export default AdminCouponPage;
