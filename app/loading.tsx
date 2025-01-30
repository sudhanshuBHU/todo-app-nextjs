import { PuffLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <PuffLoader
                color="#000000"
                size={80}
            />
        </div>
    );
}