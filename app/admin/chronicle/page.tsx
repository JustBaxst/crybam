import { prisma } from "@/lib/prisma";
import { ChronicleFeed } from "@/components/ChronicleFeed";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

export default async function AdminChroniclePage() {
    const logs = await prisma.adminLog.findMany({
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 100, // Показываем последние 100 событий
    });

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <AdminBreadcrumbs items={[{ label: "Хроника" }]} />
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Хроника событий</h1>
                <p className="text-sm text-muted mt-1">Последние действия в базе данных.</p>
            </div>
            <ChronicleFeed logs={logs} />
        </div>
    );
}