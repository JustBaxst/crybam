import { prisma } from "@/lib/prisma";
import { ChronicleFeed } from "@/components/ChronicleFeed";

export default async function PublicChroniclePage() {
    // Берем только публичные логи, чтобы не показывать технические детали
    const logs = await prisma.adminLog.findMany({
        where: { isPublic: true },
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 50, // Публичная лента не должна быть слишком длинной
    });

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Хроника Crybam</h1>
                <p className="text-sm text-muted mt-2">
                    Следите за тем, как наша база наполняется новыми дорамами и актерами.
                </p>
            </div>
            <ChronicleFeed logs={logs} />
        </div>
    );
}