import { KitchenDemo } from "@/features/kitchen/kitchen-demo";

export default function KitchenPage() {
    return (
        <main className="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6">
            <h1 className="text-2xl font-semibold">Phiếu chế biến</h1>
            {process.env.NODE_ENV === "development" ? (
                <>
                    <p className="text-sm text-amber-900">
                        MÔ PHỎNG · Không có phiếu thật.
                    </p>
                    <KitchenDemo />
                </>
            ) : (
                <p
                    role="status"
                    className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm"
                >
                    Chưa kết nối được nguồn phiếu chế biến.
                </p>
            )}
        </main>
    );
}
