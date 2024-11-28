import { FC } from "react";
import RentalList from "./rental-list";

interface RentalsPageProps {}

const RentalsPage: FC<RentalsPageProps> = async ({}) => {
    return (
        <div>
            <RentalList />
        </div>
    );
};

export default RentalsPage;
